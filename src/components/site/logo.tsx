import Image from 'next/image'
import Link from 'next/link'

import cfslLogo from '@/assets/cfsl-logo.jpg'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <Image
        src={cfslLogo}
        alt=""
        priority
        className="size-10 rounded-md bg-white object-contain"
      />
      <span className="leading-tight">
        <span className="block text-base">CFSL</span>
        <span className="block text-xs font-normal text-muted-foreground">
          Chess Federation of Sri Lanka
        </span>
      </span>
    </Link>
  )
}
