import { Section } from '../components/Section'
import { certifications, skills } from '../data/skills'

export function Skills() {
  return (
    <Section id="skills" logKey="STACK" title="Languages, platforms, and credentials" raised>
      <div className="stack-grid">
        {skills.map((group) => (
          <div key={group.category} className="stack-group">
            <h3 className="stack-group-label">{group.category}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="creds-block">
        <h3 className="creds-heading">Certifications</h3>
        <div className="creds-list">
          {certifications.map((cert) => (
            <article key={cert.title} className="cred-entry">
              <span className="cred-entry-year">{cert.year}</span>
              <div>
                <h4>{cert.title}</h4>
                <p className="cred-entry-issuer">{cert.issuer}</p>
                <p className="cred-entry-topics">{cert.topics}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}
