import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, publishedOrStaff } from '@/access/roles'
import { slugField } from '@/fields/slug'
import { revalidateCollection } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'comingSoon', '_status', 'updatedAt'],
    description:
      'Standalone pages such as /players. A page with the slug "about" or "resources" adds an introduction to that section.',
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true },
  hooks: revalidateCollection(TAGS.pages),
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'comingSoon',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Shows a "Coming soon" notice above the body.' },
    },
    { name: 'body', type: 'richText' },
  ],
}
