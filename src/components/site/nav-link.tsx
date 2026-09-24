import Link from 'next/link'
import type { ComponentProps } from 'react'

import type { NavItem } from '@/lib/navigation'

type Props = { item: NavItem } & Omit<ComponentProps<'a'>, 'href'>

export function NavLink({ item, ...props }: Props) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" {...props}>
        {item.label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  return (
    <Link href={item.href} {...props}>
      {item.label}
    </Link>
  )
}
