import type { ReactNode } from 'react'

import { NewsCard } from '@/components/news/news-card'
import { PageHeader } from '@/components/site/page-header'
import { Pagination } from '@/components/site/pagination'
import { getNewsList } from '@/lib/queries/news'

type Props = {
  title: string
  intro: ReactNode
  category: string
  basePath: string
  page: number
  empty: string
}

// A paginated list of published News in one category. Items link to the shared /news/[slug] page.
export async function NewsCategoryPage({ title, intro, category, basePath, page, empty }: Props) {
  const news = await getNewsList({ page, category })
  const href = (p: number) => (p > 1 ? `${basePath}?page=${p}` : basePath)

  return (
    <>
      <PageHeader title={title}>{intro}</PageHeader>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {news.docs.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.docs.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">{empty}</p>
        )}
        <Pagination page={news.page ?? 1} totalPages={news.totalPages} href={href} />
      </div>
    </>
  )
}
