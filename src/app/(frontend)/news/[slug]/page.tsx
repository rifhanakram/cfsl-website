import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { categoryLabel } from '@/components/news/news-card'
import { ShareButtons } from '@/components/news/share-buttons'
import { MediaImage } from '@/components/site/media-image'
import { RichText } from '@/components/site/rich-text'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'
import { getNewsItem } from '@/lib/queries/news'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getNewsItem((await params).slug)
  if (!item) return {}
  const image = typeof item.heroImage === 'object' && item.heroImage?.url ? item.heroImage.url : undefined
  return {
    title: item.title,
    description: item.excerpt ?? undefined,
    openGraph: {
      type: 'article',
      title: item.title,
      description: item.excerpt ?? undefined,
      publishedTime: item.publishedAt,
      images: image ? [image] : undefined,
    },
  }
}

export default async function NewsItemPage({ params }: Props) {
  const { slug } = await params
  const item = await getNewsItem(slug)
  if (!item) notFound()

  const url = new URL(`/news/${slug}`, process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cfsl-website.vercel.app').toString()

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link href="/news" className="text-sm text-muted-foreground hover:text-foreground">
        ← All news
      </Link>
      <header className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
          <span aria-hidden>·</span>
          <Link href={`/news?category=${item.category}`} className="hover:underline">
            {categoryLabel(item.category)}
          </Link>
          {item.isAnnouncement && <Badge>Official announcement</Badge>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{item.title}</h1>
        {item.excerpt && <p className="text-lg text-muted-foreground">{item.excerpt}</p>}
      </header>
      {typeof item.heroImage === 'object' && item.heroImage && (
        <figure className="mt-6 overflow-hidden rounded-xl">
          <MediaImage media={item.heroImage} sizes="(min-width: 768px) 768px, 100vw" priority />
          {item.heroImage.caption && (
            <figcaption className="mt-2 text-sm text-muted-foreground">{item.heroImage.caption}</figcaption>
          )}
        </figure>
      )}
      <RichText data={item.body} className="mt-8" />
      <div className="mt-10 border-t pt-6">
        <ShareButtons url={url} title={item.title} />
      </div>
    </article>
  )
}
