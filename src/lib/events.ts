export const EVENT_TYPES = [
  { label: 'Tournament', value: 'tournament' },
  { label: 'School chess', value: 'school' },
  { label: 'Deadline', value: 'deadline' },
  { label: 'National team', value: 'national-team' },
  { label: 'Seminar', value: 'seminar' },
] as const

export type EventType = (typeof EVENT_TYPES)[number]['value']

export const eventTypeLabel = (value: string) =>
  EVENT_TYPES.find((t) => t.value === value)?.label ?? value

export const REGISTRATION_FIELDS = [
  { name: 'dateOfBirth', label: 'Date of birth', defaultMode: 'required' },
  { name: 'sex', label: 'Sex', defaultMode: 'optional' },
  { name: 'email', label: 'Email', defaultMode: 'optional' },
  { name: 'phone', label: 'Phone / WhatsApp', defaultMode: 'required' },
  { name: 'schoolOrClub', label: 'School or club', defaultMode: 'optional' },
  { name: 'coach', label: 'Coach', defaultMode: 'hidden' },
  { name: 'rating', label: 'Rating', defaultMode: 'optional' },
] as const

export type RegistrationFieldName = (typeof REGISTRATION_FIELDS)[number]['name']
export type FieldMode = 'required' | 'optional' | 'hidden'

export const isChessResultsUrl = (value: string) => {
  try {
    const { hostname, protocol } = new URL(value)
    return protocol === 'https:' && (hostname === 'chess-results.com' || hostname.endsWith('.chess-results.com'))
  } catch {
    return false
  }
}
