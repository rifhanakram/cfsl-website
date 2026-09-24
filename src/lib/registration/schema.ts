import { z } from 'zod'

import { parseIsoDate } from '@/lib/dates'
import type { FieldMode } from '@/lib/events'

import { needsGuardian, type FieldModes } from './rules'

const blank = (value: unknown) => (typeof value === 'string' && value.trim() === '' ? undefined : value)

function byMode<T extends z.ZodType>(mode: FieldMode, schema: T, label: string) {
  if (mode === 'hidden') return z.unknown().optional().transform(() => undefined)
  if (mode === 'optional') return z.preprocess(blank, schema.optional())
  return z.preprocess(blank, z.any().refine((v) => v !== undefined, `${label} is required`).pipe(schema))
}

const text = (max: number) => z.string().trim().max(max, `Must be ${max} characters or fewer`)

const dateOfBirth = z
  .string()
  .refine((v) => parseIsoDate(v) !== null, 'Enter a valid date')
  .refine((v) => new Date(v) <= new Date(), 'Date of birth cannot be in the future')

export function registrationSchema(modes: FieldModes, startDate: string) {
  return z
    .object({
      sectionId: z.string({ error: 'Choose a section' }).min(1, 'Choose a section'),
      lastName: z.preprocess(blank, text(100).min(1).optional()).refine((v) => v, 'Last name is required'),
      otherNames: z.preprocess(blank, text(150).min(1).optional()).refine((v) => v, 'Other names are required'),
      fideId: z.preprocess(blank, z.string().trim().regex(/^\d{1,10}$/, 'FIDE ID is a number of up to 10 digits').optional()),
      dateOfBirth: byMode(modes.dateOfBirth, dateOfBirth, 'Date of birth'),
      sex: byMode(modes.sex, z.enum(['m', 'w'], { error: 'Choose one' }), 'Sex'),
      email: byMode(modes.email, z.email('Enter a valid email address'), 'Email'),
      phone: byMode(
        modes.phone,
        z.string().trim().regex(/^\+?[\d\s()-]{7,20}$/, 'Enter a valid phone number'),
        'Phone number',
      ),
      schoolOrClub: byMode(modes.schoolOrClub, text(150), 'School or club'),
      coach: byMode(modes.coach, text(150), 'Coach'),
      rating: byMode(
        modes.rating,
        z.coerce.number({ error: 'Enter a number' }).int('Enter a whole number').min(0).max(3500, 'Enter a rating up to 3500'),
        'Rating',
      ),
      guardianName: z.preprocess(blank, text(150).optional()),
      guardianContact: z.preprocess(blank, text(150).optional()),
    })
    .superRefine((data, ctx) => {
      if (!needsGuardian(data.dateOfBirth, startDate)) return
      if (!data.guardianName) ctx.addIssue({ code: 'custom', path: ['guardianName'], message: 'Guardian name is required for players under 18' })
      if (!data.guardianContact) ctx.addIssue({ code: 'custom', path: ['guardianContact'], message: 'Guardian contact is required for players under 18' })
    })
}

export type RegistrationInput = z.infer<ReturnType<typeof registrationSchema>>
