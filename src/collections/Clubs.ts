import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, publishedOrStaff } from '@/access/roles'
import { slugField } from '@/fields/slug'
import { revalidateCollection } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'
import { CLUB_STATUSES, DISTRICT_OPTIONS, SOCIAL_PLATFORMS } from '@/lib/clubs'

const httpsUrl = (value: string | null | undefined) => {
  if (!value) return true
  try {
    return new URL(value).protocol === 'https:' || 'Use an https:// link'
  } catch {
    return 'Enter a valid URL'
  }
}

export const Clubs: CollectionConfig = {
  slug: 'clubs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'district', 'registration', 'lastRenewed', '_status'],
    description: 'Registered chess clubs listed in the public club directory at /clubs.',
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true },
  defaultSort: 'name',
  hooks: revalidateCollection(TAGS.clubs),
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      name: 'registration',
      label: 'CFSL registration',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [...CLUB_STATUSES],
      admin: { position: 'sidebar' },
    },
    {
      name: 'lastRenewed',
      label: 'Last renewed (year)',
      type: 'number',
      min: 1900,
      max: 2100,
      admin: { position: 'sidebar' },
    },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'district', type: 'select', required: true, options: DISTRICT_OPTIONS },
        { name: 'city', type: 'text' },
        { name: 'founded', label: 'Year founded', type: 'number', min: 1800, max: 2100 },
      ],
    },
    { name: 'description', type: 'textarea' },
    {
      type: 'collapsible',
      label: 'Venue & links',
      fields: [
        { name: 'address', type: 'textarea' },
        { name: 'mapUrl', label: 'Google Maps link', type: 'text', validate: httpsUrl },
        { name: 'website', type: 'text', validate: httpsUrl },
        {
          name: 'socials',
          label: 'Social links',
          type: 'array',
          labels: { singular: 'Social link', plural: 'Social links' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'platform', type: 'select', required: true, options: [...SOCIAL_PLATFORMS] },
                { name: 'url', type: 'text', required: true, validate: httpsUrl },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'contacts',
      label: 'Key contacts',
      type: 'array',
      labels: { singular: 'Contact', plural: 'Contacts' },
      admin: { description: 'Phone and email are only shown on the site when "Show publicly" is ticked.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'role', type: 'text', required: true, admin: { placeholder: 'e.g. Secretary' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'phone', type: 'text' },
            { name: 'email', type: 'email' },
          ],
        },
        { name: 'public', label: 'Show publicly', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
