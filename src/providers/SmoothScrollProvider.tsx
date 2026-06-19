import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useLocation } from 'react-router-dom'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/**
 * Site-wide smooth scroll (Lenis) wired into GSAP's ticker so ScrollTrigger
 * stays in sync. The viscous glide is the scroll-level echo of the hero water.
 *
 * Honors prefers-reduced-motion: when reduced, Lenis is never started and the
 * browser's native scrolling is used.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const location = useLocation()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      lerp: 0.08, // slow, viscous — matches the hero's settle
      wheelMultiplier: 0.9,
      smoothWheel: true,
    })
    window.__lenis = lenis

    // Drive Lenis from GSAP's ticker (single rAF loop) and keep ScrollTrigger synced.
    lenis.on('scroll', ScrollTrigger.update)
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      window.__lenis = undefined
    }
  }, [reduced])

  // Reset scroll on route change; refresh triggers for the new page's layout.
  useEffect(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  }, [location.pathname])

  return <>{children}</>
}
