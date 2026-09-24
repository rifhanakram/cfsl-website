import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access/roles'
import { revalidateCollection } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Person', plural: 'People' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'body', 'commission', 'order'],
    description: 'Executive Committee and Commission members shown on the About page.',
  },
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  defaultSort: 'order',
  hooks: revalidateCollection(TAGS.people),
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true, admin: { placeholder: 'e.g. President, Chairperson, Member' } },
    {
      name: 'body',
      type: 'radio',
      required: true,
      defaultValue: 'executive-committee',
      options: [
        { label: 'Executive Committee', value: 'executive-committee' },
        { label: 'Commission', value: 'commission' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'commission',
      type: 'text',
      required: true,
      admin: {
        condition: (_, sibling) => sibling?.body === 'commission',
        placeholder: 'e.g. Media Commission',
      },
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'termStart', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
        {
          name: 'termEnd',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayOnly' }, description: 'Members are hidden once their term has ended.' },
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers are listed first.' },
    },
  ],
}
