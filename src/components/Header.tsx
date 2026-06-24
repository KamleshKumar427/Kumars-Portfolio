import { useEffect, useState } from 'react'
import { CvMenu } from './CvMenu'
import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#lab', label: 'Lab' },
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
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-inner">
        <a className="nav-brand" href="#top" aria-label="Kamlesh Kumar — top" onClick={() => setOpen(false)}>
          <span className="nav-seal" aria-hidden="true">
            墨
          </span>
          <span className="nav-name">
            Kamlesh
            <br />
            Kumar
          </span>
        </a>

        <div className="nav-end">
          <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Sections">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="nav-link" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
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
