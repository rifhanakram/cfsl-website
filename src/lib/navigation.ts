export type NavItem = { label: string; href: string; external?: boolean }

export const RANKINGS_PATH = '/rankings'

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'News', href: '/news' },
  { label: 'Tournaments', href: '/events' },
  { label: 'Rankings', href: RANKINGS_PATH, external: true },
  { label: 'Clubs', href: '/clubs' },
  { label: 'Education', href: '/education' },
  { label: 'Media', href: '/media' },
  { label: 'Resources', href: '/resources' },
  { label: 'About CFSL', href: '/about' },
]

// Sections from the full site map that launch as "Coming soon" pages (L12).
export const PLACEHOLDER_SECTIONS: Record<string, string> = {
  players: 'Players',
  'national-teams': 'National Teams',
}

export const SECONDARY_NAV: NavItem[] = Object.entries(PLACEHOLDER_SECTIONS).map(
  ([slug, label]) => ({ label, href: `/${slug}` }),
)

// Sections whose topic pages live at /<section>/<slug> (CMS Pages with `section` set).
export const PAGE_SECTIONS = [{ label: 'Education', value: 'education' }] as const
