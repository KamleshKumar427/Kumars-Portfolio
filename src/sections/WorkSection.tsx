import type { ReactNode } from 'react'
import { Reveal } from '../components/ui/Reveal'
import { experience, type Experience } from '../data/experience'

function RowBody({ role }: { role: Experience }) {
  return (
    <>
      <div>
        <div className="work-num">{role.n}</div>
        <div className="work-meta">
          {role.meta.map((line, i) => (
            <span key={line}>
              {line}
              {i < role.meta.length - 1 ? <br /> : null}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="work-kicker">{role.kicker}</div>
        <h3 className="work-title">{role.title}</h3>
        <p className="work-summary">{role.summary}</p>
        <div className="work-points">
          {role.points.map((point) => (
            <div className="work-point" key={point}>
              {point}
            </div>
          ))}
        </div>
        <ul className="tags">
          {role.tech.map((t) => (
            <li className="tag" key={t}>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function WorkRow({ role }: { role: Experience }): ReactNode {
  if (role.href) {
    return (
      <a className="work-row" href={role.href} target="_blank" rel="noopener noreferrer">
        <RowBody role={role} />
      </a>
    )
  }
  return (
    <div className="work-row">
      <RowBody role={role} />
    </div>
  )
}

export function WorkSection() {
  return (
    <section id="experience" className="section section--alt">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="section-kicker">選 — Experience</div>
              <h2 className="section-title">Experience in production</h2>
            </div>
            <p className="section-lead">
              Three teams, three scales of consequence — a fintech gateway, a solo startup, and
              open-source database internals.
            </p>
          </div>
        </Reveal>

        <Reveal stagger>
          {experience.map((role) => (
            <WorkRow key={role.n} role={role} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
