import { DownloadIcon, FileArchiveIcon, FileIcon, FileTextIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { BrandAssetItem } from '@/lib/queries/media'

import { assetDetails, assetKind, downloadUrl } from './brand-assets'

const FILE_ICONS = { pdf: FileTextIcon, zip: FileArchiveIcon, file: FileIcon }

export function BrandAssetCard({ asset }: { asset: BrandAssetItem }) {
  if (!asset.url) return null
  const kind = assetKind(asset)
  const Icon = kind === 'image' || kind === 'svg' ? null : FILE_ICONS[kind]

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <div className="flex aspect-video items-center justify-center border-b bg-muted/40 p-6">
        {Icon ? (
          <Icon className="size-12 text-muted-foreground" aria-hidden />
        ) : (
          // A plain <img>: it handles SVG, and next/image isn't configured for brand-asset URLs.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.url}
            alt=""
            width={asset.width ?? undefined}
            height={asset.height ?? undefined}
            loading="lazy"
            className="max-h-full w-auto max-w-full object-contain"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-snug">{asset.title}</h3>
        {asset.description && <p className="text-sm text-muted-foreground">{asset.description}</p>}
        <p className="text-xs text-muted-foreground">{assetDetails(asset)}</p>
        <Button asChild variant="outline" size="sm" className="mt-auto self-start">
          <a href={downloadUrl(asset.url)} download={asset.filename ?? true}>
            <DownloadIcon /> Download
            <span className="sr-only"> {asset.title}</span>
          </a>
        </Button>
      </div>
    </article>
  )
}
