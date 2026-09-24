import { TIME_ZONE } from '@/lib/rankings/fide'

export function formatDate(value: string | Date, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(value))
}

export function formatDateRange(start: string, end?: string | null) {
  if (!end || formatDate(start) === formatDate(end)) return formatDate(start)
  return `${formatDate(start)} – ${formatDate(end)}`
}
