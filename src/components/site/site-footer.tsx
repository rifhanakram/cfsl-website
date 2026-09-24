import Link from 'next/link'

import { PRIMARY_NAV, SECONDARY_NAV } from '@/lib/navigation'

import { NavLink } from './nav-link'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-semibold">Chess Federation of Sri Lanka</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The national governing body for chess in Sri Lanka.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm sm:col-span-2 sm:grid-cols-3">
          {[...PRIMARY_NAV.slice(1), ...SECONDARY_NAV].map((item) => (
            <NavLink key={item.href} item={item} className="text-muted-foreground hover:text-foreground" />
          ))}
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            Staff login
          </Link>
        </nav>
      </div>
      <p className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Chess Federation of Sri Lanka
      </p>
    </footer>
  )
}
