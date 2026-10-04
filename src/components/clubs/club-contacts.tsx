import { MailIcon, PhoneIcon, UserIcon } from 'lucide-react'

import type { ClubContact } from '@/lib/queries/clubs'

// Contacts arrive already stripped by publicContacts(), so private phone and email
// are absent here; the `public` check is a second guard, not the only one.
export function ClubContacts({ contacts }: { contacts: ClubContact[] }) {
  if (!contacts.length) return null
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Key contacts</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {contacts.map((contact) => (
          <li key={contact.id ?? contact.name} className="flex gap-4 rounded-xl border p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <UserIcon className="size-5 text-muted-foreground" aria-hidden />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="font-semibold">{contact.name}</p>
              <p className="text-sm text-muted-foreground">{contact.role}</p>
              {contact.public && contact.phone && (
                <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <PhoneIcon className="size-3.5" aria-hidden />
                  {contact.phone}
                </a>
              )}
              {contact.public && contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <MailIcon className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{contact.email}</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
