import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CvMenu } from './CvMenu'
import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#lab', label: 'Projects' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-menu-open' : ''}`}>
      <div className="nav-inner">
        {/* Seal only — the name is the h1 right below, so repeating it here
            just doubles it. The seal keeps the link clickable and branded;
            the accessible name moves to aria-label since 墨 is decorative. */}
        <a className="nav-brand" href="#top" aria-label="Back to top" onClick={() => setOpen(false)}>
          <span className="nav-seal" aria-hidden="true">
            墨
          </span>
        </a>

        <div className="nav-end">
          <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Sections">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="nav-link" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <Link to="/startups" className="nav-link nav-link--accent" onClick={() => setOpen(false)}>
              Startups ↗
            </Link>
            <CvMenu />
          </nav>

          <ThemeToggle />

          <button
            type="button"
            className="nav-menu"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
