import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/roles'
import { revalidateCollection } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'
import { parseIsoDate } from '@/lib/dates'
import { exportRegistrations } from '@/lib/export/endpoint'

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'event', 'sectionName', 'fideId', 'rating', 'paid', 'createdAt'],
    listSearchableFields: ['displayName', 'fideId', 'email', 'phone'],
    hidden: ({ user }) => user?.role !== 'admin',
    description:
      'Tournament entries submitted through the website. To mark several entries as paid, select them and use Edit.',
    components: {
      beforeListTable: ['/components/admin/export-registrations#ExportRegistrations'],
    },
  },
  // The public form creates entries through the Local API; nothing else is public.
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  indexes: [{ fields: ['event', 'fideId'], unique: true }],
  endpoints: [{ path: '/export', method: 'get', handler: exportRegistrations }],
  hooks: {
    ...revalidateCollection(TAGS.registrations),
    beforeChange: [
      ({ data, originalDoc, req }) => {
        if (data.lastName !== undefined || data.otherNames !== undefined) {
          data.displayName = `${data.lastName ?? originalDoc?.lastName}, ${data.otherNames ?? originalDoc?.otherNames}`
        }
        if (data.fideId === '') data.fideId = null
        if (data.paid === undefined) return data
        if (data.paid && !originalDoc?.paid) {
          data.paidAt = new Date().toISOString()
          data.paidBy = req.user?.id ?? null
        } else if (!data.paid) {
          data.paidAt = null
          data.paidBy = null
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'displayName', type: 'text', admin: { hidden: true } },
    {
      type: 'row',
      fields: [
        { name: 'event', type: 'relationship', relationTo: 'events', required: true, index: true },
        { name: 'sectionName', label: 'Section', type: 'text', required: true },
        { name: 'sectionId', type: 'text', required: true, admin: { hidden: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'lastName', type: 'text', required: true },
        { name: 'otherNames', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'fideId', label: 'FIDE ID', type: 'text', index: true },
        { name: 'rating', type: 'number', min: 0 },
        {
          name: 'dateOfBirth',
          type: 'text',
          admin: { placeholder: 'YYYY-MM-DD' },
          validate: (value: string | null | undefined) =>
            !value || parseIsoDate(value) !== null || 'Use the format YYYY-MM-DD',
        },
        {
          name: 'sex',
          type: 'select',
          options: [
            { label: 'Male', value: 'm' },
            { label: 'Female', value: 'w' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'schoolOrClub', label: 'School or club', type: 'text' },
        { name: 'coach', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'guardianName', type: 'text' },
        { name: 'guardianContact', type: 'text' },
      ],
    },
    {
      name: 'paid',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'paidBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
