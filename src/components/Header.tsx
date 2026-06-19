import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { scrollToId } from '@/lib/scroll'

const sectionItems = [
  { id: 'about', label: 'profile' },
  { id: 'projects', label: 'projects' },
  { id: 'skills', label: 'stack' },
  { id: 'contact', label: 'contact' },
]

const routeItems = [
  { to: '/experience', label: 'experience' },
  { to: '/startup', label: 'startup' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSection = (id: string) => {
    setMenuOpen(false)
    if (location.pathname === '/') {
      scrollToId(id)
    } else {
      navigate(`/#${id}`)
    }
  }

  const goHome = () => {
    setMenuOpen(false)
    if (location.pathname === '/') {
      scrollToId('hero', 0)
    } else {
      navigate('/')
    }
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <button type="button" className="header-id" onClick={goHome}>
          <span className="header-id-name">kkumar</span>
          <span className="header-id-sep">@</span>
          <span className="header-id-host">helsinki.fi</span>
        </button>

        <p className="header-status" aria-label="Current status">
          <span className="status-led" />
          MSc CS · open to roles
        </p>

        <div className="header-end">
          <nav className={`header-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Site navigation">
            {sectionItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="header-nav-link"
                onClick={() => goToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
            {routeItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="header-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
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
