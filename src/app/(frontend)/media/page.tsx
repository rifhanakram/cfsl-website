import { ArrowRightIcon, BookOpenIcon, ImagesIcon, MegaphoneIcon, PaletteIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { NewsCard } from '@/components/news/news-card'
import { PageHeader } from '@/components/site/page-header'
import { RichText } from '@/components/site/rich-text'
import { getNewsList } from '@/lib/queries/news'
import { getPage } from '@/lib/queries/site'

export const metadata: Metadata = {
  title: 'Media',
  description: 'Photo and video galleries, stories, press releases and the CFSL brand hub.',
}

const LINKS = [
  {
    href: '/media/galleries',
    title: 'Galleries',
    description: 'Photos and videos from tournaments, training camps and federation events.',
    icon: ImagesIcon,
  },
  {
    href: '/media/stories',
    title: 'Stories',
    description: 'Feature stories about the players, clubs and coaches of Sri Lankan chess.',
    icon: BookOpenIcon,
  },
  {
    href: '/media/press',
    title: 'Press releases',
    description: 'Official statements and press releases from the federation.',
    icon: MegaphoneIcon,
  },
  {
    href: '/media/brand',
    title: 'Brand hub',
    description: 'Official logos, brand guidelines and templates to download.',
    icon: PaletteIcon,
  },
]

export default async function MediaPage() {
  const [intro, latest] = await Promise.all([
    getPage('media'),
    getNewsList({ category: ['stories', 'press-releases'], limit: 3 }),
  ])

  return (
    <>
      <PageHeader title="Media" />
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
        {intro?.body && (
          <div className="max-w-3xl">
            <RichText data={intro.body} />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-2 rounded-xl border p-5 hover:border-primary"
            >
              <Icon className="size-6 text-primary" aria-hidden />
              <span className="font-semibold">{title}</span>
              <span className="text-sm text-muted-foreground">{description}</span>
              <ArrowRightIcon className="mt-auto size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          ))}
        </div>
        {latest.docs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Latest stories & press releases</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.docs.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
