import { describe, expect, it } from 'vitest'

import { toCsv } from '@/lib/export/csv'
import { playerLine, toTrf } from '@/lib/export/trf'
import type { ExportEntry } from '@/lib/export/types'

const entry = (overrides: Partial<ExportEntry> = {}): ExportEntry => ({
  sectionName: 'Open',
  lastName: 'Perera',
  otherNames: 'Kasun Nuwan',
  fideId: '4901234',
  rating: 1850,
  dateOfBirth: '2010-04-03',
  sex: 'm',
  createdAt: '2026-09-01T00:00:00.000Z',
  ...overrides,
})

describe('playerLine', () => {
  it('places each TRF-16 field in its columns', () => {
    const line = playerLine(entry(), 1)
    const col = (start: number, end: number) => line.slice(start - 1, end)
    expect(col(1, 3)).toBe('001')
    expect(col(5, 8)).toBe('   1')
    expect(col(10, 10)).toBe('m')
    expect(col(11, 13)).toBe('   ')
    expect(col(15, 47).trimEnd()).toBe('Perera, Kasun Nuwan')
    expect(col(49, 52)).toBe('1850')
    expect(col(54, 56)).toBe('SRI')
    expect(col(58, 68)).toBe('    4901234')
    expect(col(70, 79)).toBe('2010/04/03')
    expect(col(81, 84)).toBe(' 0.0')
    expect(col(86, 89)).toBe('   1')
  })

  it('leaves rating, FIDE ID and sex blank when unknown', () => {
    const line = playerLine(entry({ rating: null, fideId: null, sex: null }), 12)
    expect(line.slice(9, 10)).toBe(' ')
    expect(line.slice(48, 52)).toBe('    ')
    expect(line.slice(57, 68).trim()).toBe('')
  })
})

describe('toTrf', () => {
  it('writes headers and seeds by rating, then name', () => {
    const trf = toTrf({ title: 'Nationals', startDate: '2026-09-29T18:30:00.000Z', venue: 'Colombo' }, [
      entry({ lastName: 'Silva', rating: 1500 }),
      entry({ lastName: 'Bandara', rating: null }),
      entry({ lastName: 'Fernando', rating: 2000 }),
      entry({ lastName: 'Alwis', rating: 1500 }),
    ])
    const lines = trf.trimEnd().split('\r\n')
    expect(lines.slice(0, 7)).toEqual([
      '012 Nationals',
      '022 Colombo',
      '032 SRI',
      '042 2026/09/30',
      '052 2026/09/30',
      '062 4',
      '072 3',
    ])
    expect(lines.slice(7).map((l) => l.slice(14, 47).split(',')[0])).toEqual([
      'Fernando',
      'Alwis',
      'Silva',
      'Bandara',
    ])
  })
})

describe('toCsv', () => {
  it('quotes commas and neutralises formulas', () => {
    const csv = toCsv([entry({ schoolOrClub: 'Royal College, Colombo', coach: '=HYPERLINK("x")' })])
    expect(csv.startsWith('﻿Section,')).toBe(true)
    expect(csv).toContain('"Royal College, Colombo"')
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`)
  })
})
