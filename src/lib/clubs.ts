// The 25 administrative districts of Sri Lanka.
export const DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
] as const

export const DISTRICT_OPTIONS = DISTRICTS.map((d) => ({ label: d, value: d.toLowerCase().replace(/\s+/g, '-') }))

export const CLUB_STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Lapsed', value: 'lapsed' },
] as const

export const SOCIAL_PLATFORMS = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'X (Twitter)', value: 'x' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Other', value: 'other' },
] as const
