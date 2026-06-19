import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { inkBloom, duration, gsapEase } from '@/lib/motion'
import { cn } from '@/lib/cn'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger direct children ("ink bloom" cascade) instead of the wrapper itself. */
  stagger?: boolean
  /** Extra delay (seconds) before the reveal begins. */
  delay?: number
  /** ScrollTrigger start position. */
  start?: string
}

/**
 * Scroll-reveal wrapper — the "ink bloom" (rise + fade + refraction sharpen).
 * Scroll position → GSAP. Fires once. Fully respects prefers-reduced-motion
 * (content simply appears). Initial hidden state is set in useLayoutEffect to
 * avoid any flash before the trigger fires.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  start = 'top 85%',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets: Element | Element[] = stagger ? Array.from(el.children) : el

    if (reduced) {
      gsap.set(targets, { autoAlpha: 1, y: 0, scale: 1, filter: 'none' })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, inkBloom.from)
      gsap.to(targets, {
        ...inkBloom.to,
        duration: duration.reveal,
        ease: gsapEase.water,
        delay,
        stagger: stagger ? inkBloom.stagger : 0,
        scrollTrigger: { trigger: el, start, once: true },
      })
    }, ref)

    return () => ctx.revert()
  }, [stagger, delay, start])

  return (
    <div ref={ref} className={cn(!stagger && 'mn-reveal', className)}>
      {children}
    </div>
  )
}
