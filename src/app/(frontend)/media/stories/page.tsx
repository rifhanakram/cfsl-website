import type { Metadata } from 'next'

import { NewsCategoryPage } from '@/components/media/news-category-page'

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Feature stories from Sri Lankan chess: players, clubs, coaches and events.',
}

type Props = { searchParams: Promise<{ page?: string }> }

export default async function StoriesPage({ searchParams }: Props) {
  const page = Math.max(1, Number((await searchParams).page) || 1)

  return (
    <NewsCategoryPage
      title="Stories"
      intro="Feature stories from Sri Lankan chess: players, clubs, coaches and the events that bring them together."
      category="stories"
      basePath="/media/stories"
      page={page}
      empty="No stories have been published yet."
    />
  )
}
