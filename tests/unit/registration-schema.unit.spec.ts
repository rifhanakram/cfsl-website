import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { fieldModes } from '@/lib/registration/rules'
import { registrationSchema } from '@/lib/registration/schema'

const START = '2026-09-29T18:30:00.000Z'
const modes = fieldModes({ sections: [{ name: 'U12', maxAge: 12, capacity: 10 }] })
const schema = registrationSchema(modes, START)

const valid = {
  sectionId: 'abc',
  lastName: 'Perera',
  otherNames: 'Kasun',
  fideId: '',
  dateOfBirth: '2016-05-01',
  sex: 'm',
  email: '',
  phone: '+94 77 123 4567',
  schoolOrClub: 'Royal College',
  rating: '',
  guardianName: 'Nimal Perera',
  guardianContact: '0771234567',
}

const errors = (input: Record<string, unknown>) => {
  const result = schema.safeParse(input)
  return result.success ? {} : z.flattenError(result.error).fieldErrors
}

describe('registrationSchema', () => {
  it('accepts a valid junior entry and drops blank optionals', () => {
    const result = schema.safeParse(valid)
    expect(result.success).toBe(true)
    expect(result.data?.fideId).toBeUndefined()
    expect(result.data?.email).toBeUndefined()
  })

  it('requires names and default-required fields', () => {
    const e = errors({ ...valid, lastName: ' ', phone: '' })
    expect(e.lastName?.[0]).toMatch(/Last name is required/)
    expect(e.phone?.[0]).toMatch(/Phone number is required/)
  })

  it('requires guardian details for under-18s only', () => {
    expect(errors({ ...valid, guardianName: '' }).guardianName?.[0]).toMatch(/under 18/)
    expect(errors({ ...valid, dateOfBirth: '1990-01-01', guardianName: '', guardianContact: '' })).toEqual({})
  })

  it('validates FIDE ID and email formats', () => {
    const e = errors({ ...valid, fideId: 'abc', email: 'nope' })
    expect(e.fideId).toBeDefined()
    expect(e.email).toBeDefined()
  })

  it('ignores hidden fields', () => {
    const hidden = registrationSchema({ ...modes, coach: 'hidden' }, START)
    expect(hidden.safeParse({ ...valid, coach: 'Someone' }).data?.coach).toBeUndefined()
  })
})
