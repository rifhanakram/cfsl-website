import { cached, TAGS } from '@/lib/cache'
import { getPayloadClient } from '@/lib/payload'

import { getEvents } from './events'

export const getHomepage = cached(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'homepage', depth: 1 })
  },
  'homepage',
  [TAGS.homepage, TAGS.news, TAGS.events],
)

export const getAnnouncements = cached(
  async (limit: number) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'news',
      where: { _status: { equals: 'published' }, isAnnouncement: { equals: true } },
      sort: '-publishedAt',
      limit,
      depth: 0,
      select: { title: true, slug: true, publishedAt: true },
    })
    return docs
  },
  'announcements',
  [TAGS.news],
)

// Events with results on chess-results.com that have started, newest first.
export const getRecentResults = cached(
  async (todayStart: string, limit: number) => {
    const payload = await getPayloadClient()
    const tomorrow = new Date(new Date(todayStart).getTime() + 24 * 60 * 60 * 1000).toISOString()
    const { docs } = await payload.find({
      collection: 'events',
      where: {
        _status: { equals: 'published' },
        chessResultsUrl: { exists: true },
        startDate: { less_than: tomorrow },
      },
      sort: '-startDate',
      limit,
      depth: 0,
      select: { title: true, slug: true, startDate: true, endDate: true, venue: true },
    })
    return docs
  },
  'recent-results',
  [TAGS.events],
)

export { getEvents }
