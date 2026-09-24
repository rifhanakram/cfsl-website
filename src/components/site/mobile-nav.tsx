'use client'

import { MenuIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { NavItem } from '@/lib/navigation'

import { NavLink } from './nav-link'

export function MobileNav({ primary, secondary }: { primary: NavItem[]; secondary: NavItem[] }) {
  const linkClass = 'block rounded-md px-3 py-2.5 text-base font-medium hover:bg-muted'

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2 pb-6" aria-label="Main">
          {primary.map((item) => (
            <SheetClose key={item.href} asChild>
              <NavLink item={item} className={linkClass} />
            </SheetClose>
          ))}
          <Separator className="my-2" />
          {secondary.map((item) => (
            <SheetClose key={item.href} asChild>
              <NavLink item={item} className={`${linkClass} text-muted-foreground`} />
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
