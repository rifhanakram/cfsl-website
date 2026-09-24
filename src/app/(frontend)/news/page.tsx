import type { Metadata } from 'next'
import Link from 'next/link'

import { NEWS_CATEGORIES } from '@/collections/News'
import { NewsCard } from '@/components/news/news-card'
import { PageHeader } from '@/components/site/page-header'
import { Pagination } from '@/components/site/pagination'
import { getNewsList } from '@/lib/queries/news'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'News' }

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams
  const category = NEWS_CATEGORIES.some((c) => c.value === params.category) ? params.category : undefined
  const page = Math.max(1, Number(params.page) || 1)
  const news = await getNewsList({ page, category })

  const href = (next: { category?: string; page?: number }) => {
    const query = new URLSearchParams()
    if (next.category) query.set('category', next.category)
    if (next.page && next.page > 1) query.set('page', String(next.page))
    const qs = query.toString()
    return qs ? `/news?${qs}` : '/news'
  }

  const filters = [{ label: 'All', value: undefined }, ...NEWS_CATEGORIES]

  return (
    <>
      <PageHeader title="News & announcements">
        Official news and announcements from the Chess Federation of Sri Lanka.
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" aria-label="Categories">
          {filters.map((filter) => (
            <Link
              key={filter.label}
              href={href({ category: filter.value })}
              aria-current={filter.value === category ? 'page' : undefined}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-sm',
                filter.value === category ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted',
              )}
            >
              {filter.label}
            </Link>
          ))}
        </nav>
        {news.docs.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.docs.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">No news has been published yet.</p>
        )}
        <Pagination
          page={news.page ?? 1}
          totalPages={news.totalPages}
          href={(p) => href({ category, page: p })}
        />
      </div>
    </>
  )
}
