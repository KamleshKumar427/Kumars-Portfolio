import { RouteHero } from '../components/RouteHero'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { GlassPanel } from '../components/ui/GlassPanel'
import { Tags } from '../components/ui/Tags'
import { ChapterPager } from '../components/ChapterPager'
import { education } from '../data/education'
import { skills, certifications } from '../data/skills'
import { profile } from '../data/profile'

/**
 * Chapter 04 · Profile (/about) — the person + the proof: education, the skills
 * matrix, certifications, and how to get in touch. The HR-facing close.
 */
export function AboutPage() {
  return (
    <>
      <RouteHero
        eyebrow="04 · profile"
        title={
          <>
            The <span className="hero-name-family">person</span>
          </>
        }
        lead="MSc Computer Science at the University of Helsinki (5/5), a BSc from NUST, a skills matrix, certifications — and how to get in touch."
      />

      <Section>
        <Reveal className="mn-lede">
          <Eyebrow>04 · profile — education</Eyebrow>
          <p className="mn-lede-statement">
            MSc Computer Science at the <em>University of Helsinki</em> (5/5), built on a CS
            degree from NUST in Islamabad.
          </p>
        </Reveal>

        <div className="mn-roles">
          {education.map((edu) => (
            <Reveal key={edu.school}>
              <article className="mn-role mn-glass">
                <header className="mn-role-head">
                  <div className="mn-role-headline">
                    <h3 className="mn-role-title">{edu.degree}</h3>
                    <p className="mn-role-org">
                      {edu.school} · {edu.location}
                    </p>
                  </div>
                  <div className="mn-role-meta">
                    <span className="mn-role-period">{edu.period}</span>
                    {edu.highlight && <span className="mn-role-type">{edu.highlight}</span>}
                  </div>
                </header>
                <ul className="mn-role-notes">
                  {edu.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mn-subhead">
          <Eyebrow>04 · profile — skills</Eyebrow>
          <h3 className="mn-subhead-title">The toolkit</h3>
        </Reveal>

        <Reveal stagger className="mn-matrix">
          {skills.map((group) => (
            <div key={group.category} className="mn-matrix-group">
              <span className="mn-matrix-cat">{group.category}</span>
              <Tags items={group.items} />
            </div>
          ))}
        </Reveal>

        <Reveal className="mn-subhead">
          <Eyebrow>04 · profile — certifications</Eyebrow>
          <h3 className="mn-subhead-title">Certifications</h3>
        </Reveal>

        <Reveal stagger className="mn-cards">
          {certifications.map((cert) => (
            <article key={cert.title} className="mn-card mn-glass">
              <div className="mn-card-head">
                <h4 className="mn-card-title">{cert.title}</h4>
                <span className="mn-card-year">{cert.year}</span>
              </div>
              <p className="mn-card-sub">{cert.issuer}</p>
              <p className="mn-card-desc">{cert.topics}</p>
            </article>
          ))}
        </Reveal>

        <Reveal className="mn-subhead">
          <Eyebrow>04 · profile — contact</Eyebrow>
        </Reveal>

        <Reveal>
          <GlassPanel className="mn-cta">
            <h2 className="mn-cta-title">
              Open to roles where being <em>wrong is expensive</em>.
            </h2>
            <p className="mn-cta-meta">
              {profile.location} · {profile.email}
            </p>
            <div className="mn-cta-actions">
              <a href={`mailto:${profile.email}`} className="btn btn-primary">
                Send email
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary">
                LinkedIn
              </a>
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn btn-secondary">
                GitHub
              </a>
            </div>
          </GlassPanel>
        </Reveal>
      </Section>

      <ChapterPager from="/about" />
    </>
  )
}
