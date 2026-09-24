import type { Metadata } from 'next'
import Link from 'next/link'

import { EventCard } from '@/components/events/event-card'
import { PageHeader } from '@/components/site/page-header'
import { Pagination } from '@/components/site/pagination'
import { colomboDate } from '@/lib/dates'
import { EVENT_TYPES, type EventType } from '@/lib/events'
import { formatDate } from '@/lib/format'
import { getEvents, todayStartIso, type EventListItem } from '@/lib/queries/events'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Tournaments & calendar',
  description: "What's happening in Sri Lankan chess: tournaments, school chess, deadlines, national team events and seminars.",
}

type Props = { searchParams: Promise<{ type?: string; when?: string; page?: string }> }

function groupByMonth(events: EventListItem[]) {
  const groups = new Map<string, EventListItem[]>()
  for (const event of events) {
    const { year, month } = colomboDate(event.startDate)
    const key = `${year}-${month}`
    groups.set(key, [...(groups.get(key) ?? []), event])
  }
  return [...groups.values()]
}

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams
  const type = EVENT_TYPES.some((t) => t.value === params.type) ? (params.type as EventType) : undefined
  const when = params.when === 'past' ? 'past' : 'upcoming'
  const page = Math.max(1, Number(params.page) || 1)
  const events = await getEvents({ when, type, page, todayStart: todayStartIso() })

  const href = (next: { type?: string; when?: string; page?: number }) => {
    const query = new URLSearchParams()
    if (next.type) query.set('type', next.type)
    if (next.when === 'past') query.set('when', 'past')
    if (next.page && next.page > 1) query.set('page', String(next.page))
    const qs = query.toString()
    return qs ? `/events?${qs}` : '/events'
  }

  const chip = (active: boolean) =>
    cn(
      'shrink-0 rounded-full border px-3 py-1.5 text-sm',
      active ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted',
    )

  return (
    <>
      <PageHeader title="What's happening in Sri Lankan chess">
        Tournaments, school chess, deadlines, national team events and seminars.
      </PageHeader>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <div className="flex gap-2" role="tablist" aria-label="Upcoming or past events">
          {(['upcoming', 'past'] as const).map((value) => (
            <Link
              key={value}
              role="tab"
              aria-selected={when === value}
              href={href({ type, when: value })}
              className={chip(when === value)}
            >
              {value === 'upcoming' ? 'Upcoming' : 'Past events'}
            </Link>
          ))}
        </div>
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" aria-label="Event types">
          <Link href={href({ when })} className={chip(!type)} aria-current={!type ? 'page' : undefined}>
            All
          </Link>
          {EVENT_TYPES.map((t) => (
            <Link
              key={t.value}
              href={href({ type: t.value, when })}
              className={chip(type === t.value)}
              aria-current={type === t.value ? 'page' : undefined}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        {events.docs.length ? (
          groupByMonth(events.docs).map((group) => (
            <section key={group[0].id} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {formatDate(group[0].startDate, { day: undefined, month: 'long' })}
              </h2>
              {group.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </section>
          ))
        ) : (
          <p className="py-12 text-center text-muted-foreground">
            {when === 'upcoming' ? 'No upcoming events are listed yet.' : 'No past events.'}
          </p>
        )}
        <Pagination page={events.page ?? 1} totalPages={events.totalPages} href={(p) => href({ type, when, page: p })} />
      </div>
    </>
  )
}
