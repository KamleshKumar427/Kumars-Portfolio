import { useEffect, useState } from 'react'
import { resolveIsDark } from '../lib/theme'

/**
 * Resolved dark/light state, reacting to both the user's manual override
 * (data-theme on <html>) and the system preference when set to "system".
 */
export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() =>
    typeof window === 'undefined' ? true : resolveIsDark(),
  )

  useEffect(() => {
    const update = () => setIsDark(resolveIsDark())

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', update)

    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    update()
    return () => {
      media.removeEventListener('change', update)
      observer.disconnect()
    }
  }, [])

  return isDark
}
