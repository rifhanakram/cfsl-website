import { ChevronDownIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SECONDARY_NAV } from '@/lib/navigation'
import { getNavigation } from '@/lib/queries/site'

import { Logo } from './logo'
import { MobileNav } from './mobile-nav'
import { NavLink } from './nav-link'

export async function SiteHeader() {
  const primary = await getNavigation()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {primary.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            />
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              More <ChevronDownIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SECONDARY_NAV.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <NavLink item={item} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <MobileNav primary={primary} secondary={SECONDARY_NAV} />
      </div>
    </header>
  )
}
