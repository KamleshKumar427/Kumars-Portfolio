import { profile } from '../data/profile'

/** Persistent dossier colophon at the foot of every page. */
export function SiteFooter() {
  return (
    <footer className="mn-footer">
      <div className="mn-footer-inner mn-container">
        <span className="mn-footer-id">
          {profile.name} · {profile.location}
        </span>
        <nav className="mn-footer-links" aria-label="Elsewhere">
          <a href={`mailto:${profile.email}`}>email</a>
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            github
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
          <a href={profile.links.stackoverflow} target="_blank" rel="noreferrer">
            stackoverflow
          </a>
        </nav>
        <span className="mn-footer-meta">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
