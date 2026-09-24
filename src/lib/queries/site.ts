import { cached, TAGS } from '@/lib/cache'
import { PRIMARY_NAV, type NavItem } from '@/lib/navigation'
import { getPayloadClient } from '@/lib/payload'

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
