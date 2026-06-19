import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { tocChapters } from '../data/chapters'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="header-id" onClick={() => setMenuOpen(false)}>
          <span className="header-id-name">kkumar</span>
          <span className="header-id-sep">@</span>
          <span className="header-id-host">helsinki.fi</span>
        </Link>

        <p className="header-status" aria-label="Current status">
          <span className="status-led" />
          the dossier · 5 chapters
        </p>

        <div className="header-end">
          <nav className={`header-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Chapters">
            {tocChapters.map((chapter) => (
              <NavLink
                key={chapter.n}
                to={chapter.route}
                className="header-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="header-nav-n">{chapter.n}</span>
                {chapter.slug}
              </NavLink>
            ))}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            className="header-menu"
            aria-expanded={menuOpen}
            aria-label="Open navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
