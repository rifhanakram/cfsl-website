import type { GalleryDetail } from '@/lib/queries/galleries'
import { toVideoEmbed } from '@/lib/galleries'

type Item = GalleryDetail['items'][number]
type VideoItem = Extract<Item, { blockType: 'videoEmbed' | 'videoFile' }>

// YouTube/Facebook embeds and uploaded clips, in the order the editor set.
export function GalleryVideos({ items, albumTitle }: { items: VideoItem[]; albumTitle: string }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {items.map((item, i) => (
        <li key={item.id ?? i}>
          {item.blockType === 'videoEmbed' ? (
            <EmbeddedVideo url={item.url} caption={item.caption} fallbackTitle={`${albumTitle} video ${i + 1}`} />
          ) : (
            <UploadedVideo video={item.video} />
          )}
        </li>
      ))}
    </ul>
  )
}

function EmbeddedVideo({ url, caption, fallbackTitle }: { url: string; caption?: string | null; fallbackTitle: string }) {
  const embed = toVideoEmbed(url)
  if (!embed) return null
  return (
    <figure className="space-y-2">
      <div className="aspect-video overflow-hidden rounded-xl border bg-black">
        <iframe
          src={embed.src}
          title={caption || fallbackTitle}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="size-full"
        />
      </div>
      {caption && <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}

function UploadedVideo({ video }: { video: Extract<Item, { blockType: 'videoFile' }>['video'] }) {
  if (typeof video === 'number' || !video.url) return null
  const poster = typeof video.poster === 'object' && video.poster?.url ? video.poster.url : undefined
  return (
    <figure className="space-y-2">
      <video
        controls
        preload="metadata"
        poster={poster}
        className="aspect-video w-full rounded-xl border bg-black"
        aria-label={video.title}
      >
        <source src={video.url} type={video.mimeType ?? undefined} />
      </video>
      <figcaption className="text-sm text-muted-foreground">{video.title}</figcaption>
    </figure>
  )
}
