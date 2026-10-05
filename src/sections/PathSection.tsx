import { Reveal } from '../components/ui/Reveal'
import { education } from '../data/education'

export function PathSection() {
  return (
    <section id="education" className="section">
      <div className="section-inner">
        <Reveal>
          <div className="section-kicker">道 — Education</div>
          <h2 className="path-col-title">Degrees &amp; recognition</h2>
        </Reveal>

        <Reveal stagger>
          {education.map((edu) => (
            <div className="edu-item" key={edu.degree}>
              <div className="edu-head">
                <h3 className="edu-degree">{edu.degree}</h3>
                <span className="edu-period">{edu.period}</span>
              </div>

              <div className="edu-school">
                {edu.logo ? (
                  <img
                    className={`edu-logo ${edu.logoTheme === 'mono' ? 'edu-logo--mono' : ''}`}
                    src={edu.logo}
                    alt=""
                    loading="lazy"
                  />
                ) : null}
                <span>{edu.school}</span>
              </div>

              {edu.focus ? <p className="edu-focus">{edu.focus}</p> : null}

              {edu.points ? (
                <div className="work-points edu-points">
                  {edu.points.map((point) => (
                    <div className="work-point" key={point}>
                      {point}
                    </div>
                  ))}
                </div>
              ) : null}

              {edu.stats ? (
                <ul className="stat-row">
                  {edu.stats.map((stat) => (
                    <li className="stat" key={stat.label}>
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {edu.note ? <p className="edu-note">{edu.note}</p> : null}

              {edu.courses ? (
                <ul className="tags edu-courses">
                  {edu.courses.map((course) => (
                    <li className="chip" key={course}>
                      {course}
                    </li>
                  ))}
                </ul>
              ) : null}

              {edu.links ? (
                <div className="proof-links">
                  {edu.links.map((link) => (
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
          ))}
        </Reveal>

      </div>
    </section>
  )
}
