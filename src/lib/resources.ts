export const DOCUMENT_CATEGORIES = [
  { label: 'Constitution', value: 'constitution' },
  { label: 'Regulations & Policies', value: 'regulations-policies' },
  { label: 'Official Circulars', value: 'circulars' },
  { label: 'Annual Reports', value: 'annual-reports' },
  { label: 'Strategic Plans', value: 'strategic-plans' },
] as const

export const DOWNLOAD_CATEGORIES = [
  { label: 'Clubs', value: 'club' },
  { label: 'Players', value: 'player' },
  { label: 'Coaches & arbiters', value: 'coach-arbiter' },
  { label: 'Other', value: 'other' },
] as const

export const labelFor = (options: readonly { label: string; value: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value
