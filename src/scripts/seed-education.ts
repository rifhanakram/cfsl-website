import config from '@payload-config'
import { getPayload } from 'payload'

import type { Page } from '@/payload-types'

// Creates the Education topic pages as drafts for the Media Commission to fill in and publish.
// Pages that already exist (matched by slug, draft or published) are left untouched.
const TOPICS = [
  { slug: 'chess-in-education', title: 'Chess in Education', summary: 'How chess is used as a learning tool in classrooms.' },
  { slug: 'school-chess', title: 'School Chess', summary: 'Chess for schools and school students.' },
  { slug: 'learn-chess', title: 'Learn Chess', summary: 'Getting started with the game of chess.' },
  { slug: 'coaching', title: 'Coaching', summary: 'Information for chess coaches and trainers.' },
  { slug: 'arbiters', title: 'Arbiters', summary: 'Information for chess arbiters and tournament officials.' },
  { slug: 'women-in-chess', title: 'Women in Chess', summary: 'Chess for women and girls.' },
  { slug: 'youth-development', title: 'Youth Development', summary: 'Chess for young players.' },
  { slug: 'differently-abled-chess', title: 'Differently Abled Chess', summary: 'Chess for differently abled players.' },
]

const placeholderBody = (): NonNullable<Page['body']> => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            text: 'Content for this page is being prepared by the CFSL Media Commission.',
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            version: 1,
          },
        ],
      },
    ],
  },
})

const payload = await getPayload({ config })

for (const [i, { slug, title, summary }] of TOPICS.entries()) {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    draft: true,
    limit: 1,
    depth: 0,
  })
  if (existing.totalDocs > 0) {
    payload.logger.info(`Page ${slug} already exists, skipped`)
    continue
  }
  await payload.create({
    collection: 'pages',
    draft: true,
    data: {
      title,
      slug,
      section: 'education',
      summary,
      order: (i + 1) * 10,
      comingSoon: true,
      body: placeholderBody(),
      _status: 'draft',
    },
  })
  payload.logger.info(`Created draft page ${slug}`)
}

process.exit(0)
