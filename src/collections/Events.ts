import type { CollectionConfig, Field } from 'payload'

import { isEditorOrAdmin, publishedOrStaff } from '@/access/roles'
import { slugField } from '@/fields/slug'
import { revalidateCollection } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'
import { EVENT_TYPES, isChessResultsUrl, REGISTRATION_FIELDS } from '@/lib/events'

const fieldModes: Field[] = REGISTRATION_FIELDS.map(({ name, label, defaultMode }) => ({
  name,
  label,
  type: 'radio',
  required: true,
  defaultValue: defaultMode,
  options: [
    { label: 'Required', value: 'required' },
    { label: 'Optional', value: 'optional' },
    { label: 'Hidden', value: 'hidden' },
  ],
  admin: { layout: 'horizontal' },
}))

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'startDate', 'venue', '_status'],
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true },
  defaultSort: '-startDate',
  hooks: revalidateCollection(TAGS.events, TAGS.homepage),
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'tournament',
      options: [...EVENT_TYPES],
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          index: true,
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
            description: 'Leave empty for a one-day event.',
          },
        },
      ],
    },
    { name: 'venue', type: 'text' },
    {
      name: 'summary',
      type: 'textarea',
      maxLength: 300,
      admin: { description: 'One or two sentences shown in the calendar.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            { name: 'description', type: 'richText' },
            { name: 'eligibility', type: 'richText' },
            { name: 'prospectus', type: 'upload', relationTo: 'files' },
          ],
        },
        {
          label: 'Results',
          fields: [
            {
              name: 'chessResultsUrl',
              label: 'chess-results.com URL',
              type: 'text',
              admin: {
                description: 'The tournament page on chess-results.com, shown embedded on the event page.',
              },
              validate: (value: string | null | undefined) =>
                !value || isChessResultsUrl(value) || 'Enter an https://chess-results.com/… URL',
            },
          ],
        },
        {
          label: 'Registration',
          fields: [
            {
              name: 'registration',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  label: 'Accept registrations on this site',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  type: 'row',
                  admin: { condition: (data) => Boolean(data?.registration?.enabled) },
                  fields: [
                    {
                      name: 'opensAt',
                      type: 'date',
                      admin: { date: { pickerAppearance: 'dayAndTime' } },
                    },
                    {
                      name: 'closesAt',
                      type: 'date',
                      admin: { date: { pickerAppearance: 'dayAndTime' } },
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Fee and eligibility rules',
                  admin: { condition: (data) => Boolean(data?.registration?.enabled) },
                  fields: [
                    { name: 'fee', type: 'text', admin: { description: 'e.g. LKR 2,500' } },
                    { name: 'paymentInstructions', type: 'textarea' },
                    {
                      name: 'ageReferenceDate',
                      type: 'radio',
                      required: true,
                      defaultValue: 'jan-1',
                      options: [
                        { label: '1 January of the event year', value: 'jan-1' },
                        { label: '31 December of the event year', value: 'dec-31' },
                      ],
                      admin: {
                        description: '"Under N" means younger than N on this date.',
                      },
                    },
                    {
                      name: 'sections',
                      type: 'array',
                      labels: { singular: 'Section', plural: 'Sections' },
                      admin: { initCollapsed: false },
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'name', type: 'text', required: true, admin: { placeholder: 'e.g. U12 Open' } },
                            {
                              name: 'maxAge',
                              label: 'Under (age)',
                              type: 'number',
                              min: 1,
                              admin: { description: 'Leave empty for no age limit.' },
                            },
                            { name: 'minRating', type: 'number', min: 0 },
                            { name: 'maxRating', type: 'number', min: 0 },
                            { name: 'capacity', type: 'number', required: true, min: 1 },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'fields',
                  label: 'Form fields',
                  type: 'group',
                  admin: {
                    condition: (data) => Boolean(data?.registration?.enabled),
                    description:
                      'Last name and other names are always required. FIDE ID is always shown and optional. Guardian details are required for players under 18 on the start date.',
                  },
                  fields: fieldModes,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
