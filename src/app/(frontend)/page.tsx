import { ArrowRightIcon, FileTextIcon, ListOrderedIcon, MegaphoneIcon, NotebookPenIcon, TrophyIcon } from 'lucide-react'
import Link from 'next/link'

import { EventCard } from '@/components/events/event-card'
import { NewsCard } from '@/components/news/news-card'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateRange } from '@/lib/format'
import { RANKINGS_PATH } from '@/lib/navigation'
import { todayStartIso, type EventListItem } from '@/lib/queries/events'
import { getAnnouncements, getEvents, getHomepage, getRecentResults } from '@/lib/queries/home'
import { getNewsList } from '@/lib/queries/news'
import { registrationStatus } from '@/lib/registration/rules'
import type { Event, News } from '@/payload-types'

// Registration windows open and close without a content edit.
export const revalidate = 300

function SectionHeading({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline">
        {linkLabel} <ArrowRightIcon className="size-4" aria-hidden />
      </Link>
    </div>
  )
}

const published = <T extends { _status?: string | null }>(items: (number | T)[] | null | undefined) =>
  (items ?? []).filter((item): item is T => typeof item === 'object' && item._status === 'published')

export default async function HomePage() {
  const todayStart = todayStartIso()
  const [home, latestAnnouncements, upcoming, results, news] = await Promise.all([
    getHomepage(),
    getAnnouncements(3),
    getEvents({ when: 'upcoming', todayStart, limit: 20 }),
    getRecentResults(todayStart, 3),
    getNewsList({ page: 1 }),
  ])

  const pinned = published<News>(home.pinnedAnnouncements)
  const announcements = pinned.length ? pinned : latestAnnouncements
  const featured = published<Event>(home.featuredEvents).filter((e) => upcoming.docs.some((u) => u.id === e.id))
  const featuredIds = new Set(featured.map((e) => e.id))
  const upcomingEvents: EventListItem[] = [
    ...upcoming.docs.filter((e) => featuredIds.has(e.id)),
    ...upcoming.docs.filter((e) => !featuredIds.has(e.id)),
  ].slice(0, 5)
  const openRegistrations = upcoming.docs.filter((e) => registrationStatus(e.registration) === 'open')

  return (
    <>
      <section className="border-b bg-gradient-to-b from-primary/10 to-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">Chess Federation of Sri Lanka</h1>
          {home.tagline && <p className="mt-4 max-w-xl text-lg text-muted-foreground">{home.tagline}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/events">Tournaments & calendar</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={RANKINGS_PATH} target="_blank" rel="noopener noreferrer">
                National rankings
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10">
        {announcements.length > 0 && (
          <section aria-labelledby="announcements" className="rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-6">
            <h2 id="announcements" className="flex items-center gap-2 font-semibold">
              <MegaphoneIcon className="size-5 text-primary" aria-hidden /> Official announcements
            </h2>
            <ul className="mt-3 divide-y divide-primary/10">
              {announcements.map((item) => (
                <li key={item.id} className="flex flex-col gap-1 py-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <Link href={`/news/${item.slug}`} className="font-medium hover:underline">
                    {item.title}
                  </Link>
                  <time dateTime={item.publishedAt} className="shrink-0 text-sm text-muted-foreground">
                    {formatDate(item.publishedAt)}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        )}

        {openRegistrations.length > 0 && (
          <section className="space-y-4">
            <SectionHeading title="Registration open" href="/events" linkLabel="All events" />
            <ul className="grid gap-3 sm:grid-cols-2">
              {openRegistrations.slice(0, 4).map((event) => (
                <li key={event.id} className="flex items-center justify-between gap-4 rounded-xl border p-4">
                  <div className="min-w-0">
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateRange(event.startDate, event.endDate)}
                      {event.registration?.closesAt && ` · closes ${formatDate(event.registration.closesAt)}`}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/events/${event.slug}#register`}>Register</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid gap-14 lg:grid-cols-[3fr_2fr]">
          <section className="space-y-4">
            <SectionHeading title="What's happening" href="/events" linkLabel="Full calendar" />
            {upcomingEvents.length ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming events are listed yet.</p>
            )}
          </section>

          <section className="space-y-4">
            <SectionHeading title="Latest results" href="/events?when=past" linkLabel="Past events" />
            {results.length ? (
              <ul className="space-y-3">
                {results.map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`/events/${event.slug}#results`}
                      className="flex items-center gap-3 rounded-xl border p-4 hover:border-primary"
                    >
                      <TrophyIcon className="size-5 shrink-0 text-primary" aria-hidden />
                      <span className="min-w-0">
                        <span className="block font-medium">{event.title}</span>
                        <span className="text-sm text-muted-foreground">{formatDateRange(event.startDate, event.endDate)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Results will appear here after each event.</p>
            )}
          </section>
        </div>

        <section className="space-y-4">
          <SectionHeading title="Latest news" href="/news" linkLabel="All news" />
          {news.docs.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.docs.slice(0, 6).map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No news has been published yet.</p>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Quick links">
          {[
            { href: RANKINGS_PATH, label: 'National rankings', icon: ListOrderedIcon, external: true },
            { href: '/resources/documents', label: 'Governance documents', icon: FileTextIcon },
            { href: '/resources/downloads', label: 'Forms & downloads', icon: NotebookPenIcon },
          ].map(({ href, label, icon: Icon, external }) => (
            <Link
              key={href}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex items-center gap-3 rounded-xl border p-4 font-medium hover:border-primary"
            >
              <Icon className="size-5 text-primary" aria-hidden /> {label}
            </Link>
          ))}
        </section>
      </div>
    </>
  )
}
