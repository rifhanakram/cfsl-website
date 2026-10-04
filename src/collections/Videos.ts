import { APIError, type CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access/roles'
import { MAX_VIDEO_BYTES } from '@/lib/galleries'

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    description: 'Short video clips (MP4 or WebM, up to 100 MB) for galleries. Put longer videos on YouTube.',
  },
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'poster', type: 'upload', relationTo: 'media', admin: { description: 'Optional preview image.' } },
  ],
  upload: {
    mimeTypes: ['video/mp4', 'video/webm'],
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (typeof data.filesize === 'number' && data.filesize > MAX_VIDEO_BYTES) {
          throw new APIError('Videos must be 100 MB or smaller. Put longer videos on YouTube.', 400, null, true)
        }
        return data
      },
    ],
  },
}
