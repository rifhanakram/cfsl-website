import { describe, expect, it } from 'vitest'

import { fideRankingsUrl } from '@/lib/rankings/fide'

describe('fideRankingsUrl', () => {
  it('uses the first of the current month', () => {
    expect(fideRankingsUrl(new Date('2026-09-23T10:00:00Z'))).toBe(
      'https://ratings.fide.com/datasets/federation_set.php?federation=SRI&period=2026-09-01',
    )
  })

  it('uses Colombo time at a month boundary', () => {
    // 20:00 UTC on 30 Sept is 01:30 on 1 Oct in Colombo.
    expect(fideRankingsUrl(new Date('2026-09-30T20:00:00Z'))).toContain('period=2026-10-01')
  })
})
