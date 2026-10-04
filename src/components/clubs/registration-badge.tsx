import { Badge } from '@/components/ui/badge'
import type { Club } from '@/payload-types'

export function RegistrationBadge({ club }: { club: Pick<Club, 'registration' | 'lastRenewed'> }) {
  if (club.registration === 'lapsed') return <Badge variant="outline">Registration lapsed</Badge>
  return <Badge>{club.lastRenewed ? `CFSL registered · ${club.lastRenewed}` : 'CFSL registered'}</Badge>
}
