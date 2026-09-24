import { ConstructionIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function ComingSoon({ section }: { section: string }) {
  return (
    <Alert>
      <ConstructionIcon />
      <AlertTitle>Coming soon</AlertTitle>
      <AlertDescription>
        The {section} section is being prepared and will be published here.
      </AlertDescription>
    </Alert>
  )
}
