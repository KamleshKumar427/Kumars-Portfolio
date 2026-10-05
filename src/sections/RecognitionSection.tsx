import { Reveal } from '../components/ui/Reveal'
import { honours } from '../data/recognition'

/**
 * Recognition and volunteering — previously a single line in Education. The figures carry this section, so they get chips
 * rather than being buried mid-sentence.
 */
export function RecognitionSection() {
  return (
    <section id="recognition" className="section section--alt">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="section-kicker">誉 — Recognition</div>
              <h2 className="section-title">Chosen, and trusted to lead</h2>
            </div>
          </div>
        </Reveal>

        <Reveal stagger>
          {honours.map((honour) => (
            <article className="honour" key={honour.title}>
              <div className="honour-aside">
                <div className="honour-kind">{honour.kind}</div>
                <div className="honour-period">{honour.period}</div>
              </div>

              <div className="honour-body">
                <h3 className="honour-title">{honour.title}</h3>
                <div className="honour-org">{honour.org}</div>
                <p className="honour-summary">{honour.summary}</p>

                <ul className="stat-row">
                  {honour.stats.map((stat) => (
                    <li className="stat" key={stat.label}>
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </li>
                  ))}
                </ul>

                <div className="work-points">
                  {honour.points.map((point) => (
                    <div className="work-point" key={point}>
                      {point}
                    </div>
                  ))}
                </div>

                {honour.links ? (
                  <div className="proof-links">
                    {honour.links.map((link) => (
                      <a
                        className="proof-link"
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </Reveal>

      </div>
    </section>
  )
}
