import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from '@/lib/gsap'

/** Reset scroll to the top on route change, and refresh ScrollTrigger for the
 *  new page's layout. Renders nothing. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    ScrollTrigger.refresh()
  }, [pathname])

  return null
}
