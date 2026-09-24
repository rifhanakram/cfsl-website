export type ExportEntry = {
  sectionName: string
  lastName: string
  otherNames: string
  fideId?: string | null
  rating?: number | null
  dateOfBirth?: string | null
  sex?: 'm' | 'w' | null
  email?: string | null
  phone?: string | null
  schoolOrClub?: string | null
  coach?: string | null
  guardianName?: string | null
  guardianContact?: string | null
  paid?: boolean | null
  createdAt: string
}

export type ExportEvent = { title: string; startDate: string; endDate?: string | null; venue?: string | null }
