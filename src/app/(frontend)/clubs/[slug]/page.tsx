import { CalendarIcon, MapPinIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { districtLabel } from '@/components/clubs/club-card'
import { ClubContacts } from '@/components/clubs/club-contacts'
import { ClubLogo } from '@/components/clubs/club-logo'
import { ClubVenue } from '@/components/clubs/club-venue'
import { RegistrationBadge } from '@/components/clubs/registration-badge'
import { getClub } from '@/lib/queries/clubs'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const club = await getClub((await params).slug)
  if (!club) return {}
  const place = [club.city, districtLabel(club.district)].filter(Boolean).join(', ')
  const logo = typeof club.logo === 'object' && club.logo?.url ? club.logo.url : undefined
  return {
    title: club.name,
    description: club.description?.slice(0, 160) || `${club.name}, a chess club in ${place}.`,
    openGraph: { title: club.name, images: logo ? [logo] : undefined },
  }
}

export default async function ClubPage({ params }: Props) {
  const club = await getClub((await params).slug)
  if (!club) notFound()

  const place = [club.city, districtLabel(club.district)].filter(Boolean).join(', ')

  return (
    <article>
      <header className="border-b bg-muted/40">
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-8 sm:py-10">
          <Link href="/clubs" className="text-sm text-muted-foreground hover:text-foreground">
            ← Club directory
          </Link>
          <div className="flex items-start gap-4 sm:items-center sm:gap-6">
            <ClubLogo logo={club.logo} size={96} className="bg-background" />
            <div className="min-w-0 space-y-2">
              <RegistrationBadge club={club} />
              <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{club.name}</h1>
              <dl className="flex flex-col gap-1 text-sm sm:flex-row sm:gap-6">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-4 text-muted-foreground" aria-hidden />
                  <dt className="sr-only">Location</dt>
                  <dd>{place}</dd>
                </div>
                {club.founded && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-muted-foreground" aria-hidden />
                    <dt className="sr-only">Founded</dt>
                    <dd>Founded {club.founded}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-12 px-4 py-10">
        {club.description && <p className="max-w-3xl whitespace-pre-line">{club.description}</p>}
        <ClubVenue club={club} />
        <ClubContacts contacts={club.contacts} />
        {/* Team history (league results by season) will go here once that data exists. */}
      </div>
    </article>
  )
}
