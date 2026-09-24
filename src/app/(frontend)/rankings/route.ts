import { fideRankingsUrl } from '@/lib/rankings/fide'

export const dynamic = 'force-dynamic'

export function GET() {
  return Response.redirect(fideRankingsUrl(), 307)
}
