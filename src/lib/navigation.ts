export type NavItem = { label: string; href: string; external?: boolean }

export const RANKINGS_PATH = '/rankings'

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'News', href: '/news' },
  { label: 'Tournaments', href: '/events' },
  { label: 'Rankings', href: RANKINGS_PATH, external: true },
  { label: 'Resources', href: '/resources' },
  { label: 'About CFSL', href: '/about' },
]

// Sections from the full site map that launch as "Coming soon" pages (L12).
export const PLACEHOLDER_SECTIONS: Record<string, string> = {
  players: 'Players',
  clubs: 'Clubs',
  education: 'Education',
  'national-teams': 'National Teams',
  media: 'Media',
}

export const SECONDARY_NAV: NavItem[] = Object.entries(PLACEHOLDER_SECTIONS).map(
  ([slug, label]) => ({ label, href: `/${slug}` }),
)
