import { FileTextIcon, SearchIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/site/page-header'
import { Pagination } from '@/components/site/pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/format'
import { formatFileSize } from '@/lib/format-size'
import { getDocuments, getDocumentYears } from '@/lib/queries/resources'
import { DOCUMENT_CATEGORIES, labelFor } from '@/lib/resources'

export const metadata: Metadata = {
  title: 'Governance documents',
  description: 'Constitution, regulations and policies, official circulars, annual reports and strategic plans.',
}

type Props = { searchParams: Promise<{ q?: string; category?: string; year?: string; page?: string }> }

const selectClass =
  'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'

export default async function DocumentsPage({ searchParams }: Props) {
  const params = await searchParams
  const q = params.q?.trim().slice(0, 100) || undefined
  const category = DOCUMENT_CATEGORIES.some((c) => c.value === params.category) ? params.category : undefined
  const year = Number(params.year) || undefined
  const page = Math.max(1, Number(params.page) || 1)
  const [documents, years] = await Promise.all([getDocuments({ q, category, year, page }), getDocumentYears()])

  const href = (p: number) => {
    const query = new URLSearchParams()
    if (q) query.set('q', q)
    if (category) query.set('category', category)
    if (year) query.set('year', String(year))
    if (p > 1) query.set('page', String(p))
    return `/resources/documents?${query}`
  }

  return (
    <>
      <PageHeader title="Governance documents">
        The official record of the federation&apos;s constitution, policies, circulars and reports.
      </PageHeader>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <form className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_12rem_8rem_auto] sm:items-end" role="search">
          <div className="space-y-1.5">
            <Label htmlFor="q">Search</Label>
            <Input id="q" name="q" type="search" defaultValue={q} placeholder="Title or description" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <select id="category" name="category" defaultValue={category ?? ''} className={selectClass}>
              <option value="">All categories</option>
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="year">Year</Label>
            <select id="year" name="year" defaultValue={year ? String(year) : ''} className={selectClass}>
              <option value="">Any</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit">
            <SearchIcon /> Search
          </Button>
        </form>

        {documents.docs.length ? (
          <ul className="divide-y rounded-xl border">
            {documents.docs.map((doc) => (
              <li key={doc.id} className="flex gap-3 p-4">
                <FileTextIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0 flex-1 space-y-1">
                  <a href={doc.url ?? '#'} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                    {doc.title}
                  </a>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{labelFor(DOCUMENT_CATEGORIES, doc.category)}</Badge>
                    <time dateTime={doc.documentDate}>{formatDate(doc.documentDate)}</time>
                    {formatFileSize(doc.filesize) && <span>PDF · {formatFileSize(doc.filesize)}</span>}
                  </div>
                  {doc.description && <p className="text-sm text-muted-foreground">{doc.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>No documents match your search.</p>
            {(q || category || year) && (
              <Link href="/resources/documents" className="mt-2 inline-block text-primary hover:underline">
                Clear filters
              </Link>
            )}
          </div>
        )}
        <Pagination page={documents.page ?? 1} totalPages={documents.totalPages} href={href} />
      </div>
    </>
  )
}
