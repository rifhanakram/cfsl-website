import { ageOn, colomboDate, parseIsoDate, type CalendarDate } from '@/lib/dates'
import { REGISTRATION_FIELDS, type FieldMode, type RegistrationFieldName } from '@/lib/events'
import type { Event } from '@/payload-types'

export type Registration = NonNullable<Event['registration']>
export type Section = NonNullable<Registration['sections']>[number]
export type FieldModes = Record<RegistrationFieldName, FieldMode>

type RegistrationLike =
  | (Partial<Pick<Registration, 'enabled' | 'opensAt' | 'closesAt' | 'sections' | 'ageReferenceDate'>> & {
      fields?: Partial<FieldModes> | null
    })
  | null
  | undefined

export const GUARDIAN_AGE = 18

export type WindowStatus = 'disabled' | 'not-open' | 'open' | 'closed'

export function registrationStatus(registration: RegistrationLike, now = new Date()): WindowStatus {
  if (!registration?.enabled || !registration.sections?.length) return 'disabled'
  if (registration.opensAt && now < new Date(registration.opensAt)) return 'not-open'
  if (registration.closesAt && now >= new Date(registration.closesAt)) return 'closed'
  return 'open'
}

export function ageReferenceDate(event: { startDate: string; registration?: RegistrationLike }): CalendarDate {
  const { year } = colomboDate(event.startDate)
  return event.registration?.ageReferenceDate === 'dec-31'
    ? { year, month: 12, day: 31 }
    : { year, month: 1, day: 1 }
}

// Age limits need a date of birth and rating limits need a rating, whatever the admin chose.
export function fieldModes(registration: RegistrationLike): FieldModes {
  const sections = registration?.sections ?? []
  const modes = Object.fromEntries(
    REGISTRATION_FIELDS.map(({ name, defaultMode }) => [name, registration?.fields?.[name] ?? defaultMode]),
  ) as FieldModes
  if (sections.some((s) => s.maxAge)) modes.dateOfBirth = 'required'
  if (sections.some((s) => s.minRating != null || s.maxRating != null)) modes.rating = 'required'
  return modes
}

export function needsGuardian(dateOfBirth: string | undefined, startDate: string) {
  const birth = dateOfBirth ? parseIsoDate(dateOfBirth) : null
  return birth ? ageOn(birth, colomboDate(startDate)) < GUARDIAN_AGE : false
}

export function sectionIneligibility(
  section: Section,
  player: { dateOfBirth?: string; rating?: number | null },
  referenceDate: CalendarDate,
): string | null {
  if (section.maxAge) {
    const birth = player.dateOfBirth ? parseIsoDate(player.dateOfBirth) : null
    if (!birth) return 'Date of birth is required for this section.'
    if (ageOn(birth, referenceDate) >= section.maxAge) {
      return `${section.name} is for players under ${section.maxAge} on the age reference date.`
    }
  }
  const rating = player.rating ?? 0
  if (section.minRating != null && rating < section.minRating) {
    return `${section.name} requires a rating of at least ${section.minRating}.`
  }
  if (section.maxRating != null && rating > section.maxRating) {
    return `${section.name} is for players rated ${section.maxRating} or below.`
  }
  return null
}
