import { profile } from '../data/profile'

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} Kamlesh Kumar · 墨と水</span>
        <div className="footer-links">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
      </div>
    </footer>
  )
}
