import Image from 'next/image'

import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

type Props = {
  media: number | Media | null | undefined
  className?: string
  sizes?: string
  priority?: boolean
}

export function MediaImage({ media, className, sizes = '100vw', priority }: Props) {
  if (!media || typeof media === 'number' || !media.url) return null
  return (
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width ?? 1200}
      height={media.height ?? 675}
      sizes={sizes}
      priority={priority}
      className={cn('h-auto w-full object-cover', className)}
    />
  )
}
