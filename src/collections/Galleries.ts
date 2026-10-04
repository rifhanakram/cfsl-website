import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, publishedOrStaff } from '@/access/roles'
import { slugField } from '@/fields/slug'
import { revalidateCollection } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'
import { isVideoEmbedUrl } from '@/lib/galleries'

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'event', '_status'],
    description: 'Photo and video albums shown at /media/galleries.',
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true },
  defaultSort: '-date',
  hooks: revalidateCollection(TAGS.galleries, TAGS.events),
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'date',
      type: 'date',
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      admin: { position: 'sidebar', description: 'Optional. The album is also shown on this event page.' },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Leave empty to use the first photo.' },
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'items',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [
        {
          slug: 'photo',
          labels: { singular: 'Photo', plural: 'Photos' },
          fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
        },
        {
          slug: 'videoEmbed',
          labels: { singular: 'YouTube or Facebook video', plural: 'YouTube or Facebook videos' },
          fields: [
            {
              name: 'url',
              type: 'text',
              required: true,
              validate: (value: string | null | undefined) =>
                isVideoEmbedUrl(value ?? '') || 'Enter a YouTube or Facebook video link',
            },
            { name: 'caption', type: 'text' },
          ],
        },
        {
          slug: 'videoFile',
          labels: { singular: 'Uploaded video', plural: 'Uploaded videos' },
          fields: [{ name: 'video', type: 'upload', relationTo: 'videos', required: true }],
        },
      ],
    },
  ],
}
