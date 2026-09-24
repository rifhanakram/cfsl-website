import { DownloadIcon, ExternalLinkIcon } from 'lucide-react'
import type { Metadata } from 'next'

import { PageHeader } from '@/components/site/page-header'
import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/lib/format-size'
import { getDownloads } from '@/lib/queries/resources'
import { DOWNLOAD_CATEGORIES } from '@/lib/resources'

export const metadata: Metadata = {
  title: 'Forms & downloads',
  description: 'Club, player, coach and arbiter registration forms.',
}

export default async function DownloadsPage() {
  const downloads = await getDownloads()

  return (
    <>
      <PageHeader title="Forms & downloads">
        Registration and renewal forms for clubs, players, coaches and arbiters.
      </PageHeader>
      <div className="mx-auto max-w-4xl space-y-10 px-4 py-8">
        {!downloads.length && <p className="py-12 text-center text-muted-foreground">No forms have been published yet.</p>}
        {DOWNLOAD_CATEGORIES.map((category) => {
          const items = downloads.filter((d) => d.category === category.value)
          if (!items.length) return null
          return (
            <section key={category.value} className="space-y-3">
              <h2 className="text-lg font-semibold">{category.label}</h2>
              <ul className="divide-y rounded-xl border">
                {items.map((item) => {
                  const file = item.kind === 'file' && typeof item.file === 'object' ? item.file : null
                  const href = item.kind === 'link' ? item.url : file?.url
                  if (!href) return null
                  return (
                    <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{item.title}</p>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      </div>
                      <Button asChild variant="outline" size="sm" className="self-start sm:self-auto">
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {item.kind === 'link' ? (
                            <>
                              Open form <ExternalLinkIcon />
                            </>
                          ) : (
                            <>
                              <DownloadIcon /> Download{file?.filesize ? ` (${formatFileSize(file.filesize)})` : ''}
                            </>
                          )}
                        </a>
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
