import { formatDate } from '@/lib/format'
import { getPublicEntries } from '@/lib/queries/registrations'
import { fieldModes, type Section, type WindowStatus } from '@/lib/registration/rules'
import type { Event } from '@/payload-types'

import { EntryList } from './entry-list'
import { RegistrationForm, type SectionOption } from './registration-form'

const dateTime = (value: string) =>
  formatDate(value, { hour: 'numeric', minute: '2-digit', hour12: true })

function describe(section: Section) {
  const parts: string[] = []
  if (section.maxAge) parts.push(`Under ${section.maxAge}`)
  if (section.minRating != null && section.maxRating != null) parts.push(`Rated ${section.minRating}–${section.maxRating}`)
  else if (section.minRating != null) parts.push(`Rated ${section.minRating}+`)
  else if (section.maxRating != null) parts.push(`Rated up to ${section.maxRating}`)
  return parts.join(' · ')
}

export async function RegistrationSection({ event, status }: { event: Event; status: WindowStatus }) {
  const registration = event.registration!
  const sections = (registration.sections ?? []).filter((s): s is Section & { id: string } => Boolean(s.id))
  const entries = await getPublicEntries(event.id)

  const options: SectionOption[] = sections.map((section) => ({
    id: section.id,
    name: section.name,
    description: describe(section),
    spotsLeft: section.capacity - entries.filter((e) => e.sectionId === section.id).length,
  }))
  const allFull = options.every((o) => o.spotsLeft <= 0)
  const referenceLabel = registration.ageReferenceDate === 'dec-31' ? '31 December' : '1 January'

  return (
    <section id="register" className="scroll-mt-20 space-y-6">
      <h2 className="text-xl font-semibold">Registration</h2>
      <dl className="grid gap-4 rounded-xl border bg-muted/30 p-4 text-sm sm:grid-cols-2">
        {registration.opensAt && (
          <div>
            <dt className="text-muted-foreground">Opens</dt>
            <dd className="font-medium">{dateTime(registration.opensAt)}</dd>
          </div>
        )}
        {registration.closesAt && (
          <div>
            <dt className="text-muted-foreground">Closes</dt>
            <dd className="font-medium">{dateTime(registration.closesAt)}</dd>
          </div>
        )}
        {registration.fee && (
          <div>
            <dt className="text-muted-foreground">Entry fee</dt>
            <dd className="font-medium">{registration.fee}</dd>
          </div>
        )}
        {sections.some((s) => s.maxAge) && (
          <div>
            <dt className="text-muted-foreground">Age categories</dt>
            <dd className="font-medium">Age on {referenceLabel} of the event year</dd>
          </div>
        )}
        {registration.paymentInstructions && (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">How to pay</dt>
            <dd className="whitespace-pre-line">{registration.paymentInstructions}</dd>
          </div>
        )}
      </dl>

      {status === 'open' && !allFull && (
        <RegistrationForm
          eventId={event.id}
          sections={options}
          modes={fieldModes(registration)}
          startDate={event.startDate}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
        />
      )}
      {status === 'open' && allFull && <p className="font-medium">All sections are full.</p>}
      {status === 'not-open' && <p className="font-medium">Registration has not opened yet.</p>}
      {status === 'closed' && <p className="font-medium">Registration is closed.</p>}

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Entry list</h2>
        <EntryList entries={entries} sections={sections} />
      </div>
    </section>
  )
}
