import { ImageIcon } from 'lucide-react'
import Link from 'next/link'

import { MediaImage } from '@/components/site/media-image'
import { formatDate } from '@/lib/format'
import { type GalleryCardItem, itemCountLabel } from '@/lib/queries/galleries'

type Props = {
  gallery: GalleryCardItem
  sizes?: string
}

export function GalleryCard({
  gallery,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
}: Props) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card">
      <div className="aspect-video overflow-hidden bg-muted">
        {gallery.cover ? (
          <MediaImage
            media={gallery.cover}
            sizes={sizes}
            className="h-full transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-8" aria-hidden />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold leading-snug">
          <Link href={`/media/galleries/${gallery.slug}`} className="after:absolute after:inset-0 hover:underline">
            {gallery.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">
          <time dateTime={gallery.date}>{formatDate(gallery.date)}</time>
          <span aria-hidden> · </span>
          {itemCountLabel(gallery)}
        </p>
      </div>
    </article>
  )
}
