'use client'

import { Button, SelectInput } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type EventOption = { id: number; title: string; registration?: { sections?: { name: string }[] | null } }

export function ExportRegistrations() {
  const [events, setEvents] = useState<EventOption[]>([])
  const [eventId, setEventId] = useState<number | null>(null)
  const [section, setSection] = useState('')

  useEffect(() => {
    const query = new URLSearchParams({
      'where[registration.enabled][equals]': 'true',
      sort: '-startDate',
      limit: '100',
      depth: '0',
      'select[title]': 'true',
      'select[registration][sections]': 'true',
    })
    fetch(`/api/events?${query}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setEvents(data.docs ?? []))
      .catch(() => setEvents([]))
  }, [])

  const event = events.find((e) => e.id === eventId)
  const href = (format: 'csv' | 'trf') => {
    const query = new URLSearchParams({ event: String(eventId), format })
    if (section) query.set('section', section)
    return `/api/registrations/export?${query}`
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: '1rem',
        padding: '1rem',
        marginBottom: '1.5rem',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 'var(--style-radius-m)',
      }}
    >
      <div style={{ minWidth: 260, flex: '1 1 260px' }}>
        <SelectInput
          label="Export entries for"
          name="export-event"
          path="export-event"
          options={events.map((e) => ({ label: e.title, value: String(e.id) }))}
          value={eventId ? String(eventId) : ''}
          onChange={(option) => {
            const value = option && !Array.isArray(option) ? Number(option.value) : null
            setEventId(value)
            setSection('')
          }}
        />
      </div>
      <div style={{ minWidth: 180, flex: '0 1 220px' }}>
        <SelectInput
          label="Section"
          name="export-section"
          path="export-section"
          options={[
            { label: 'All sections', value: '' },
            ...(event?.registration?.sections ?? []).map((s) => ({ label: s.name, value: s.name })),
          ]}
          value={section}
          onChange={(option) => setSection(option && !Array.isArray(option) ? String(option.value) : '')}
        />
      </div>
      <Button el="anchor" url={eventId ? href('csv') : undefined} disabled={!eventId} buttonStyle="secondary" margin={false}>
        Download CSV
      </Button>
      <Button el="anchor" url={eventId ? href('trf') : undefined} disabled={!eventId} margin={false}>
        Download TRF
      </Button>
    </div>
  )
}
