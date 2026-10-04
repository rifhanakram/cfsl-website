import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access/roles'
import { revalidateCollection } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'

export const BRAND_ASSET_CATEGORIES = [
  { label: 'Logos', value: 'logo' },
  { label: 'Guidelines', value: 'guidelines' },
  { label: 'Templates', value: 'template' },
  { label: 'Other', value: 'other' },
] as const

export const BrandAssets: CollectionConfig = {
  slug: 'brand-assets',
  labels: { singular: 'Brand asset', plural: 'Brand assets' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'filename', 'order'],
    description: 'Logos and media resources offered for download at /media/brand.',
  },
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  defaultSort: 'order',
  hooks: revalidateCollection(TAGS.brandAssets),
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'select', required: true, defaultValue: 'logo', options: [...BRAND_ASSET_CATEGORIES] },
    { name: 'description', type: 'textarea' },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers are listed first.' },
    },
  ],
  upload: {
    mimeTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf', 'application/zip'],
  },
}
