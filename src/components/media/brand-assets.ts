import { formatFileSize } from '@/lib/format-size'
import type { BrandAsset } from '@/payload-types'

type AssetFile = Pick<BrandAsset, 'filename' | 'mimeType' | 'filesize' | 'width' | 'height'>
type Category = { label: string; value: string }

export type AssetKind = 'image' | 'svg' | 'pdf' | 'zip' | 'file'

export function assetKind({ mimeType, filename }: Pick<AssetFile, 'mimeType' | 'filename'>): AssetKind {
  if (mimeType === 'image/svg+xml') return 'svg'
  if (mimeType?.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType === 'application/zip' || mimeType === 'application/x-zip-compressed') return 'zip'
  // Fall back to the extension when the stored MIME type is missing.
  const ext = filename?.split('.').pop()?.toLowerCase()
  if (ext === 'svg') return 'svg'
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'image'
  if (ext === 'pdf' || ext === 'zip') return ext
  return 'file'
}

// Short format label such as "PNG" or "PDF", from the file extension (or the MIME type without one).
export function assetFormat({ mimeType, filename }: Pick<AssetFile, 'mimeType' | 'filename'>) {
  const ext = filename?.includes('.') ? filename.split('.').pop() : mimeType?.split('/').pop()?.split('+')[0]
  const format = ext?.toUpperCase()
  return format === 'JPEG' ? 'JPG' : format || 'File'
}

// e.g. "PNG · 1200 × 600 px · 1.2 MB". Pixel dimensions are shown for raster images only.
export function assetDetails(asset: AssetFile) {
  const parts = [assetFormat(asset)]
  if (assetKind(asset) === 'image' && asset.width && asset.height) parts.push(`${asset.width} × ${asset.height} px`)
  const size = formatFileSize(asset.filesize)
  if (size) parts.push(size)
  return parts.join(' · ')
}

// Browsers ignore `<a download>` for cross-origin files, so Vercel Blob URLs get `?download=1`,
// which makes the Blob CDN send the file as an attachment. Local /api/... URLs are left as-is.
export function downloadUrl(url: string) {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.endsWith('.blob.vercel-storage.com')) return url
    parsed.searchParams.set('download', '1')
    return parsed.toString()
  } catch {
    return url
  }
}

// Groups assets in the given category order, then by `order`. Empty groups are dropped.
export function groupByCategory<T extends { category: string; order?: number | null }>(
  assets: T[],
  categories: readonly Category[],
) {
  return categories
    .map((category) => ({
      ...category,
      items: assets
        .filter((a) => a.category === category.value)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }))
    .filter((group) => group.items.length > 0)
}
