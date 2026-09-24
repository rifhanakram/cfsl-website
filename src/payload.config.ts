import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Documents } from './collections/Documents'
import { Downloads } from './collections/Downloads'
import { Events } from './collections/Events'
import { Files } from './collections/Files'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Pages } from './collections/Pages'
import { Registrations } from './collections/Registrations'
import { Navigation } from './globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — CFSL Admin',
    },
  },
  collections: [Users, Media, Files, Pages, News, Events, Registrations, Documents, Downloads],
  globals: [Navigation],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: false,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Keeps the schema identical whether or not a Blob token is present.
      alwaysInsertFields: true,
      // Every upload is public, so files are served straight from the Blob CDN.
      collections: {
        media: { disablePayloadAccessControl: true },
        files: { disablePayloadAccessControl: true },
        documents: { disablePayloadAccessControl: true },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
  ],
})
