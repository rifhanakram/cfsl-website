import { ExternalLinkIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ResultsEmbed({ url, title }: { url: string; title: string }) {
  return (
    <section id="results" className="scroll-mt-20 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Results, standings and pairings</h2>
        <Button asChild variant="outline" size="sm">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open on chess-results.com <ExternalLinkIcon />
          </a>
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <iframe
          src={url}
          title={`${title} on chess-results.com`}
          loading="lazy"
          className="h-[70vh] min-h-[480px] w-full bg-white"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  )
}
