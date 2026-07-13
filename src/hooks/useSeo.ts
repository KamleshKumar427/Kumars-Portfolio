import { useEffect } from 'react'

type SeoProps = {
  title: string
  description: string
  /** Absolute canonical URL for this route. */
  canonical: string
}

/**
 * Per-route SEO: keeps document.title, meta description, canonical, and the
 * og/twitter mirrors in sync with the current route. The homepage values are
 * baked into index.html (best for crawlers); this hook switches them when the
 * route changes client-side.
 */
export function useSeo({ title, description, canonical }: SeoProps) {
  useEffect(() => {
    document.title = title

    const set = (selector: string, attr: 'content' | 'href', value: string) => {
      const el = document.head.querySelector<HTMLElement>(selector)
      if (el) el.setAttribute(attr, value)
    }

    set('meta[name="description"]', 'content', description)
    set('link[rel="canonical"]', 'href', canonical)
    set('meta[property="og:title"]', 'content', title)
    set('meta[property="og:description"]', 'content', description)
    set('meta[property="og:url"]', 'content', canonical)
    set('meta[name="twitter:title"]', 'content', title)
    set('meta[name="twitter:description"]', 'content', description)
  }, [title, description, canonical])
}
