import type { Metadata } from 'next'
import Link from 'next/link'

import { NewsCategoryPage } from '@/components/media/news-category-page'

export const metadata: Metadata = {
  title: 'Press releases',
  description: 'Official press releases from the Chess Federation of Sri Lanka.',
}

type Props = { searchParams: Promise<{ page?: string }> }

export default async function PressPage({ searchParams }: Props) {
  const page = Math.max(1, Number((await searchParams).page) || 1)

  return (
    <NewsCategoryPage
      title="Press releases"
      intro={
        <>
          Official press releases from the Chess Federation of Sri Lanka. For logos and brand files, see the{' '}
          <Link href="/media/brand" className="underline underline-offset-4 hover:text-foreground">
            brand hub
          </Link>
          .
        </>
      }
      category="press-releases"
      basePath="/media/press"
      page={page}
      empty="No press releases have been published yet."
    />
  )
}
