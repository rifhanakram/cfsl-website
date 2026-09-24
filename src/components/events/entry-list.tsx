import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { PublicEntry } from '@/lib/queries/registrations'

export function EntryList({ entries, sections }: { entries: PublicEntry[]; sections: { id: string; name: string }[] }) {
  if (!entries.length) return <p className="text-sm text-muted-foreground">No entries yet.</p>

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const rows = entries.filter((e) => e.sectionId === section.id)
        if (!rows.length) return null
        return (
          <div key={section.id} className="space-y-2">
            <h3 className="font-medium">
              {section.name} <span className="text-sm font-normal text-muted-foreground">({rows.length})</span>
            </h3>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>FIDE ID</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead>School / club</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((entry, i) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">{entry.displayName}</TableCell>
                      <TableCell>
                        {entry.fideId ? (
                          <a
                            href={`https://ratings.fide.com/profile/${entry.fideId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {entry.fideId}
                          </a>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{entry.rating || '—'}</TableCell>
                      <TableCell>{entry.schoolOrClub || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
