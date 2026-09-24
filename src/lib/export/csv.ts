import type { ExportEntry } from './types'

const COLUMNS: [string, (entry: ExportEntry) => unknown][] = [
  ['Section', (e) => e.sectionName],
  ['Last name', (e) => e.lastName],
  ['Other names', (e) => e.otherNames],
  ['FIDE ID', (e) => e.fideId],
  ['Rating', (e) => e.rating],
  ['Date of birth', (e) => e.dateOfBirth],
  ['Sex', (e) => e.sex],
  ['Email', (e) => e.email],
  ['Phone', (e) => e.phone],
  ['School or club', (e) => e.schoolOrClub],
  ['Coach', (e) => e.coach],
  ['Guardian name', (e) => e.guardianName],
  ['Guardian contact', (e) => e.guardianContact],
  ['Paid', (e) => (e.paid ? 'Yes' : 'No')],
  ['Registered at', (e) => e.createdAt],
]

function cell(value: unknown) {
  const text = value == null ? '' : String(value)
  // Prefixing formula characters stops spreadsheets from executing submitted text.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

export function toCsv(entries: ExportEntry[]) {
  const rows = [COLUMNS.map(([header]) => header), ...entries.map((e) => COLUMNS.map(([, get]) => get(e)))]
  // The BOM makes Excel read the file as UTF-8.
  return '﻿' + rows.map((row) => row.map(cell).join(',')).join('\r\n') + '\r\n'
}
