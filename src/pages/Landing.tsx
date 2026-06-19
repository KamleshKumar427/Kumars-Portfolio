import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Hero } from '../sections/Hero'
import { IndexStatement } from '../sections/IndexStatement'
import { About } from '../sections/About'
import { Experience } from '../sections/Experience'
import { Projects } from '../sections/Projects'
import { Skills } from '../sections/Skills'
import { Contact } from '../sections/Contact'
import { scrollToId } from '@/lib/scroll'

/**
 * Landing page. Hero + the new Meniscus "Index" statement, followed by the
 * legacy sections (About / Experience / Projects / Skills / Contact) which will
 * be rebuilt to the design system in later passes.
 */
export function Landing() {
  const location = useLocation()

  // Scroll to a hash target after the page mounts (links from other routes).
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const t = setTimeout(() => scrollToId(id), 120)
    return () => clearTimeout(t)
  }, [location.hash])

  return (
    <>
      <Hero />
      <IndexStatement />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </>
  )
}
