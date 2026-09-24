import { ArrowRightIcon, FileTextIcon, ListOrderedIcon, NotebookPenIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/site/page-header'
import { RichText } from '@/components/site/rich-text'
import { RANKINGS_PATH } from '@/lib/navigation'
import { getPage } from '@/lib/queries/site'

export const metadata: Metadata = { title: 'Resources' }

const LINKS = [
  {
    href: '/resources/documents',
    title: 'Governance documents',
    description: 'Constitution, regulations and policies, circulars, annual reports and strategic plans.',
    icon: FileTextIcon,
  },
  {
    href: '/resources/downloads',
    title: 'Forms & downloads',
    description: 'Club, player, coach and arbiter registration forms.',
    icon: NotebookPenIcon,
  },
  {
    href: RANKINGS_PATH,
    title: 'National rankings',
    description: 'The current FIDE rating list for Sri Lanka.',
    icon: ListOrderedIcon,
    external: true,
  },
]

export default async function ResourcesPage() {
  const intro = await getPage('resources')

  return (
    <>
      <PageHeader title="Resources" />
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {intro?.body && <RichText data={intro.body} />}
        <div className="grid gap-4 sm:grid-cols-3">
          {LINKS.map(({ href, title, description, icon: Icon, external }) => (
            <Link
              key={href}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex flex-col gap-2 rounded-xl border p-5 hover:border-primary"
            >
              <Icon className="size-6 text-primary" aria-hidden />
              <span className="font-semibold">{title}</span>
              <span className="text-sm text-muted-foreground">{description}</span>
              <ArrowRightIcon className="mt-auto size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
