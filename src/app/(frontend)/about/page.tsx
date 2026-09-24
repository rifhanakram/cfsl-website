import { FileTextIcon, UserIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { MediaImage } from '@/components/site/media-image'
import { PageHeader } from '@/components/site/page-header'
import { RichText } from '@/components/site/rich-text'
import { formatDate } from '@/lib/format'
import { todayStartIso } from '@/lib/queries/events'
import { getCurrentPeople } from '@/lib/queries/people'
import { getPage } from '@/lib/queries/site'
import type { Person } from '@/payload-types'

export const metadata: Metadata = {
  title: 'About CFSL',
  description: 'The Executive Committee and Commissions of the Chess Federation of Sri Lanka.',
}

export const revalidate = 86400

function term(person: Person) {
  if (!person.termStart && !person.termEnd) return null
  const from = person.termStart ? formatDate(person.termStart, { day: undefined }) : ''
  const to = person.termEnd ? formatDate(person.termEnd, { day: undefined }) : 'present'
  return `${from} – ${to}`
}

function PersonCard({ person }: { person: Person }) {
  const photo = typeof person.photo === 'object' ? person.photo : null
  return (
    <li className="flex items-center gap-4 rounded-xl border p-4">
      <div className="size-16 shrink-0 overflow-hidden rounded-full bg-muted">
        {photo ? (
          <MediaImage media={photo} sizes="64px" className="size-16" />
        ) : (
          <UserIcon className="m-auto mt-4 size-8 text-muted-foreground" aria-hidden />
        )}
      </div>
      <div className="min-w-0">
        <p className="font-semibold">{person.name}</p>
        <p className="text-sm text-muted-foreground">{person.role}</p>
        {term(person) && <p className="text-xs text-muted-foreground">{term(person)}</p>}
      </div>
    </li>
  )
}

export default async function AboutPage() {
  const [intro, people] = await Promise.all([getPage('about'), getCurrentPeople(todayStartIso())])
  const committee = people.filter((p) => p.body === 'executive-committee')
  const commissions = [...new Set(people.filter((p) => p.body === 'commission').map((p) => p.commission!))].sort()

  return (
    <>
      <PageHeader title="About CFSL">The national governing body for chess in Sri Lanka.</PageHeader>
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        {intro?.body && <RichText data={intro.body} />}

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Executive Committee</h2>
          {committee.length ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {committee.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">The Executive Committee will be listed here.</p>
          )}
        </section>

        {commissions.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-xl font-semibold">Commissions</h2>
            {commissions.map((name) => (
              <div key={name} className="space-y-3">
                <h3 className="font-medium">{name}</h3>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {people
                    .filter((p) => p.body === 'commission' && p.commission === name)
                    .map((person) => (
                      <PersonCard key={person.id} person={person} />
                    ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <Link
          href="/resources/documents"
          className="flex items-center gap-3 rounded-xl border p-5 hover:border-primary"
        >
          <FileTextIcon className="size-6 text-primary" aria-hidden />
          <span>
            <span className="block font-semibold">Governance documents</span>
            <span className="text-sm text-muted-foreground">Constitution, policies, circulars and annual reports</span>
          </span>
        </Link>
      </div>
    </>
  )
}
