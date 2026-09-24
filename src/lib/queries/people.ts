import { cached, TAGS } from '@/lib/cache'
import { getPayloadClient } from '@/lib/payload'

export const getCurrentPeople = cached(
  async (todayStart: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'people',
      where: { or: [{ termEnd: { exists: false } }, { termEnd: { greater_than_equal: todayStart } }] },
      sort: ['order', 'name'],
      pagination: false,
      depth: 1,
    })
    return docs
  },
  'people',
  [TAGS.people],
)
