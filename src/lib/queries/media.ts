import { cached, TAGS } from '@/lib/cache'
import { getPayloadClient } from '@/lib/payload'

export const getBrandAssets = cached(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'brand-assets',
      sort: 'order',
      pagination: false,
      depth: 0,
      select: {
        title: true,
        category: true,
        description: true,
        order: true,
        url: true,
        filename: true,
        mimeType: true,
        filesize: true,
        width: true,
        height: true,
      },
    })
    return docs
  },
  'brand-assets',
  [TAGS.brandAssets],
)

export type BrandAssetItem = Awaited<ReturnType<typeof getBrandAssets>>[number]
