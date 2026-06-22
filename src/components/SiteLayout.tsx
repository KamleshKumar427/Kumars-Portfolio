import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { SiteFooter } from './SiteFooter'
import { pageTransition } from '@/lib/motion'
import { ScrollTrigger } from '@/lib/gsap'

/** App shell: shared header + route-level page transitions (Motion dissolve) + footer. */
export function SiteLayout() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  // Once the dissolve settles, drop the filter entirely. A lingering
  // `filter: blur(0px)` turns <main> into the containing block for
  // position:fixed, which breaks GSAP ScrollTrigger pins (the koi pond) nested
  // inside it — the pinned section mispositions and scrolls past half-shown.
  const clearFilter = useCallback(() => {
    if (mainRef.current) mainRef.current.style.filter = 'none'
    ScrollTrigger.refresh()
  }, [])

  // Fallback for the first paint: AnimatePresence initial={false} runs no enter
  // animation, so onAnimationComplete may not fire — clear after the dissolve window.
  useEffect(() => {
    const t = window.setTimeout(clearFilter, 700)
    return () => window.clearTimeout(t)
  }, [location.pathname, clearFilter])

  return (
    <>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          ref={mainRef}
          key={location.pathname}
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={pageTransition.transition}
          onAnimationComplete={clearFilter}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <SiteFooter />
    </>
  )
}
