import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access/roles'
import { revalidateCollection } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'
import { DOWNLOAD_CATEGORIES } from '@/lib/resources'

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  labels: { singular: 'Form or download', plural: 'Forms & downloads' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'kind', 'order'],
    description: 'Registration forms and other downloads: a PDF upload or a link to an online form.',
  },
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  defaultSort: 'order',
  hooks: revalidateCollection(TAGS.downloads),
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'select', required: true, options: [...DOWNLOAD_CATEGORIES] },
    { name: 'description', type: 'textarea' },
    {
      name: 'kind',
      type: 'radio',
      required: true,
      defaultValue: 'file',
      options: [
        { label: 'File (PDF)', value: 'file' },
        { label: 'Online form (Google Forms, Tally…)', value: 'link' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'files',
      required: true,
      admin: { condition: (_, sibling) => sibling?.kind === 'file' },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { condition: (_, sibling) => sibling?.kind === 'link' },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Enter the form URL'
        try {
          return new URL(value).protocol === 'https:' || 'Use an https:// link'
        } catch {
          return 'Enter a valid URL'
        }
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers are listed first.' },
    },
  ],
}
