import Image from 'next/image'
import Link from 'next/link'

import cfslLogo from '@/assets/cfsl-logo.jpg'
import { getLogo } from '@/lib/queries/site'

export async function Logo() {
  const logo = await getLogo()

  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <Image
        src={logo?.url ?? cfslLogo}
        alt=""
        width={40}
        height={40}
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
