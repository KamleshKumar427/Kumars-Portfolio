import { useTheme } from '../hooks/useTheme'

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M7 1.1v1.4M7 11.5v1.4M1.1 7h1.4M11.5 7h1.4M2.75 2.75l.99.99M10.26 10.26l.99.99M2.75 11.25l.99-.99M10.26 3.74l.99-.99"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M11.2 8.4A4.6 4.6 0 0 1 5.6 2.8 4.6 4.6 0 1 0 11.2 8.4Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ThemeToggle() {
  const { isDark, label, toggle } = useTheme()

  return (
    <button
      type="button"
      className={`theme-switch ${isDark ? 'is-dark' : 'is-light'}`}
      onClick={toggle}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      <span className="theme-switch-track">
        <span className="theme-switch-icon theme-switch-icon--sun">
          <SunIcon />
        </span>
        <span className="theme-switch-thumb" />
        <span className="theme-switch-icon theme-switch-icon--moon">
          <MoonIcon />
        </span>
      </span>
    </button>
  )
}
