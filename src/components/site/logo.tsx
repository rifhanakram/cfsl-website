import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-md bg-primary text-lg text-primary-foreground"
      >
        ♞
      </span>
      <span className="leading-tight">
        <span className="block text-base">CFSL</span>
        <span className="block text-xs font-normal text-muted-foreground">
          Chess Federation of Sri Lanka
        </span>
      </span>
    </Link>
  )
}
