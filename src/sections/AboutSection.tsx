import { Reveal } from '../components/ui/Reveal'
import { profile } from '../data/profile'

/**
 * The one place on the site that speaks in the first person. It says little on
 * purpose: everything below it — roles, degrees, projects — is the evidence,
 * and repeating that here only gave people something to skim past.
 */
export function AboutSection() {
  const { about, glance } = profile

  return (
    <section id="about" className="section">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="section-kicker">私</div>
              <h2 className="section-title">About</h2>
            </div>
          </div>
        </Reveal>

        <div className="about-grid">
          <Reveal>
            <blockquote className="about-quote">{about}</blockquote>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="glance">
              {glance.map((row) => (
                <div className="glance-row" key={row.label}>
                  <dt className="glance-label">{row.label}</dt>
                  <dd className="glance-value">
                    {'led' in row && row.led ? (
                      <span className="status-led" aria-hidden="true" />
                    ) : null}
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
