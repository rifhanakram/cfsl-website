import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/utils'

export function RichText({
  data,
  className,
}: {
  data: SerializedEditorState | null | undefined
  className?: string
}) {
  if (!data) return null
  return (
    <LexicalRichText
      data={data}
      className={cn('prose prose-neutral max-w-none prose-a:text-primary', className)}
    />
  )
}
