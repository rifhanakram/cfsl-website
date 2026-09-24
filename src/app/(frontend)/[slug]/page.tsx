import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ComingSoon } from '@/components/site/coming-soon'
import { PageHeader } from '@/components/site/page-header'
import { RichText } from '@/components/site/rich-text'
import { PLACEHOLDER_SECTIONS } from '@/lib/navigation'
import { getPage } from '@/lib/queries/site'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return Object.keys(PLACEHOLDER_SECTIONS).map((slug) => ({ slug }))
}

async function resolve(slug: string) {
  const page = await getPage(slug)
  const placeholder = PLACEHOLDER_SECTIONS[slug]
  if (!page && !placeholder) return null
  return {
    title: page?.title ?? placeholder,
    body: page?.body,
    comingSoon: page ? Boolean(page.comingSoon) : true,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await resolve((await params).slug)
  return page ? { title: page.title } : {}
}

export default async function Page({ params }: Props) {
  const page = await resolve((await params).slug)
  if (!page) notFound()

  return (
    <>
      <PageHeader title={page.title} />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        {page.comingSoon && <ComingSoon section={page.title} />}
        <RichText data={page.body} />
      </div>
    </>
  )
}
