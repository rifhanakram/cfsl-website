import { cached, TAGS } from '@/lib/cache'
import { PRIMARY_NAV, type NavItem } from '@/lib/navigation'
import { getPayloadClient } from '@/lib/payload'
import type { Page } from '@/payload-types'

export const getNavigation = cached(
  async (): Promise<NavItem[]> => {
    const payload = await getPayloadClient()
    const nav = await payload.findGlobal({ slug: 'navigation', depth: 0 })
    if (!nav.items?.length) return PRIMARY_NAV
    return nav.items.map(({ label, href }) => ({
      label,
      href,
      external: /^https?:\/\//.test(href) || href === '/rankings',
    }))
  },
  'navigation',
  [TAGS.navigation],
)

export const getLogo = cached(
  async () => {
    const payload = await getPayloadClient()
    const nav = await payload.findGlobal({ slug: 'navigation', depth: 1 })
    return typeof nav.logo === 'object' && nav.logo?.url ? nav.logo : null
  },
  'logo',
  [TAGS.navigation],
)

export const getPage = cached(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    return docs[0] ?? null
  },
  'page',
  [TAGS.pages],
)

export type PageSection = NonNullable<Page['section']>

// Published topic pages listed on a section landing such as /education.
export const getSectionPages = cached(
  async (section: PageSection) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'pages',
      where: { section: { equals: section }, _status: { equals: 'published' } },
      sort: ['order', 'title'],
      pagination: false,
      depth: 0,
      select: { title: true, slug: true, summary: true },
    })
    return docs
  },
  'section-pages',
  [TAGS.pages],
)

// A published topic page at /<section>/<slug>; null if it is missing or in another section.
export const getSectionPage = cached(
  async (section: PageSection, slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug }, section: { equals: section }, _status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    return docs[0] ?? null
  },
  'section-page',
  [TAGS.pages],
)
