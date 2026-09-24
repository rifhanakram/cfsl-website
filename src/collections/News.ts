import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, publishedOrStaff } from '@/access/roles'
import { slugField } from '@/fields/slug'
import { revalidateCollection } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'

export const NEWS_CATEGORIES = [
  { label: 'General', value: 'general' },
  { label: 'Tournaments', value: 'tournaments' },
  { label: 'National Teams', value: 'national-teams' },
  { label: 'Education', value: 'education' },
  { label: 'Governance', value: 'governance' },
] as const

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News item', plural: 'News' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'isAnnouncement', 'publishedAt', '_status'],
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true },
  defaultSort: '-publishedAt',
  hooks: revalidateCollection(TAGS.news, TAGS.homepage),
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [...NEWS_CATEGORIES],
      admin: { position: 'sidebar' },
    },
    {
      name: 'isAnnouncement',
      label: 'Official announcement',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Marked as an official announcement on the site.' },
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
      admin: { description: 'Shown in news lists and when the link is shared on social media.' },
    },
    { name: 'body', type: 'richText', required: true },
  ],
}
