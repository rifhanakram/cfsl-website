import type { Where } from 'payload'

import { cached, TAGS } from '@/lib/cache'
import { colomboDate, colomboMidnight } from '@/lib/dates'
import { getPayloadClient } from '@/lib/payload'

export const DOCUMENTS_PAGE_SIZE = 20

export const getDocuments = cached(
  async ({ q, category, year, page = 1 }: { q?: string; category?: string; year?: number; page?: number }) => {
    const payload = await getPayloadClient()
    const and: Where[] = []
    if (q) and.push({ or: [{ title: { like: q } }, { description: { like: q } }] })
    if (category) and.push({ category: { equals: category } })
    if (year) {
      and.push({
        documentDate: {
          greater_than_equal: colomboMidnight({ year, month: 1, day: 1 }).toISOString(),
          less_than: colomboMidnight({ year: year + 1, month: 1, day: 1 }).toISOString(),
        },
      })
    }
    return payload.find({
      collection: 'documents',
      where: and.length ? { and } : {},
      sort: '-documentDate',
      page,
      limit: DOCUMENTS_PAGE_SIZE,
      depth: 0,
      select: { title: true, category: true, documentDate: true, description: true, url: true, filename: true, filesize: true },
    })
  },
  'documents',
  [TAGS.documents],
)

export const getDocumentYears = cached(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'documents',
      pagination: false,
      depth: 0,
      select: { documentDate: true },
    })
    return [...new Set(docs.map((d) => colomboDate(d.documentDate).year))].sort((a, b) => b - a)
  },
  'document-years',
  [TAGS.documents],
)

export const getDownloads = cached(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'downloads',
      sort: 'order',
      pagination: false,
      depth: 1,
    })
    return docs
  },
  'downloads',
  [TAGS.downloads],
)
