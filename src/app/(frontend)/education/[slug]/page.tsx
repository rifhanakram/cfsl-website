import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ComingSoon } from '@/components/site/coming-soon'
import { PageHeader } from '@/components/site/page-header'
import { RichText } from '@/components/site/rich-text'
import { getSectionPage } from '@/lib/queries/site'

type Props = { params: Promise<{ slug: string }> }

// Topic pages are rendered on first request and cached until a page is edited.
export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getSectionPage('education', (await params).slug)
  return page ? { title: page.title, description: page.summary ?? undefined } : {}
}

export default async function EducationTopicPage({ params }: Props) {
  const page = await getSectionPage('education', (await params).slug)
  if (!page) notFound()

  return (
    <>
      <PageHeader title={page.title}>{page.summary}</PageHeader>
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <Link href="/education" className="text-sm text-muted-foreground hover:text-foreground">
          ← Education
        </Link>
        {page.comingSoon && <ComingSoon section={page.title} />}
        <RichText data={page.body} />
      </div>
    </>
  )
}
