import type { Where } from 'payload'

import { cached, TAGS } from '@/lib/cache'
import { getPayloadClient } from '@/lib/payload'
import type { Club } from '@/payload-types'

export const CLUBS_PAGE_SIZE = 24

export type ClubStatus = Club['registration']
export type ClubDistrict = Club['district']
export type ClubContact = NonNullable<Club['contacts']>[number]

// Phone and email of a contact without "Show publicly" ticked must never leave
// the server, so drop the keys entirely rather than blanking them in JSX.
export function publicContacts(contacts: Club['contacts']): ClubContact[] {
  return (contacts ?? []).map(({ phone, email, ...contact }) =>
    contact.public ? { ...contact, phone, email } : contact,
  )
}

export const getClubs = cached(
  async ({
    q,
    district,
    status,
    page = 1,
  }: {
    q?: string
    district?: ClubDistrict
    status?: ClubStatus
    page?: number
  }) => {
    const payload = await getPayloadClient()
    const and: Where[] = [{ _status: { equals: 'published' } }]
    if (q) and.push({ or: [{ name: { like: q } }, { city: { like: q } }] })
    if (district) and.push({ district: { equals: district } })
    if (status) and.push({ registration: { equals: status } })
    // Contacts are deliberately not selected: the list never shows them.
    return payload.find({
      collection: 'clubs',
      where: { and },
      sort: 'name',
      page,
      limit: CLUBS_PAGE_SIZE,
      depth: 1,
      select: { name: true, slug: true, registration: true, lastRenewed: true, logo: true, district: true, city: true },
    })
  },
  'clubs',
  [TAGS.clubs],
)

// Districts that have at least one published club, for the filter dropdown.
export const getClubDistricts = cached(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'clubs',
      where: { _status: { equals: 'published' } },
      pagination: false,
      depth: 0,
      select: { district: true },
    })
    return [...new Set(docs.map((d) => d.district))]
  },
  'club-districts',
  [TAGS.clubs],
)

export const getClub = cached(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'clubs',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    const club = docs[0]
    // Strip before returning so private details never enter the data cache either.
    return club ? { ...club, contacts: publicContacts(club.contacts) } : null
  },
  'club',
  [TAGS.clubs],
)

export type ClubListItem = Awaited<ReturnType<typeof getClubs>>['docs'][number]
export type ClubProfile = NonNullable<Awaited<ReturnType<typeof getClub>>>
