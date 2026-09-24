import type { ReactNode } from 'react'

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border-b bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {children && <div className="mt-2 max-w-3xl text-muted-foreground">{children}</div>}
      </div>
    </div>
  )
}
