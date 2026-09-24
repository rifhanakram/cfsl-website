import { describe, expect, it } from 'vitest'

import { ageOn, colomboDate, parseIsoDate } from '@/lib/dates'
import {
  ageReferenceDate,
  fieldModes,
  needsGuardian,
  registrationStatus,
  sectionIneligibility,
  type Section,
} from '@/lib/registration/rules'

// A day-only date picked in Colombo is stored as local midnight in UTC.
const START = '2026-09-29T18:30:00.000Z' // 30 Sept 2026 in Colombo

const u6: Section = { name: 'U6', maxAge: 6, capacity: 10 }

describe('dates', () => {
  it('reads calendar dates in Colombo time', () => {
    expect(colomboDate(START)).toEqual({ year: 2026, month: 9, day: 30 })
  })

  it('rejects impossible dates', () => {
    expect(parseIsoDate('2026-02-30')).toBeNull()
  })

  it('counts completed years', () => {
    expect(ageOn({ year: 2020, month: 1, day: 2 }, { year: 2026, month: 1, day: 1 })).toBe(5)
    expect(ageOn({ year: 2020, month: 1, day: 1 }, { year: 2026, month: 1, day: 1 })).toBe(6)
  })
})

describe('age reference date', () => {
  it('uses 1 January of the event year by default', () => {
    expect(ageReferenceDate({ startDate: START, registration: {} })).toEqual({ year: 2026, month: 1, day: 1 })
  })

  it('uses 31 December when configured', () => {
    expect(ageReferenceDate({ startDate: START, registration: { ageReferenceDate: 'dec-31' } })).toEqual({
      year: 2026,
      month: 12,
      day: 31,
    })
  })
})

describe('sectionIneligibility', () => {
  const jan1 = { year: 2026, month: 1, day: 1 }
  const dec31 = { year: 2026, month: 12, day: 31 }

  it('accepts a player under 6 on 1 January', () => {
    expect(sectionIneligibility(u6, { dateOfBirth: '2020-01-02' }, jan1)).toBeNull()
  })

  it('rejects a player who turned 6 on 1 January', () => {
    expect(sectionIneligibility(u6, { dateOfBirth: '2020-01-01' }, jan1)).toMatch(/under 6/)
  })

  it('rejects the same player with a 31 December reference', () => {
    expect(sectionIneligibility(u6, { dateOfBirth: '2020-01-02' }, dec31)).toMatch(/under 6/)
  })

  it('enforces rating bounds', () => {
    const section: Section = { name: 'Rated', minRating: 1400, maxRating: 1800, capacity: 5 }
    expect(sectionIneligibility(section, { rating: 1399 }, jan1)).toMatch(/at least 1400/)
    expect(sectionIneligibility(section, { rating: 1801 }, jan1)).toMatch(/1800 or below/)
    expect(sectionIneligibility(section, { rating: 1500 }, jan1)).toBeNull()
  })
})

describe('needsGuardian', () => {
  it('requires a guardian for players under 18 on the start date', () => {
    expect(needsGuardian('2008-10-01', START)).toBe(true)
    expect(needsGuardian('2008-09-30', START)).toBe(false)
  })
})

describe('registrationStatus', () => {
  const base = { enabled: true, sections: [u6] }
  const now = new Date('2026-09-01T00:00:00Z')

  it('is disabled without sections', () => {
    expect(registrationStatus({ enabled: true, sections: [] }, now)).toBe('disabled')
  })

  it('follows the window', () => {
    expect(registrationStatus({ ...base, opensAt: '2026-09-02T00:00:00Z' }, now)).toBe('not-open')
    expect(registrationStatus({ ...base, closesAt: '2026-09-01T00:00:00Z' }, now)).toBe('closed')
    expect(registrationStatus({ ...base, closesAt: '2026-09-10T00:00:00Z' }, now)).toBe('open')
  })
})

describe('fieldModes', () => {
  it('forces date of birth and rating when sections need them', () => {
    const modes = fieldModes({
      fields: { dateOfBirth: 'hidden', rating: 'hidden' },
      sections: [u6, { name: 'Open', minRating: 1000, capacity: 5 }],
    })
    expect(modes.dateOfBirth).toBe('required')
    expect(modes.rating).toBe('required')
  })
})
