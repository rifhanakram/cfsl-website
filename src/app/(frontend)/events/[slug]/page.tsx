import { CalendarIcon, DownloadIcon, MapPinIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RegistrationSection } from '@/components/events/registration-section'
import { ResultsEmbed } from '@/components/events/results-embed'
import { RichText } from '@/components/site/rich-text'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { eventTypeLabel } from '@/lib/events'
import { formatDateRange } from '@/lib/format'
import { getEvent } from '@/lib/queries/events'
import { registrationStatus } from '@/lib/registration/rules'

// Registration status and the entry list change without a content edit.
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent((await params).slug)
  if (!event) return {}
  return { title: event.title, description: event.summary ?? undefined }
}

export default async function EventPage({ params }: Props) {
  const event = await getEvent((await params).slug)
  if (!event) notFound()

  const status = registrationStatus(event.registration)
  const prospectus = typeof event.prospectus === 'object' && event.prospectus?.url ? event.prospectus : null

  return (
    <article>
      <header className="border-b bg-muted/40">
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-8 sm:py-10">
          <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground">
            ← Calendar
          </Link>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{eventTypeLabel(event.type)}</Badge>
            {status === 'open' && <Badge>Registration open</Badge>}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{event.title}</h1>
          <dl className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-muted-foreground" aria-hidden />
              <dt className="sr-only">Dates</dt>
              <dd>{formatDateRange(event.startDate, event.endDate)}</dd>
            </div>
            {event.venue && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="size-4 text-muted-foreground" aria-hidden />
                <dt className="sr-only">Venue</dt>
                <dd>{event.venue}</dd>
              </div>
            )}
          </dl>
          {event.summary && <p className="max-w-3xl text-muted-foreground">{event.summary}</p>}
          <div className="flex flex-wrap gap-2">
            {status === 'open' && (
              <Button asChild>
                <a href="#register">Register</a>
              </Button>
            )}
            {prospectus && (
              <Button asChild variant="outline">
                <a href={prospectus.url!} target="_blank" rel="noopener noreferrer">
                  <DownloadIcon /> Prospectus
                </a>
              </Button>
            )}
            {event.chessResultsUrl && (
              <Button asChild variant="outline">
                <a href="#results">Results</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-12 px-4 py-10">
        {event.description && <RichText data={event.description} />}
        {event.eligibility && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Eligibility</h2>
            <RichText data={event.eligibility} />
          </section>
        )}
        {status !== 'disabled' && <RegistrationSection event={event} status={status} />}
        {event.chessResultsUrl && <ResultsEmbed url={event.chessResultsUrl} title={event.title} />}
      </div>
    </article>
  )
}
