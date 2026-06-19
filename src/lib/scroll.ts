import type Lenis from 'lenis'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/** Scroll to an element by id, using Lenis when active, else native. Header-aware offset. */
export function scrollToId(id: string, offset = -64) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(el, { offset })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
