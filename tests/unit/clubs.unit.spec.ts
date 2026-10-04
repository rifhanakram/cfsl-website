import { describe, expect, it, vi } from 'vitest'

// The query module pulls in the Payload client; only the pure helper is under test.
vi.mock('@/lib/payload', () => ({ getPayloadClient: vi.fn() }))

import { publicContacts } from '@/lib/queries/clubs'

const contact = { name: 'Nimal Silva', role: 'Secretary', phone: '+94 77 123 4567', email: 'nimal@example.lk', id: 'c1' }

describe('publicContacts', () => {
  it('keeps phone and email for public contacts', () => {
    expect(publicContacts([{ ...contact, public: true }])).toEqual([{ ...contact, public: true }])
  })

  it('removes the phone and email keys for private contacts', () => {
    const [stripped] = publicContacts([{ ...contact, public: false }])
    expect(stripped).toEqual({ name: 'Nimal Silva', role: 'Secretary', public: false, id: 'c1' })
    expect('phone' in stripped).toBe(false)
    expect('email' in stripped).toBe(false)
  })

  it('treats an unset public flag as private', () => {
    const [nullFlag, missingFlag] = publicContacts([{ ...contact, public: null }, contact])
    expect(nullFlag).not.toHaveProperty('phone')
    expect(missingFlag).not.toHaveProperty('email')
    expect(JSON.stringify([nullFlag, missingFlag])).not.toMatch(/123 4567|example\.lk/)
  })

  it('keeps name and role for every contact and preserves order', () => {
    const result = publicContacts([
      { ...contact, public: false },
      { ...contact, name: 'Kumari Perera', role: 'President', public: true },
    ])
    expect(result.map((c) => [c.name, c.role])).toEqual([
      ['Nimal Silva', 'Secretary'],
      ['Kumari Perera', 'President'],
    ])
  })

  it('returns an empty list when there are no contacts', () => {
    expect(publicContacts(null)).toEqual([])
    expect(publicContacts(undefined)).toEqual([])
  })
})
