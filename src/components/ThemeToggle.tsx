import { useTheme } from '../hooks/useTheme'
import type { ThemePreference } from '../lib/theme'

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  if (preference === 'light') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M8 1.25v1.5M8 13.25v1.5M1.25 8h1.5M13.25 8h1.5M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (preference === 'dark') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M13.2 9.4A5.25 5.25 0 0 1 6.6 2.8 5.25 5.25 0 1 0 13.2 9.4Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3.5" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5.5 13h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

export function ThemeToggle() {
  const { preference, label, toggle } = useTheme()

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <ThemeIcon preference={preference} />
      <span className="theme-toggle-label">{preference}</span>
    </button>
  )
}
