import { RouteHero } from '../components/RouteHero'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { RoleRecord } from '../components/RoleRecord'
import { ChapterPager } from '../components/ChapterPager'
import { experience, volunteer } from '../data/experience'

const ventureRoles = experience.filter((role) => role.theater === 'venture')

const metrics = [
  { value: '1,600+', label: 'users' },
  { value: '250+', label: 'companies' },
  { value: 'sole', label: 'engineer' },
  { value: '~10x', label: 'ai-native delivery' },
]

/**
 * Chapter 02 · Venture (/startup) — the ownership story: XSTRYV, a live product
 * built and run end to end by one engineer, plus the founder community around it.
 */
export function StartupPage() {
  return (
    <>
      <RouteHero
        eyebrow="02 · venture"
        title={
          <>
            Built <span className="hero-name-family">solo</span>
          </>
        }
        lead="XSTRYV — a live recruitment platform of 1,600+ users and 250+ companies, run end to end by one engineer. Plus the founder community around it."
      />

      <Section>
        <Reveal className="mn-lede">
          <Eyebrow>02 · venture — the brief</Eyebrow>
          <p className="mn-lede-statement">
            One engineer, a live product: <em>1,600+ users and 250+ companies</em>, owned end to
            end — features, production fixes, deployments, and the product calls in between.
          </p>
        </Reveal>

        <Reveal stagger className="mn-metrics">
          {metrics.map((metric) => (
            <div key={metric.label} className="mn-metric">
              <span className="mn-metric-value">{metric.value}</span>
              <span className="mn-metric-label">{metric.label}</span>
            </div>
          ))}
        </Reveal>

        <div className="mn-roles">
          {ventureRoles.map((role) => (
            <Reveal key={role.company}>
              <RoleRecord role={role} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mn-subhead">
          <Eyebrow>02 · venture — founder community</Eyebrow>
          <h3 className="mn-subhead-title">Around the work</h3>
        </Reveal>

        <div className="mn-roles">
          {volunteer.map((v) => (
            <Reveal key={v.org}>
              <article className="mn-role mn-glass">
                <header className="mn-role-head">
                  <div className="mn-role-headline">
                    <h3 className="mn-role-title">{v.role}</h3>
                    <p className="mn-role-org">
                      {v.link ? (
                        <a href={v.link} target="_blank" rel="noreferrer">
                          {v.org}
                        </a>
                      ) : (
                        v.org
                      )}
                    </p>
                  </div>
                  <div className="mn-role-meta">
                    <span className="mn-role-period">{v.period}</span>
                  </div>
                </header>
                <ul className="mn-role-notes">
                  <li>{v.description}</li>
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <ChapterPager from="/startup" />
    </>
  )
}
