import {
  AtSignIcon,
  CameraIcon,
  ExternalLinkIcon,
  GlobeIcon,
  LinkIcon,
  MapIcon,
  MapPinIcon,
  MusicIcon,
  PlayIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SOCIAL_PLATFORMS } from '@/lib/clubs'
import type { ClubProfile } from '@/lib/queries/clubs'
import { labelFor } from '@/lib/resources'

// lucide-react no longer ships brand logos, so each platform gets a generic stand-in
// next to its name.
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: UsersIcon,
  instagram: CameraIcon,
  youtube: PlayIcon,
  x: AtSignIcon,
  tiktok: MusicIcon,
}

const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function ClubVenue({ club }: { club: ClubProfile }) {
  const socials = club.socials ?? []
  if (!club.address && !club.mapUrl && !club.website && !socials.length) return null

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Venue</h2>
      <div className="space-y-4 rounded-xl border p-4 sm:p-5">
        {club.address && (
          <p className="flex gap-2">
            <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="whitespace-pre-line">{club.address}</span>
          </p>
        )}
        {club.website && (
          <p className="flex items-center gap-2">
            <GlobeIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <a href={club.website} target="_blank" rel="noopener noreferrer" className="truncate text-primary hover:underline">
              {hostname(club.website)}
            </a>
          </p>
        )}
        {(club.mapUrl || socials.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {club.mapUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={club.mapUrl} target="_blank" rel="noopener noreferrer">
                  <MapIcon /> Google Maps <ExternalLinkIcon className="text-muted-foreground" aria-hidden />
                </a>
              </Button>
            )}
            {socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform] ?? LinkIcon
              return (
                <Button key={social.id ?? social.url} asChild variant="outline" size="sm">
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    <Icon aria-hidden /> {social.platform === 'other' ? hostname(social.url) : labelFor(SOCIAL_PLATFORMS, social.platform)}
                  </a>
                </Button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
