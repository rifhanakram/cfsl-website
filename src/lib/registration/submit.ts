'use server'

import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import { updateTag } from 'next/cache'
import { headers } from 'next/headers'
import { createLocalReq } from 'payload'
import { z } from 'zod'

import { TAGS } from '@/lib/cache'
import { getPayloadClient } from '@/lib/payload'

import { ageReferenceDate, fieldModes, registrationStatus, sectionIneligibility } from './rules'
import { registrationSchema } from './schema'
import { verifyTurnstile } from './turnstile'

export type RegistrationState = {
  status: 'idle' | 'error' | 'success'
  attempt: number
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
  values?: Record<string, string>
}

class RegistrationError extends Error {
  constructor(
    message: string,
    readonly fieldErrors?: RegistrationState['fieldErrors'],
  ) {
    super(message)
  }
}

const isUniqueViolation = (error: unknown) =>
  typeof error === 'object' && error !== null && JSON.stringify(error, Object.getOwnPropertyNames(error)).includes('23505')

export async function submitRegistration(
  eventId: number,
  previous: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const attempt = previous.attempt + 1
  const values = Object.fromEntries(
    [...formData.entries()].filter(([key, v]) => typeof v === 'string' && !key.startsWith('cf-')),
  ) as Record<string, string>
  const fail = (message: string, fieldErrors?: RegistrationState['fieldErrors']): RegistrationState => ({
    status: 'error',
    attempt,
    message,
    fieldErrors,
    values,
  })

  const requestHeaders = await headers()
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  const human = await verifyTurnstile(formData.get('cf-turnstile-response') as string | null, ip)
  if (!human) return fail('Please complete the verification check and try again.')

  const payload = await getPayloadClient()
  // Read fresh, not from the page cache: the window and sections must be current.
  const event = await payload
    .findByID({ collection: 'events', id: eventId, depth: 0, draft: false })
    .catch(() => null)
  if (!event || event._status !== 'published') return fail('This event is no longer available.')

  const status = registrationStatus(event.registration)
  if (status !== 'open') {
    return fail(status === 'not-open' ? 'Registration has not opened yet.' : 'Registration is closed.')
  }

  const parsed = registrationSchema(fieldModes(event.registration), event.startDate).safeParse(values)
  if (!parsed.success) return fail('Please correct the highlighted fields.', z.flattenError(parsed.error).fieldErrors)
  const input = parsed.data

  const section = event.registration?.sections?.find((s) => s.id === input.sectionId)
  if (!section) return fail('Please correct the highlighted fields.', { sectionId: ['Choose a section'] })
  const ineligible = sectionIneligibility(section, input, ageReferenceDate(event))
  if (ineligible) return fail('Please correct the highlighted fields.', { sectionId: [ineligible] })

  const req = await createLocalReq({}, payload)
  const transactionID = await payload.db.beginTransaction()
  if (!transactionID) return fail('Something went wrong. Please try again.')
  req.transactionID = transactionID

  try {
    // Serialises submissions per event so the capacity and duplicate checks can't race.
    const tx = (payload.db as unknown as PostgresAdapter).sessions[await transactionID].db
    await tx.execute(sql`SELECT id FROM events WHERE id = ${event.id} FOR UPDATE`)

    if (input.fideId) {
      const duplicate = await payload.count({
        collection: 'registrations',
        where: { event: { equals: event.id }, fideId: { equals: input.fideId } },
        req,
      })
      if (duplicate.totalDocs > 0) {
        throw new RegistrationError('This player is already registered for this event.', {
          fideId: ['A player with this FIDE ID is already registered.'],
        })
      }
    }

    const taken = await payload.count({
      collection: 'registrations',
      where: { event: { equals: event.id }, sectionId: { equals: section.id } },
      req,
    })
    if (taken.totalDocs >= section.capacity) {
      throw new RegistrationError(`${section.name} is full.`, { sectionId: [`${section.name} is full.`] })
    }

    await payload.create({
      collection: 'registrations',
      data: {
        event: event.id,
        sectionId: section.id!,
        sectionName: section.name,
        lastName: input.lastName!,
        otherNames: input.otherNames!,
        fideId: input.fideId ?? null,
        dateOfBirth: input.dateOfBirth ?? null,
        sex: input.sex ?? null,
        email: input.email ?? null,
        phone: input.phone ?? null,
        schoolOrClub: input.schoolOrClub ?? null,
        coach: input.coach ?? null,
        rating: input.rating ?? null,
        guardianName: input.guardianName ?? null,
        guardianContact: input.guardianContact ?? null,
      },
      req,
      overrideAccess: true,
    })
    await payload.db.commitTransaction(transactionID)
    // The collection hook fired before commit; expire again so readers see the new entry.
    updateTag(TAGS.registrations)
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID)
    if (error instanceof RegistrationError) return fail(error.message, error.fieldErrors)
    if (isUniqueViolation(error)) {
      return fail('This player is already registered for this event.', {
        fideId: ['A player with this FIDE ID is already registered.'],
      })
    }
    payload.logger.error({ err: error, msg: 'Registration failed' })
    return fail('Something went wrong. Please try again.')
  }

  return {
    status: 'success',
    attempt,
    message: `${input.otherNames} ${input.lastName} is registered in ${section.name}.`,
  }
}
