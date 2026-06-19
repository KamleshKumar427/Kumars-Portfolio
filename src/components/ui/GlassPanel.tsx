import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * The unifier: a sheet of glass over deep water. Every card/panel uses this so
 * no section can drift into a different template. Refraction (backdrop-blur),
 * a hairline edge, a top sheen, and deep soft shadow give held-glass depth.
 */
export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('mn-glass', className)}>{children}</div>
}
