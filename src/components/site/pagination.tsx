import Link from 'next/link'

import { Button } from '@/components/ui/button'

type Props = {
  page: number
  totalPages: number
  href: (page: number) => string
}

export function Pagination({ page, totalPages, href }: Props) {
  if (totalPages <= 1) return null
  return (
    <nav className="flex items-center justify-between gap-4" aria-label="Pagination">
      {page > 1 ? (
        <Button asChild variant="outline">
          <Link href={href(page - 1)}>Previous</Link>
        </Button>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Button asChild variant="outline">
          <Link href={href(page + 1)}>Next</Link>
        </Button>
      ) : (
        <span />
      )}
    </nav>
  )
}
