import { useState } from 'react'
import { Reveal } from '../components/ui/Reveal'
import { testimonials, type Testimonial } from '../data/testimonials'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function Avatar({ person }: { person: Testimonial }) {
  const [failed, setFailed] = useState(false)
  if (person.avatar && !failed) {
    return (
      <img
        className="tm-avatar"
        src={person.avatar}
        alt={person.name}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    )
  }
  return (
    <span className="tm-avatar tm-avatar--initials" aria-hidden="true">
      {initials(person.name)}
    </span>
  )
}

function Card({ person, ariaHidden }: { person: Testimonial; ariaHidden?: boolean }) {
  return (
    <figure className="tm-card" aria-hidden={ariaHidden || undefined}>
      <span className="tm-glyph" aria-hidden="true">
        &rdquo;
      </span>
      <header className="tm-head">
        <Avatar person={person} />
        <div className="tm-id">
          <div className="tm-name">{person.name}</div>
          <div className="tm-title">{person.title}</div>
        </div>
      </header>
      <blockquote className="tm-quote">{person.quote}</blockquote>
    </figure>
  )
}

export function TestimonialsSection() {
  if (testimonials.length === 0) return null

  // Duplicate the list so the marquee can translate -50% and loop seamlessly.
  const loop = [...testimonials, ...testimonials]

  return (
    <section id="testimonials" className="section section--alt tm-section">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="section-kicker">声 — In their words</div>
              <h2 className="section-title">People I’ve worked with</h2>
            </div>
            <p className="section-lead">
              Managers, mentors, and teammates on what it’s like to build alongside me.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="tm-marquee">
          <div className="tm-track">
            {loop.map((person, i) => (
              <Card key={`${person.name}-${i}`} person={person} ariaHidden={i >= testimonials.length} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
