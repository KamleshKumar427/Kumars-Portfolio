import { useCallback, useEffect, useState } from 'react'
import {
  applyTheme,
  cycleTheme,
  getStoredTheme,
  storeTheme,
  themeLabel,
  type ThemePreference,
} from '../lib/theme'

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => getStoredTheme())

  useEffect(() => {
    applyTheme(preference)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = () => {
      if (getStoredTheme() === 'system') applyTheme('system')
    }

    media.addEventListener('change', onSystemChange)
    return () => media.removeEventListener('change', onSystemChange)
  }, [preference])

  const toggle = useCallback(() => {
    setPreference((current) => {
      const next = cycleTheme(current)
      storeTheme(next)
      return next
    })
  }, [])

  return {
    preference,
    label: themeLabel(preference),
    toggle,
  }
}
