import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Mono telemetry label — the dossier voice. The leading dot is the status LED. */
export function Eyebrow({
  children,
  className,
  bare = false,
}: {
  children: ReactNode
  className?: string
  bare?: boolean
}) {
  return (
    <span className={cn('mn-eyebrow', bare && 'mn-eyebrow--bare', className)}>{children}</span>
  )
}
