import { unstable_cache } from 'next/cache'

export const TAGS = {
  pages: 'pages',
  navigation: 'navigation',
  news: 'news',
  events: 'events',
  registrations: 'registrations',
  documents: 'documents',
  people: 'people',
  downloads: 'downloads',
  homepage: 'homepage',
} as const

export type Tag = (typeof TAGS)[keyof typeof TAGS]

export function cached<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  key: string,
  tags: Tag[],
) {
  return unstable_cache(fn, [key], { tags })
}
