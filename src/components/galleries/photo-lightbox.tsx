'use client'

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { Dialog } from 'radix-ui'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { Media } from '@/payload-types'

// A thumbnail grid whose photos open full screen. Arrow keys move between
// photos, Esc closes, and focus returns to the thumbnail of the last photo seen.
export function PhotoLightbox({ photos }: { photos: Media[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const thumbs = useRef<(HTMLButtonElement | null)[]>([])

  const count = photos.length
  const current = index === null ? null : photos[index]
  const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + count) % count))

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <li key={photo.id}>
            <button
              type="button"
              ref={(el) => {
                thumbs.current[i] = el
              }}
              onClick={() => setIndex(i)}
              className="group block aspect-square w-full overflow-hidden rounded-lg bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Image
                src={photo.url!}
                alt={photo.alt}
                width={photo.width ?? 800}
                height={photo.height ?? 800}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="size-full object-cover transition-transform group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={current !== null} onOpenChange={(open) => !open && setIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex flex-col text-white outline-none"
            // Only captioned photos render a Description; opt out of it otherwise.
            {...(current?.caption ? {} : { 'aria-describedby': undefined })}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') step(1)
              else if (e.key === 'ArrowLeft') step(-1)
              else return
              e.preventDefault()
            }}
            onCloseAutoFocus={(e) => {
              e.preventDefault()
              if (index !== null) thumbs.current[index]?.focus()
            }}
          >
            {current && (
              <>
                <div className="flex items-center justify-between gap-4 p-3 sm:p-4">
                  <Dialog.Title className="text-sm text-white/80">
                    Photo {index! + 1} of {count}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                      <XIcon />
                      <span className="sr-only">Close</span>
                    </Button>
                  </Dialog.Close>
                </div>
                <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
                  <Image
                    key={current.id}
                    src={current.url!}
                    alt={current.alt}
                    width={current.width ?? 1600}
                    height={current.height ?? 1200}
                    sizes="100vw"
                    className="h-auto max-h-full w-auto max-w-full object-contain"
                  />
                  {count > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => step(-1)}
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white hover:bg-white/10 hover:text-white sm:left-4"
                      >
                        <ChevronLeftIcon />
                        <span className="sr-only">Previous photo</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => step(1)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white hover:bg-white/10 hover:text-white sm:right-4"
                      >
                        <ChevronRightIcon />
                        <span className="sr-only">Next photo</span>
                      </Button>
                    </>
                  )}
                </div>
                {current.caption && (
                  <Dialog.Description className="p-4 text-center text-sm text-white/90">
                    {current.caption}
                  </Dialog.Description>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
