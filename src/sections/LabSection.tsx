import { useState } from 'react'
import { Reveal } from '../components/ui/Reveal'
import { projectsByCategory, type Project, type ProjectCategory } from '../data/projects'

function LabCardMedia({ project }: { project: Project }) {
  const images = project.images

  if (!images?.length) {
    return (
      <div className="lab-card-media" aria-hidden="true">
        <span>{project.tech[0]} →</span>
      </div>
    )
  }

  const alt = `${project.title} screenshot`

  if (images.length === 1) {
    return (
      <div className="lab-card-media lab-card-media--photos">
        <img className="lab-card-photo" src={images[0]} alt={alt} loading="lazy" />
      </div>
    )
  }

  return (
    <div
      className="lab-card-media lab-card-media--slider"
      aria-label={`${project.title} previews — hover to browse`}
    >
      {images.map((src, index) => (
        <img
          key={src}
          className="lab-card-photo"
          src={src}
          alt={`${alt} ${index + 1} of ${images.length}`}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
      <div className="lab-card-slider-ui" aria-hidden="true">
        <span className="lab-card-slider-hint">hover to browse</span>
        <div className="lab-card-slider-dots">
          {images.map((src, index) => (
            <span key={src} className={`lab-card-slider-dot ${index === 0 ? 'is-active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

function FeaturedCard({ project }: { project: Project }) {
  const inner = (
    <>
      <LabCardMedia project={project} />
      <div className="lab-badges">
        <span className="lab-badge">Featured</span>
        <span className="lab-badge lab-badge--muted">
          {project.category === 'AI' ? 'Machine learning' : 'Systems'}
        </span>
      </div>
      <h3 className="lab-card-title">{project.title}</h3>
      <p className="lab-card-desc">{project.description}</p>
      <ul className="tags">
        {project.tech.map((t) => (
          <li className="tag" key={t}>
            {t}
          </li>
        ))}
      </ul>
    </>
  )
  return project.github ? (
    <a className="lab-card lab-card--featured" href={project.github} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <article className="lab-card lab-card--featured">{inner}</article>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const inner = (
    <>
      {project.images?.length ? <LabCardMedia project={project} /> : null}
      <div className="lab-card-row">
        <h3 className="lab-card-title">{project.title}</h3>
        {project.github ? <span className="lab-card-arrow">↗</span> : null}
      </div>
      <p className="lab-card-desc">{project.description}</p>
      <ul className="tags">
        {project.tech.map((t) => (
          <li className="tag" key={t}>
            {t}
          </li>
        ))}
      </ul>
    </>
  )
  return project.github ? (
    <a className="lab-card" href={project.github} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <article className="lab-card">{inner}</article>
  )
}

export function LabSection() {
  const [category, setCategory] = useState<ProjectCategory>('AI')
  const list = projectsByCategory(category)
  const [featured, ...rest] = list

  return (
    <section id="lab" className="section section--alt">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="section-kicker">研 — The Lab</div>
              <h2 className="section-title">Studies &amp; experiments</h2>
            </div>
            <p className="section-lead">
              Things I built because I wanted to understand them — machine learning, search, computer
              vision, low-level systems.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="lab-toggle" role="tablist" aria-label="Project category">
            {(['AI', 'GENERAL'] as ProjectCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={category === cat}
                className={`lab-toggle-btn ${category === cat ? 'is-active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat === 'AI' ? 'AI · 機械' : 'General · 一般'}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="lab-grid" style={{ marginTop: 'clamp(28px, 4vw, 44px)' }}>
            {featured ? <FeaturedCard project={featured} /> : null}
            {rest.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
