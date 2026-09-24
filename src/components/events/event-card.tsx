import { MapPinIcon } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { colomboDate } from '@/lib/dates'
import { eventTypeLabel } from '@/lib/events'
import { formatDateRange } from '@/lib/format'
import type { EventListItem } from '@/lib/queries/events'
import { registrationStatus } from '@/lib/registration/rules'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function EventCard({ event }: { event: EventListItem }) {
  const start = colomboDate(event.startDate)
  const status = registrationStatus(event.registration)

  return (
    <article className="relative flex gap-4 rounded-xl border bg-card p-4">
      <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-muted py-2 text-center">
        <span className="text-xs font-medium uppercase text-muted-foreground">{MONTHS[start.month - 1]}</span>
        <span className="text-xl font-semibold leading-none">{start.day}</span>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{eventTypeLabel(event.type)}</Badge>
          {status === 'open' && <Badge>Registration open</Badge>}
          {event.chessResultsUrl && <Badge variant="outline">Results</Badge>}
        </div>
        <h3 className="font-semibold leading-snug">
          <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0 hover:underline">
            {event.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatDateRange(event.startDate, event.endDate)}
          {event.venue && (
            <span className="ml-2 inline-flex items-center gap-1">
              <MapPinIcon className="size-3.5" aria-hidden />
              {event.venue}
            </span>
          )}
        </p>
        {event.summary && <p className="line-clamp-2 text-sm">{event.summary}</p>}
      </div>
    </article>
  )
}
