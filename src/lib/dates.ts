import { TIME_ZONE } from '@/lib/rankings/fide'

export type CalendarDate = { year: number; month: number; day: number }

// Calendar date of an instant as seen in Sri Lanka.
export function colomboDate(value: string | Date): CalendarDate {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date(value))
    .split('-')
    .map(Number)
  return { year, month, day }
}

export function parseIsoDate(value: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const [year, month, day] = match.slice(1).map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return { year, month, day }
}

export const toIsoDate = ({ year, month, day }: CalendarDate) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

// Completed years between two calendar dates.
export function ageOn(birth: CalendarDate, on: CalendarDate) {
  let age = on.year - birth.year
  if (on.month < birth.month || (on.month === birth.month && on.day < birth.day)) age -= 1
  return age
}

const COLOMBO_OFFSET_MS = 5.5 * 60 * 60 * 1000

// UTC instant of midnight at the start of a Colombo calendar date.
export const colomboMidnight = ({ year, month, day }: CalendarDate) =>
  new Date(Date.UTC(year, month - 1, day) - COLOMBO_OFFSET_MS)
