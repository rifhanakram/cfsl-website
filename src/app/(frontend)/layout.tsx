import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'

import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cfsl-website.vercel.app'),
  title: {
    default: 'Chess Federation of Sri Lanka',
    template: '%s — Chess Federation of Sri Lanka',
  },
  description: 'News, tournaments, results and governance of the Chess Federation of Sri Lanka.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
