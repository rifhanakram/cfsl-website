export const TIME_ZONE = 'Asia/Colombo'

// FIDE publishes monthly lists; `period` is the 1st of the month, e.g. 2026-09-01.
export function fideRankingsUrl(now: Date = new Date()) {
  const [year, month] = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
  })
    .format(now)
    .split('-')
  return `https://ratings.fide.com/datasets/federation_set.php?federation=SRI&period=${year}-${month}-01`
}
