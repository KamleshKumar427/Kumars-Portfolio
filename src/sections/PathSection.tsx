import { Reveal } from '../components/ui/Reveal'
import { education, recognition } from '../data/education'
import { skills } from '../data/skills'

export function PathSection() {
  return (
    <section id="education" className="section">
      <div className="section-inner">
        <div className="path-grid">
          <Reveal>
            <div className="section-kicker">道 — Education</div>
            <h2 className="path-col-title">Degrees &amp; recognition</h2>
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
                  {edu.grade ? <span className="edu-grade">{edu.grade}</span> : null}
                </div>
                {edu.note ? <p className="edu-note">{edu.note}</p> : null}
              </div>
            ))}
            <p className="path-recognition">{recognition}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="skills-label">Tools &amp; Materials</div>
            <div className="skills">
              {skills.map((group) => (
                <div key={group.label}>
                  <div className="skill-label">{group.label}</div>
                  <ul className="tags">
                    {group.items.map((item) => (
                      <li className="chip" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
