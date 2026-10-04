import type { Metadata } from 'next'

import { GalleryCard } from '@/components/galleries/gallery-card'
import { PageHeader } from '@/components/site/page-header'
import { Pagination } from '@/components/site/pagination'
import { getGalleryList } from '@/lib/queries/galleries'

export const metadata: Metadata = { title: 'Photo & video galleries' }

type Props = { searchParams: Promise<{ page?: string }> }

export default async function GalleriesPage({ searchParams }: Props) {
  const page = Math.max(1, Number((await searchParams).page) || 1)
  const galleries = await getGalleryList({ page })

  return (
    <>
      <PageHeader title="Photo & video galleries">
        Photos and videos from tournaments, training camps and federation events.
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {galleries.docs.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.docs.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">No galleries have been published yet.</p>
        )}
        <Pagination
          page={galleries.page ?? 1}
          totalPages={galleries.totalPages}
          href={(p) => (p > 1 ? `/media/galleries?page=${p}` : '/media/galleries')}
        />
      </div>
    </>
  )
}
