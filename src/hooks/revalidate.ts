import { revalidateTag } from 'next/cache'
import type { CollectionConfig, GlobalConfig } from 'payload'

import type { Tag } from '@/lib/cache'

function expire(tags: Tag[]) {
  for (const tag of tags) {
    try {
      revalidateTag(tag, { expire: 0 })
    } catch {
      // Outside a Next.js request (e.g. `payload run` scripts) there is no cache to expire.
    }
  }
}

export const revalidateCollection = (...tags: Tag[]): CollectionConfig['hooks'] => ({
  afterChange: [
    ({ doc }) => {
      expire(tags)
      return doc
    },
  ],
  afterDelete: [
    ({ doc }) => {
      expire(tags)
      return doc
    },
  ],
})

export const revalidateGlobal = (...tags: Tag[]): GlobalConfig['hooks'] => ({
  afterChange: [
    ({ doc }) => {
      expire(tags)
      return doc
    },
  ],
})
