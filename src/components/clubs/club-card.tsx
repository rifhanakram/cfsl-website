import { MapPinIcon } from 'lucide-react'
import Link from 'next/link'

import { ClubLogo } from '@/components/clubs/club-logo'
import { RegistrationBadge } from '@/components/clubs/registration-badge'
import { DISTRICT_OPTIONS } from '@/lib/clubs'
import type { ClubListItem } from '@/lib/queries/clubs'
import { labelFor } from '@/lib/resources'

export const districtLabel = (value: string) => labelFor(DISTRICT_OPTIONS, value)

export function ClubCard({ club }: { club: ClubListItem }) {
  return (
    <li className="relative flex items-center gap-4 rounded-xl border bg-card p-4 hover:border-primary">
      <ClubLogo logo={club.logo} size={56} />
      <div className="min-w-0 flex-1 space-y-1">
        <h2 className="font-semibold leading-snug">
          <Link href={`/clubs/${club.slug}`} className="after:absolute after:inset-0 hover:underline">
            {club.name}
          </Link>
        </h2>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPinIcon className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{[club.city, districtLabel(club.district)].filter(Boolean).join(', ')}</span>
        </p>
        <RegistrationBadge club={club} />
      </div>
    </li>
  )
}
