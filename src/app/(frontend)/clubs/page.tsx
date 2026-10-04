import { SearchIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ClubCard, districtLabel } from '@/components/clubs/club-card'
import { PageHeader } from '@/components/site/page-header'
import { Pagination } from '@/components/site/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CLUB_STATUSES, DISTRICT_OPTIONS } from '@/lib/clubs'
import { getClubDistricts, getClubs, type ClubDistrict, type ClubStatus } from '@/lib/queries/clubs'

export const metadata: Metadata = {
  title: 'Club directory',
  description: 'Find a chess club near you: clubs across Sri Lanka and their CFSL registration status.',
}

type Props = { searchParams: Promise<{ q?: string; district?: string; status?: string; page?: string }> }

const selectClass =
  'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'

export default async function ClubsPage({ searchParams }: Props) {
  const params = await searchParams
  const q = params.q?.trim().slice(0, 100) || undefined
  const district = DISTRICT_OPTIONS.some((d) => d.value === params.district)
    ? (params.district as ClubDistrict)
    : undefined
  const status = CLUB_STATUSES.some((s) => s.value === params.status) ? (params.status as ClubStatus) : undefined
  const page = Math.max(1, Number(params.page) || 1)
  const [clubs, districtsWithClubs] = await Promise.all([getClubs({ q, district, status, page }), getClubDistricts()])

  // Only offer districts that have clubs, in the canonical order, plus the current pick.
  const withClubs = new Set<string>(districtsWithClubs)
  const districts = DISTRICT_OPTIONS.filter((d) => withClubs.has(d.value) || d.value === district)

  const href = (p: number) => {
    const query = new URLSearchParams()
    if (q) query.set('q', q)
    if (district) query.set('district', district)
    if (status) query.set('status', status)
    if (p > 1) query.set('page', String(p))
    const qs = query.toString()
    return qs ? `/clubs?${qs}` : '/clubs'
  }

  const filtered = Boolean(q || district || status)

  return (
    <>
      <PageHeader title="Club directory">
        Chess clubs across Sri Lanka. Find one near you and see whether it is registered with CFSL.
      </PageHeader>
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <form className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_11rem_11rem_auto] sm:items-end" role="search">
          <div className="space-y-1.5">
            <Label htmlFor="q">Search</Label>
            <Input id="q" name="q" type="search" defaultValue={q} placeholder="Club name or city" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="district">District</Label>
            <select id="district" name="district" defaultValue={district ?? ''} className={selectClass}>
              <option value="">All districts</option>
              {districts.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status">CFSL registration</Label>
            <select id="status" name="status" defaultValue={status ?? ''} className={selectClass}>
              <option value="">All clubs</option>
              <option value="active">Registered</option>
              <option value="lapsed">Lapsed</option>
            </select>
          </div>
          <Button type="submit">
            <SearchIcon /> Search
          </Button>
        </form>

        {clubs.docs.length ? (
          <>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {clubs.totalDocs === 1 ? '1 club' : `${clubs.totalDocs} clubs`}
              {district && ` in ${districtLabel(district)}`}
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.docs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </ul>
          </>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>{filtered ? 'No clubs match your search.' : 'Clubs will be listed here soon.'}</p>
            {filtered && (
              <Link href="/clubs" className="mt-2 inline-block text-primary hover:underline">
                Clear filters
              </Link>
            )}
          </div>
        )}
        <Pagination page={clubs.page ?? 1} totalPages={clubs.totalPages} href={href} />
      </div>
    </>
  )
}
