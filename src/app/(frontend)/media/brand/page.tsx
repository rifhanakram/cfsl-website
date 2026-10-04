import type { Metadata } from 'next'

import { BRAND_ASSET_CATEGORIES } from '@/collections/BrandAssets'
import { BrandAssetCard } from '@/components/media/brand-asset-card'
import { groupByCategory } from '@/components/media/brand-assets'
import { PageHeader } from '@/components/site/page-header'
import { getBrandAssets } from '@/lib/queries/media'

export const metadata: Metadata = {
  title: 'Brand hub',
  description: 'Official CFSL logos, brand guidelines and templates for media and partners.',
}

export default async function BrandPage() {
  const groups = groupByCategory(await getBrandAssets(), BRAND_ASSET_CATEGORIES)

  return (
    <>
      <PageHeader title="Brand hub">
        Official logos, brand guidelines and templates for media, partners and affiliated clubs.
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
        {!groups.length && (
          <p className="py-12 text-center text-muted-foreground">No brand assets have been published yet.</p>
        )}
        {groups.map((group) => (
          <section key={group.value} className="space-y-4">
            <h2 className="text-lg font-semibold">{group.label}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((asset) => (
                <BrandAssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
