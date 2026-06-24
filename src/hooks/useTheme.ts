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
    isDark: preference === 'dark',
    label: themeLabel(preference),
    toggle,
  }
}
