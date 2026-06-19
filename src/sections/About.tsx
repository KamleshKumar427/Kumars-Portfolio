import { Section } from '../components/Section'
import { profile } from '../data/profile'
import { education } from '../data/education'

export function About() {
  return (
    <Section
      id="about"
      logKey="PROFILE"
      title="Background and education"
      subtitle="Systems work across fintech production paths and open-source database internals."
    >
      <div className="profile-grid">
        <div className="profile-copy">
          <p className="copy-lead">{profile.summary}</p>
          <p className="copy-body">
            I tend toward problems where the cost of downtime or inconsistency is high: payment
            routing, PCI-compliant APIs, graph storage engines, and query paths that need to hold
            under load.
          </p>
        </div>

        <div className="edu-list">
          {education.map((edu) => (
            <article key={edu.school} className="edu-record">
              <div className="edu-record-head">
                <h3>{edu.degree}</h3>
                {edu.highlight && <span className="edu-record-badge">{edu.highlight}</span>}
              </div>
              <p className="edu-record-meta">
                {edu.school} — {edu.location}
              </p>
              <p className="edu-record-period">{edu.period}</p>
              <ul className="edu-record-details">
                {edu.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}
