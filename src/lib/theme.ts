export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme'

export function getStoredTheme(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

export function applyTheme(preference: ThemePreference) {
  const root = document.documentElement

  if (preference === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', preference)
  }

  const resolved =
    preference === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : preference

  root.style.colorScheme = resolved

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', resolved === 'dark' ? '#0c0e12' : '#e8e6e2')
  }
}

export function storeTheme(preference: ThemePreference) {
  localStorage.setItem(STORAGE_KEY, preference)
  applyTheme(preference)
}

export function cycleTheme(current: ThemePreference): ThemePreference {
  if (current === 'system') return 'light'
  if (current === 'light') return 'dark'
  return 'system'
}

export function resolveIsDark(): boolean {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'dark') return true
  if (attr === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function themeLabel(preference: ThemePreference): string {
  if (preference === 'system') return 'Use system theme'
  if (preference === 'light') return 'Light theme'
  return 'Dark theme'
}
