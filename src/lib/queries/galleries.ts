import type { Where } from 'payload'

import { cached, TAGS } from '@/lib/cache'
import { getPayloadClient } from '@/lib/payload'
import type { Gallery, Media } from '@/payload-types'

export const GALLERIES_PAGE_SIZE = 12

export type GalleryCardItem = {
  id: number
  title: string
  slug: string
  date: string
  cover: Media | null
  photos: number
  videos: number
}

const relationId = (value: number | { id: number } | null | undefined) =>
  value == null ? null : typeof value === 'number' ? value : value.id

// Lists load items at depth 0 so the counts stay cheap, then fetch only the
// one image each card shows: the cover, or else the album's first photo.
async function toCards(docs: Pick<Gallery, 'id' | 'title' | 'slug' | 'date' | 'cover' | 'items'>[]) {
  const coverIds = docs.map((doc) => {
    const firstPhoto = doc.items?.find((item) => item.blockType === 'photo')
    return relationId(doc.cover) ?? (firstPhoto ? relationId(firstPhoto.image) : null)
  })
  const ids = [...new Set(coverIds.filter((id): id is number => id !== null))]

  const payload = await getPayloadClient()
  const media = ids.length
    ? (await payload.find({ collection: 'media', where: { id: { in: ids } }, limit: ids.length, depth: 0 })).docs
    : []
  const byId = new Map(media.map((m) => [m.id, m]))

  return docs.map(
    (doc, i): GalleryCardItem => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      date: doc.date,
      cover: (coverIds[i] !== null && byId.get(coverIds[i]!)) || null,
      photos: doc.items?.filter((item) => item.blockType === 'photo').length ?? 0,
      videos: doc.items?.filter((item) => item.blockType !== 'photo').length ?? 0,
    }),
  )
}

const CARD_SELECT = { title: true, slug: true, date: true, cover: true, items: true } as const

export const getGalleryList = cached(
  async ({ page = 1 }: { page?: number }) => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'galleries',
      where: { _status: { equals: 'published' } },
      sort: '-date',
      page,
      limit: GALLERIES_PAGE_SIZE,
      depth: 0,
      select: CARD_SELECT,
    })
    return { ...result, docs: await toCards(result.docs) }
  },
  'gallery-list',
  [TAGS.galleries],
)

export const getEventGalleries = cached(
  async (eventId: number) => {
    const payload = await getPayloadClient()
    const where: Where = { _status: { equals: 'published' }, event: { equals: eventId } }
    const { docs } = await payload.find({
      collection: 'galleries',
      where,
      sort: '-date',
      pagination: false,
      depth: 0,
      select: CARD_SELECT,
    })
    return toCards(docs)
  },
  'event-galleries',
  [TAGS.galleries],
)

export const getGallery = cached(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'galleries',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
      // Depth 2 reaches the poster image of uploaded videos.
      depth: 2,
      populate: { events: { title: true, slug: true, _status: true } },
    })
    return docs[0] ?? null
  },
  'gallery',
  [TAGS.galleries],
)

export type GalleryDetail = NonNullable<Awaited<ReturnType<typeof getGallery>>>

export function itemCountLabel({ photos, videos }: { photos: number; videos: number }) {
  const parts = []
  if (photos) parts.push(`${photos} ${photos === 1 ? 'photo' : 'photos'}`)
  if (videos) parts.push(`${videos} ${videos === 1 ? 'video' : 'videos'}`)
  return parts.join(' · ')
}
