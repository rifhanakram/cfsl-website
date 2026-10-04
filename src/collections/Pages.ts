import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, publishedOrStaff } from '@/access/roles'
import { slugField } from '@/fields/slug'
import { revalidateCollection } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'
import { PAGE_SECTIONS } from '@/lib/navigation'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'section', '_status', 'updatedAt'],
    description:
      'Standalone pages such as /players, or topic pages inside a section such as /education/school-chess. A page with the slug "about", "resources", "education" or "media" adds an introduction to that section.',
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
      name: 'section',
      type: 'select',
      options: [...PAGE_SECTIONS],
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Leave empty for a standalone page at /<slug>. Choose a section to list the page there, e.g. /education/<slug>.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      maxLength: 200,
      admin: {
        condition: (data) => Boolean(data?.section),
        description: 'Shown on the section page card.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        condition: (data) => Boolean(data?.section),
        description: 'Lower numbers are listed first in the section.',
      },
    },
    {
      name: 'comingSoon',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Shows a "Coming soon" notice above the body.' },
    },
    { name: 'body', type: 'richText' },
  ],
}
