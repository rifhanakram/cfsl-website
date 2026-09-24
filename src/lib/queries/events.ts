import type { Where } from 'payload'

import { cached, TAGS } from '@/lib/cache'
import { colomboDate, colomboMidnight } from '@/lib/dates'
import type { EventType } from '@/lib/events'
import { getPayloadClient } from '@/lib/payload'

export const EVENTS_PAGE_SIZE = 20

const LIST_SELECT = {
  title: true,
  slug: true,
  type: true,
  startDate: true,
  endDate: true,
  venue: true,
  summary: true,
  chessResultsUrl: true,
  registration: { enabled: true, opensAt: true, closesAt: true, sections: true },
} as const

// An event stays "upcoming" until its last day has ended in Colombo.
function upcomingWhere(todayStart: string): Where {
  return {
    or: [
      { endDate: { greater_than_equal: todayStart } },
      { and: [{ endDate: { exists: false } }, { startDate: { greater_than_equal: todayStart } }] },
    ],
  }
}

function pastWhere(todayStart: string): Where {
  return {
    or: [
      { endDate: { less_than: todayStart } },
      { and: [{ endDate: { exists: false } }, { startDate: { less_than: todayStart } }] },
    ],
  }
}

export const todayStartIso = (now = new Date()) => colomboMidnight(colomboDate(now)).toISOString()

export const getEvents = cached(
  async ({
    when,
    type,
    page = 1,
    todayStart,
    limit = EVENTS_PAGE_SIZE,
  }: {
    when: 'upcoming' | 'past'
    type?: EventType
    page?: number
    todayStart: string
    limit?: number
  }) => {
    const payload = await getPayloadClient()
    const and: Where[] = [
      { _status: { equals: 'published' } },
      when === 'upcoming' ? upcomingWhere(todayStart) : pastWhere(todayStart),
    ]
    if (type) and.push({ type: { equals: type } })
    return payload.find({
      collection: 'events',
      where: { and },
      sort: when === 'upcoming' ? 'startDate' : '-startDate',
      page,
      limit,
      depth: 0,
      select: LIST_SELECT,
    })
  },
  'events',
  [TAGS.events],
)

export const getEvent = cached(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'events',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    return docs[0] ?? null
  },
  'event',
  [TAGS.events],
)

export type EventListItem = Awaited<ReturnType<typeof getEvents>>['docs'][number]
