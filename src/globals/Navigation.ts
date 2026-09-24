import type { GlobalConfig } from 'payload'

import { isEditorOrAdmin } from '@/access/roles'
import { revalidateGlobal } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    description:
      'Main menu. Leave empty to use the default launch menu (Home, News, Tournaments, Rankings, Resources, About CFSL).',
  },
  access: {
    read: () => true,
    update: isEditorOrAdmin,
  },
  hooks: revalidateGlobal(TAGS.navigation),
  fields: [
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Menu item', plural: 'Menu items' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { description: 'A site path such as /news, or a full URL.' },
        },
      ],
    },
  ],
}
