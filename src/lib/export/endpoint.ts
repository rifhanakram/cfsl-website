import type { PayloadHandler } from 'payload'

import { slugify } from '@/fields/slug'

import { toCsv } from './csv'
import { toTrf } from './trf'
import type { ExportEntry } from './types'

export const exportRegistrations: PayloadHandler = async (req) => {
  if (req.user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(req.url ?? '', 'http://localhost')
  const eventId = Number(url.searchParams.get('event'))
  const format = url.searchParams.get('format') === 'trf' ? 'trf' : 'csv'
  const section = url.searchParams.get('section')
  if (!eventId) return Response.json({ error: 'Missing event' }, { status: 400 })

  const event = await req.payload.findByID({ collection: 'events', id: eventId, depth: 0, req }).catch(() => null)
  if (!event) return Response.json({ error: 'Event not found' }, { status: 404 })

  const { docs } = await req.payload.find({
    collection: 'registrations',
    where: {
      event: { equals: eventId },
      ...(section ? { sectionName: { equals: section } } : {}),
    },
    sort: 'createdAt',
    pagination: false,
    depth: 0,
    req,
  })
  const entries = docs as ExportEntry[]

  const base = slugify(`${event.title}${section ? `-${section}` : ''}`) || 'registrations'
  const body = format === 'trf' ? toTrf(event, entries) : toCsv(entries)
  return new Response(body, {
    headers: {
      'Content-Type': format === 'trf' ? 'text/plain; charset=utf-8' : 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${base}.${format === 'trf' ? 'trf' : 'csv'}"`,
      'Cache-Control': 'no-store',
    },
  })
}
