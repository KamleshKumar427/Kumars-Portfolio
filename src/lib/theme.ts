export type ThemePreference = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export function getStoredTheme(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  // First visit or legacy "system" — honour OS once, no system toggle in UI.
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(preference: ThemePreference) {
  const root = document.documentElement
  root.setAttribute('data-theme', preference)
  root.style.colorScheme = preference

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', preference === 'dark' ? '#0c0e12' : '#e8e6e2')
  }
}

export function storeTheme(preference: ThemePreference) {
  localStorage.setItem(STORAGE_KEY, preference)
  applyTheme(preference)
}

export function cycleTheme(current: ThemePreference): ThemePreference {
  return current === 'light' ? 'dark' : 'light'
}

export function resolveIsDark(): boolean {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'dark') return true
  if (attr === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function themeLabel(preference: ThemePreference): string {
  return preference === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
}
