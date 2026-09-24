import type { GlobalConfig } from 'payload'

import { isEditorOrAdmin } from '@/access/roles'
import { revalidateGlobal } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: {
    description: 'Everything else on the homepage fills in automatically from the newest news and events.',
  },
  access: {
    read: () => true,
    update: isEditorOrAdmin,
  },
  hooks: revalidateGlobal(TAGS.homepage),
  fields: [
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'News, tournaments, results and governance of chess in Sri Lanka.',
    },
    {
      name: 'pinnedAnnouncements',
      type: 'relationship',
      relationTo: 'news',
      hasMany: true,
      maxRows: 3,
      filterOptions: { _status: { equals: 'published' } },
      admin: { description: 'Shown at the top. If empty, the latest official announcements are shown.' },
    },
    {
      name: 'featuredEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      maxRows: 3,
      filterOptions: { _status: { equals: 'published' } },
      admin: { description: 'Listed first under upcoming events.' },
    },
  ],
}
