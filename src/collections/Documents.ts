import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access/roles'
import { revalidateCollection } from '@/hooks/revalidate'
import { TAGS } from '@/lib/cache'
import { DOCUMENT_CATEGORIES } from '@/lib/resources'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Governance document', plural: 'Governance documents' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'documentDate', 'updatedAt'],
    description: 'The public governance library: constitution, policies, circulars, reports and plans.',
  },
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  defaultSort: '-documentDate',
  hooks: revalidateCollection(TAGS.documents),
  upload: { mimeTypes: ['application/pdf'] },
  fields: [
    { name: 'title', type: 'text', required: true, index: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      index: true,
      options: [...DOCUMENT_CATEGORIES],
    },
    {
      name: 'documentDate',
      type: 'date',
      required: true,
      index: true,
      admin: { date: { pickerAppearance: 'dayOnly' }, description: 'The date on the document, used for sorting and the year filter.' },
    },
    { name: 'description', type: 'textarea' },
  ],
}
