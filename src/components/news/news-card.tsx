import Link from 'next/link'

import { MediaImage } from '@/components/site/media-image'
import { Badge } from '@/components/ui/badge'
import { NEWS_CATEGORIES } from '@/collections/News'
import { formatDate } from '@/lib/format'
import type { NewsListItem } from '@/lib/queries/news'

export const categoryLabel = (value: string) =>
  NEWS_CATEGORIES.find((c) => c.value === value)?.label ?? value

export function NewsCard({ item }: { item: NewsListItem }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card">
      {item.heroImage && typeof item.heroImage === 'object' ? (
        <div className="aspect-video overflow-hidden bg-muted">
          <MediaImage
            media={item.heroImage}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full transition-transform group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{categoryLabel(item.category)}</span>
          {item.isAnnouncement && <Badge>Announcement</Badge>}
        </div>
        <h3 className="font-semibold leading-snug">
          <Link href={`/news/${item.slug}`} className="after:absolute after:inset-0 hover:underline">
            {item.title}
          </Link>
        </h3>
        {item.excerpt && <p className="line-clamp-3 text-sm text-muted-foreground">{item.excerpt}</p>}
      </div>
    </article>
  )
}
