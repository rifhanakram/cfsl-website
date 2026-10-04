import { CalendarIcon, TrophyIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GalleryVideos } from '@/components/galleries/gallery-videos'
import { PhotoLightbox } from '@/components/galleries/photo-lightbox'
import { formatDate } from '@/lib/format'
import { getGallery, itemCountLabel } from '@/lib/queries/galleries'
import type { Media } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const gallery = await getGallery((await params).slug)
  if (!gallery) return {}
  const firstPhoto = gallery.items.find((item) => item.blockType === 'photo')?.image
  const cover = [gallery.cover, firstPhoto].find((m): m is Media => typeof m === 'object' && !!m?.url)
  return {
    title: gallery.title,
    description: gallery.description ?? undefined,
    openGraph: {
      title: gallery.title,
      description: gallery.description ?? undefined,
      images: cover ? [{ url: cover.url!, alt: cover.alt }] : undefined,
    },
  }
}

export default async function GalleryPage({ params }: Props) {
  const gallery = await getGallery((await params).slug)
  if (!gallery) notFound()

  const photos = gallery.items.flatMap((item) =>
    item.blockType === 'photo' && typeof item.image === 'object' && item.image.url ? [item.image] : [],
  )
  const videos = gallery.items.filter((item) => item.blockType !== 'photo')
  // Only link events that are live; a draft event would 404.
  const event =
    typeof gallery.event === 'object' && gallery.event?._status === 'published' ? gallery.event : null

  return (
    <article>
      <header className="border-b bg-muted/40">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-8 sm:py-10">
          <Link href="/media/galleries" className="text-sm text-muted-foreground hover:text-foreground">
            ← All galleries
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{gallery.title}</h1>
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-6">
            <span className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-muted-foreground" aria-hidden />
              <time dateTime={gallery.date}>{formatDate(gallery.date)}</time>
              <span className="text-muted-foreground">
                · {itemCountLabel({ photos: photos.length, videos: videos.length })}
              </span>
            </span>
            {event && (
              <Link href={`/events/${event.slug}`} className="flex items-center gap-2 hover:underline">
                <TrophyIcon className="size-4 text-muted-foreground" aria-hidden />
                {event.title}
              </Link>
            )}
          </div>
          {gallery.description && (
            <p className="max-w-3xl whitespace-pre-line text-muted-foreground">{gallery.description}</p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:py-10">
        {photos.length > 0 && (
          <section className="space-y-4" aria-labelledby="photos">
            <h2 id="photos" className="text-xl font-semibold">
              Photos
            </h2>
            <PhotoLightbox photos={photos} />
          </section>
        )}
        {videos.length > 0 && (
          <section className="space-y-4" aria-labelledby="videos">
            <h2 id="videos" className="text-xl font-semibold">
              Videos
            </h2>
            <GalleryVideos items={videos} albumTitle={gallery.title} />
          </section>
        )}
      </div>
    </article>
  )
}
