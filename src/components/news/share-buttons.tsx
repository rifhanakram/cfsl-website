'use client'

import { Share2Icon } from 'lucide-react'
import { useSyncExternalStore } from 'react'

import { Button } from '@/components/ui/button'

const canShare = () => typeof navigator !== 'undefined' && 'share' in navigator

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const nativeShare = useSyncExternalStore(() => () => {}, canShare, () => false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: 'X', href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}` },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">Share:</span>
      {nativeShare && (
        <Button size="sm" onClick={() => navigator.share({ title, url }).catch(() => {})}>
          <Share2Icon /> Share
        </Button>
      )}
      {links.map((link) => (
        <Button key={link.label} asChild size="sm" variant="outline">
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        </Button>
      ))}
    </div>
  )
}
