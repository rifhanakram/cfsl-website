import { cached, TAGS } from '@/lib/cache'
import { getPayloadClient } from '@/lib/payload'

// Only the fields shown on the public entry list ever leave this query.
export const getPublicEntries = cached(
  async (eventId: number) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'registrations',
      where: { event: { equals: eventId } },
      sort: 'displayName',
      pagination: false,
      depth: 0,
      select: { displayName: true, fideId: true, rating: true, schoolOrClub: true, sectionId: true, sectionName: true },
    })
    return docs.map(({ id, displayName, fideId, rating, schoolOrClub, sectionId, sectionName }) => ({
      id,
      displayName,
      fideId,
      rating,
      schoolOrClub,
      sectionId,
      sectionName,
    }))
  },
  'public-entries',
  [TAGS.registrations],
)

export type PublicEntry = Awaited<ReturnType<typeof getPublicEntries>>[number]
