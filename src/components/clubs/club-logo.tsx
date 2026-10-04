import { ShieldIcon } from 'lucide-react'

import { MediaImage } from '@/components/site/media-image'
import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'

// Square logo tile with a neutral crest when the club has no logo uploaded.
export function ClubLogo({
  logo,
  size,
  className,
}: {
  logo: number | Media | null | undefined
  size: number
  className?: string
}) {
  const media = typeof logo === 'object' && logo?.url ? logo : null
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted', className)}
      style={{ width: size, height: size }}
    >
      {media ? (
        <MediaImage media={media} sizes={`${size}px`} className="size-full object-contain" />
      ) : (
        <ShieldIcon className="size-1/2 text-muted-foreground" aria-hidden />
      )}
    </div>
  )
}
