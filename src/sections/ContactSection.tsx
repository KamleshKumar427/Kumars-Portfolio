import { Reveal } from '../components/ui/Reveal'
import { CvMenu } from '../components/CvMenu'
import { profile } from '../data/profile'

export function ContactSection() {
  return (
    <section id="contact" className="section">
      <div className="contact-inner">
        <Reveal>
          <div className="section-kicker">結 — Contact</div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="contact-title">
            Open to roles where <em>ownership</em> matters.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="contact-actions">
            <a className="btn btn--seal" href={`mailto:${profile.email}`}>
              Send email
            </a>
            <a className="btn btn--ghost" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a className="btn btn--ghost" href={profile.links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <CvMenu variant="button" />
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="contact-meta">
            {profile.location} · {profile.email}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
