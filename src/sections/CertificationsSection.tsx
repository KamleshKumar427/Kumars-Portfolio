import { SkillIcon } from '../components/SkillIcon'
import { Reveal } from '../components/ui/Reveal'
import { credentials } from '../data/credentials'

/**
 * Certifications, as a section of their own (they used to be a sub-list at the
 * foot of Recognition). Cards share the stat tiles' surface so everything on
 * the page that is "evidence" looks like the same kind of object.
 */
export function CertificationsSection() {
  return (
    <section id="certifications" className="section">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="section-kicker">証 — Certifications</div>
              <h2 className="section-title">Certified courses</h2>
            </div>
          </div>
        </Reveal>

        <Reveal stagger className="cert-grid">
          {credentials.map((cert) => (
            <article className="cert" key={cert.title}>
              {cert.icon ? (
                <div className="cert-mark">
                  <SkillIcon name={cert.icon} />
                </div>
              ) : null}
              <div className="cert-body">
                <div className="cert-head">
                  <h3 className="cert-title">{cert.title}</h3>
                  <span className="cert-year">{cert.year}</span>
                </div>
                <div className="cert-issuer">{cert.issuer}</div>
                <p className="cert-detail">{cert.detail}</p>
                {cert.href ? (
                  <a className="proof-link cert-link" href={cert.href} target="_blank" rel="noopener noreferrer">
                    {cert.linkLabel ?? 'Certificate'} ↗
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
