import { ArrowRightIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ComingSoon } from '@/components/site/coming-soon'
import { PageHeader } from '@/components/site/page-header'
import { RichText } from '@/components/site/rich-text'
import { getPage, getSectionPages } from '@/lib/queries/site'

export const metadata: Metadata = {
  title: 'Education',
  description: 'Chess education, coaching, arbiters and development programmes in Sri Lanka.',
}

export default async function EducationPage() {
  // The intro is the unsectioned page with slug "education"; topics are pages in the section.
  const [intro, topics] = await Promise.all([getPage('education'), getSectionPages('education')])

  return (
    <>
      <PageHeader title="Education" />
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        {intro && !intro.section && intro.body && <RichText data={intro.body} />}
        {topics.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <li key={topic.id}>
                <Link
                  href={`/education/${topic.slug}`}
                  className="group flex h-full flex-col gap-2 rounded-xl border p-5 hover:border-primary"
                >
                  <span className="font-semibold">{topic.title}</span>
                  {topic.summary && <span className="text-sm text-muted-foreground">{topic.summary}</span>}
                  <ArrowRightIcon className="mt-auto size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <ComingSoon section="Education" />
        )}
      </div>
    </>
  )
}
