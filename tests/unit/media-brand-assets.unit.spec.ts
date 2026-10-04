import { describe, expect, it } from 'vitest'

import {
  assetDetails,
  assetFormat,
  assetKind,
  downloadUrl,
  groupByCategory,
} from '@/components/media/brand-assets'

const file = (overrides: Parameters<typeof assetDetails>[0]) => ({
  filename: null,
  mimeType: null,
  filesize: null,
  width: null,
  height: null,
  ...overrides,
})

describe('assetKind', () => {
  it('classifies by MIME type', () => {
    expect(assetKind(file({ mimeType: 'image/png' }))).toBe('image')
    expect(assetKind(file({ mimeType: 'image/jpeg' }))).toBe('image')
    expect(assetKind(file({ mimeType: 'image/svg+xml' }))).toBe('svg')
    expect(assetKind(file({ mimeType: 'application/pdf' }))).toBe('pdf')
    expect(assetKind(file({ mimeType: 'application/zip' }))).toBe('zip')
  })

  it('falls back to the file extension', () => {
    expect(assetKind(file({ filename: 'logo.SVG' }))).toBe('svg')
    expect(assetKind(file({ filename: 'kit.zip' }))).toBe('zip')
    expect(assetKind(file({ filename: 'notes.txt' }))).toBe('file')
  })
})

describe('assetFormat', () => {
  it('uses the upper-cased extension', () => {
    expect(assetFormat(file({ filename: 'cfsl-logo.png', mimeType: 'image/png' }))).toBe('PNG')
    expect(assetFormat(file({ filename: 'photo.jpeg', mimeType: 'image/jpeg' }))).toBe('JPG')
  })

  it('falls back to the MIME subtype', () => {
    expect(assetFormat(file({ mimeType: 'image/svg+xml' }))).toBe('SVG')
    expect(assetFormat(file({}))).toBe('File')
  })
})

describe('assetDetails', () => {
  it('includes pixel dimensions for raster images', () => {
    expect(
      assetDetails(file({ filename: 'logo.png', mimeType: 'image/png', filesize: 1.2 * 1024 * 1024, width: 1200, height: 600 })),
    ).toBe('PNG · 1200 × 600 px · 1.2 MB')
  })

  it('omits dimensions for SVG and documents', () => {
    expect(assetDetails(file({ filename: 'logo.svg', mimeType: 'image/svg+xml', filesize: 4096, width: 300, height: 100 }))).toBe(
      'SVG · 4 KB',
    )
    expect(assetDetails(file({ filename: 'guide.pdf', mimeType: 'application/pdf' }))).toBe('PDF')
  })
})

describe('downloadUrl', () => {
  it('forces attachment for Vercel Blob URLs', () => {
    expect(downloadUrl('https://abc.public.blob.vercel-storage.com/logo.svg')).toBe(
      'https://abc.public.blob.vercel-storage.com/logo.svg?download=1',
    )
  })

  it('leaves local URLs alone', () => {
    expect(downloadUrl('/api/brand-assets/file/logo.svg')).toBe('/api/brand-assets/file/logo.svg')
  })
})

describe('groupByCategory', () => {
  const categories = [
    { label: 'Logos', value: 'logo' },
    { label: 'Guidelines', value: 'guidelines' },
    { label: 'Other', value: 'other' },
  ]

  it('groups in category order, sorts by order and drops empty groups', () => {
    const groups = groupByCategory(
      [
        { id: 1, category: 'other', order: 0 },
        { id: 2, category: 'logo', order: 5 },
        { id: 3, category: 'logo', order: 1 },
        { id: 4, category: 'logo', order: null },
      ],
      categories,
    )
    expect(groups.map((g) => g.value)).toEqual(['logo', 'other'])
    expect(groups[0].items.map((a) => a.id)).toEqual([4, 3, 2])
  })
})
