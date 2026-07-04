import { useState } from 'react'
import { Reveal } from '../components/ui/Reveal'
import { projectsByCategory, type Project, type ProjectCategory } from '../data/projects'
import { writings, type Writing } from '../data/writings'
import { Lightbox, type LightboxMedia } from '../components/Lightbox'

type LabTab = ProjectCategory | 'WRITING'

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

function WritingCard({
  writing,
  onOpen,
}: {
  writing: Writing
  onOpen: (media: LightboxMedia) => void
}) {
  return (
    <button
      type="button"
      className="writing-card"
      aria-label={`View “${writing.title}” full screen`}
      onClick={() =>
        onOpen({ src: writing.pdf, alt: writing.title, caption: writing.meta, aspect: writing.aspect })
      }
    >
      <span className="writing-card-preview">
        <iframe
          className="writing-card-pdf"
          src={`${writing.pdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          title={writing.title}
          loading="lazy"
          tabIndex={-1}
        />
        <span className="writing-card-cue" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      <span className="writing-card-body">
        <span className="writing-card-meta">{writing.meta}</span>
        <span className="writing-card-title">{writing.title}</span>
        <span className="writing-card-desc">{writing.description}</span>
        <span className="writing-card-action">Read paper →</span>
      </span>
    </button>
  )
}

export function LabSection() {
  const [tab, setTab] = useState<LabTab>('AI')
  const [lightbox, setLightbox] = useState<LightboxMedia | null>(null)
  const list = tab === 'WRITING' ? [] : projectsByCategory(tab)
  const [featured, ...rest] = list

  return (
    <section id="lab" className="section section--alt">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="section-kicker">研 — The Lab</div>
              <h2 className="section-title">Personal projects</h2>
            </div>
            <p className="section-lead">
              Things I built because I wanted to understand them — machine learning, search, computer
              vision, low-level systems.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="lab-toggle" role="tablist" aria-label="Project category">
            {(['AI', 'GENERAL', 'WRITING'] as LabTab[]).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                className={`lab-toggle-btn ${tab === t ? 'is-active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'AI' ? 'AI · 機械' : t === 'GENERAL' ? 'Software · ソフト' : 'Writing · 論文'}
              </button>
            ))}
          </div>
        </Reveal>

        {tab === 'WRITING' ? (
          <Reveal>
            <div className="writing-grid" style={{ marginTop: 'clamp(28px, 4vw, 44px)' }}>
              {writings.map((writing) => (
                <WritingCard key={writing.pdf} writing={writing} onOpen={setLightbox} />
              ))}
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div className="lab-grid" style={{ marginTop: 'clamp(28px, 4vw, 44px)' }}>
              {featured ? <FeaturedCard project={featured} /> : null}
              {rest.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </Reveal>
        )}
      </div>

      <Lightbox media={lightbox} onClose={() => setLightbox(null)} />
    </section>
  )
}
