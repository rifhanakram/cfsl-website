import { colomboDate } from '@/lib/dates'

import type { ExportEntry, ExportEvent } from './types'

const FEDERATION = 'SRI'

const trfDate = (iso: string) => {
  const { year, month, day } = colomboDate(iso)
  return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
}

// Writes `value` into the line at 1-indexed column `start`, clipped to `width`.
function put(line: string[], start: number, width: number, value: string, align: 'left' | 'right' = 'left') {
  const clipped = value.slice(0, width)
  const padded = align === 'right' ? clipped.padStart(width) : clipped.padEnd(width)
  for (let i = 0; i < width; i++) line[start - 1 + i] = padded[i]
}

export function seedOrder(entries: ExportEntry[]) {
  return [...entries].sort(
    (a, b) =>
      (b.rating ?? 0) - (a.rating ?? 0) ||
      a.lastName.localeCompare(b.lastName) ||
      a.otherNames.localeCompare(b.otherNames),
  )
}

// One 001 line per TRF-16: rank 5-8, sex 10, title 11-13, name 15-47, rating 49-52,
// federation 54-56, FIDE ID 58-68, birth date 70-79, points 81-84, rank 86-89.
export function playerLine(entry: ExportEntry, startRank: number) {
  const line = Array<string>(89).fill(' ')
  put(line, 1, 3, '001')
  put(line, 5, 4, String(startRank), 'right')
  put(line, 10, 1, entry.sex ?? ' ')
  put(line, 15, 33, `${entry.lastName.trim()}, ${entry.otherNames.trim()}`)
  if (entry.rating) put(line, 49, 4, String(entry.rating), 'right')
  put(line, 54, 3, FEDERATION)
  if (entry.fideId) put(line, 58, 11, entry.fideId, 'right')
  if (entry.dateOfBirth) put(line, 70, 10, entry.dateOfBirth.replace(/-/g, '/'))
  put(line, 81, 4, '0.0', 'right')
  put(line, 86, 4, String(startRank), 'right')
  return line.join('').trimEnd()
}

export function toTrf(event: ExportEvent, entries: ExportEntry[]) {
  const players = seedOrder(entries)
  const lines = [
    `012 ${event.title}`,
    ...(event.venue ? [`022 ${event.venue}`] : []),
    `032 ${FEDERATION}`,
    `042 ${trfDate(event.startDate)}`,
    `052 ${trfDate(event.endDate ?? event.startDate)}`,
    `062 ${players.length}`,
    `072 ${players.filter((p) => p.rating).length}`,
    ...players.map((entry, i) => playerLine(entry, i + 1)),
  ]
  return lines.join('\r\n') + '\r\n'
}
