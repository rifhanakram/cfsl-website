import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access/roles'

export const Files: CollectionConfig = {
  slug: 'files',
  admin: {
    useAsTitle: 'title',
    description: 'PDFs and other downloadable files, e.g. tournament prospectuses and forms.',
  },
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  fields: [{ name: 'title', type: 'text', required: true }],
  upload: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
}
