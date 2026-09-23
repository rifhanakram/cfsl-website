import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import React from 'react'

import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    default: 'Chess Federation of Sri Lanka',
    template: '%s — Chess Federation of Sri Lanka',
  },
  description: 'News, tournaments, results and governance of the Chess Federation of Sri Lanka.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
}
