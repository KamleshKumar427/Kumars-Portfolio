import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from './Container'

/**
 * Meniscus section: generous vertical rhythm + page container. The breathing
 * room that makes the site feel premium. Pass `bare` to drop the inner
 * container (for full-bleed content that manages its own layout).
 */
export function Section({
  id,
  children,
  className,
  tight = false,
  bare = false,
}: {
  id?: string
  children: ReactNode
  className?: string
  tight?: boolean
  bare?: boolean
}) {
  return (
    <section id={id} className={cn('mn-section', tight && 'mn-section--tight', className)}>
      {bare ? children : <Container>{children}</Container>}
    </section>
  )
}
