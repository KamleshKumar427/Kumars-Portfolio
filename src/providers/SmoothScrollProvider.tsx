import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/**
 * Site-wide smooth scroll (Lenis) wired into GSAP's ticker so ScrollTrigger
 * stays in sync. Anchor links (#experience, #lab, …) glide via Lenis. Honors
 * prefers-reduced-motion: when reduced, native scrolling is used.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      lerp: 0.08, // slow, viscous glide
      wheelMultiplier: 0.9,
      smoothWheel: true,
    })
    window.__lenis = lenis

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

  // Smooth in-page anchor navigation (nav links, scroll cues).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as
        | HTMLAnchorElement
        | null
      if (!anchor) return
      const id = anchor.getAttribute('href')!.slice(1)
      const target = id ? document.getElementById(id) : document.body
      if (!target) return
      e.preventDefault()
      if (window.__lenis) window.__lenis.scrollTo(target, { offset: -64 })
      else target.scrollIntoView({ behavior: 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return <>{children}</>
}
