import { useId, useRef, useState, type ReactNode } from 'react'
import { Figures } from '../components/Figures'
import { RichText } from '../components/RichText'
import { Reveal } from '../components/ui/Reveal'
import { experience, splitPoint, type Experience } from '../data/experience'

/** "Data layer: Designed and shipped…" → the label in bold, so a long list of
 *  points can be scanned by topic. Points without a short label are left as is. */
function Point({ text }: { text: string }) {
  const { label, text: rest } = splitPoint(text)
  if (!label) return <RichText text={rest} />
  return (
    <>
      <strong className="work-point-label">{label}:</strong> <RichText text={rest} />
    </>
  )
}

function RowBody({ role }: { role: Experience }) {
  return (
    <>
      {/* The rail: role number, dates, and the role's figures as margin notes. */}
      <div className="work-rail">
        <div className="work-id">
          <div className="work-num">{role.n}</div>
          <div className="work-meta">
            {role.meta.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </div>
        {role.stats ? <Figures stats={role.stats} variant="margin" className="work-figures" /> : null}
      </div>
      <div className="work-body">
        <div className="work-kicker">{role.kicker}</div>
        <h3 className="work-title">{role.title}</h3>
        <p className="work-summary">
          <RichText text={role.summary} />
        </p>
        <RolePoints points={role.points} />
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

/** How many points a role shows before "Show more". Four is enough to read
 *  the role at a glance; the rest are one tap away. */
const VISIBLE_POINTS = 4

/** The role's points: the first four always, the rest behind a toggle. The
 *  extra points open in place (height animates; reduced motion just shows
 *  them), stay out of the tab order while closed, and closing scrolls the
 *  toggle back into view so the reader doesn't lose their place. */
function RolePoints({ points }: { points: string[] }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const shown = points.slice(0, VISIBLE_POINTS)
  const extra = points.slice(VISIBLE_POINTS)

  const list = (items: string[]) =>
    items.map((point) => (
      <div className="work-point" key={point}>
        <span>
          <Point text={point} />
        </span>
      </div>
    ))

  const toggle = () => {
    const closing = open
    setOpen(!open)
    if (closing) {
      requestAnimationFrame(() => {
        const btn = toggleRef.current
        if (!btn) return
        const top = btn.getBoundingClientRect().top
        if (top < 80) {
          if (window.__lenis) window.__lenis.scrollTo(btn, { offset: -window.innerHeight / 3 })
          else btn.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
      })
    }
  }

  return (
    <div className="work-points-wrap">
      <div className="work-points">{list(shown)}</div>
      {extra.length ? (
        <>
          <div id={id} className={`work-more${open ? ' is-open' : ''}`} inert={!open}>
            <div className="work-more-inner">
              <div className="work-points">{list(extra)}</div>
            </div>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="work-more-toggle"
            aria-expanded={open}
            aria-controls={id}
            onClick={toggle}
          >
            {open ? 'Show less' : `Show ${extra.length} more`}
            <svg className="work-more-chevron" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      ) : null}
    </div>
  )
}

/** A row with a link is clickable everywhere through a cover link laid over
 *  it. Links and buttons inside the row (the PR figure, "Show more") sit
 *  above the cover, so they work on their own: links can't nest. */
function WorkRow({ role }: { role: Experience }): ReactNode {
  return (
    <article className={`work-row${role.href ? ' work-row--link' : ''}`}>
      {role.href ? (
        <a
          className="work-row-cover"
          href={role.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${role.kicker.split(' · ')[0]} (opens in a new tab)`}
        />
      ) : null}
      <RowBody role={role} />
      {role.href ? (
        <span className="work-row-arrow" aria-hidden="true">
          ↗
        </span>
      ) : null}
    </article>
  )
}

export function WorkSection() {
  return (
    <section id="experience" className="section section--alt">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <h2 className="section-title section-title--marked">
                <span className="section-mark" aria-hidden="true">
                  選
                </span>
                Experience
              </h2>
            </div>
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
