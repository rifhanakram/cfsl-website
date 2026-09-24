import type { Where } from 'payload'

import { cached, TAGS } from '@/lib/cache'
import { getPayloadClient } from '@/lib/payload'

export const NEWS_PAGE_SIZE = 12

export const getNewsList = cached(
  async ({ page = 1, category }: { page?: number; category?: string }) => {
    const payload = await getPayloadClient()
    const where: Where = { _status: { equals: 'published' } }
    if (category) where.category = { equals: category }
    return payload.find({
      collection: 'news',
      where,
      sort: '-publishedAt',
      page,
      limit: NEWS_PAGE_SIZE,
      depth: 1,
      select: { title: true, slug: true, publishedAt: true, category: true, isAnnouncement: true, heroImage: true, excerpt: true },
    })
  },
  'news-list',
  [TAGS.news],
)

export const getNewsItem = cached(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'news',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    return docs[0] ?? null
  },
  'news-item',
  [TAGS.news],
)

export type NewsListItem = Awaited<ReturnType<typeof getNewsList>>['docs'][number]
