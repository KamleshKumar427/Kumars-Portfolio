import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../components/ui/Reveal'
import { projectsByCategory, type Project, type ProjectCategory } from '../data/projects'
import { writings, type Writing } from '../data/writings'
import { Lightbox, type LightboxMedia } from '../components/Lightbox'

type LabTab = ProjectCategory | 'WRITING'

/** Steps through a card's pictures. With a mouse it plays while the pointer
 *  is over the card and returns to the first picture when it leaves. On touch
 *  screens (no hover) it plays on its own while the card is on screen. With
 *  reduced motion it never moves: the first picture stays. */
function useSlideshow(count: number) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (count < 2) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(hover: none)').matches
    if (reduced || !touch || !ref.current) return
    const io = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.6 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [count])

  useEffect(() => {
    if (!playing || count < 2) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), 2200)
    return () => window.clearInterval(id)
  }, [playing, count])

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setIndex(1)
    setPlaying(true)
  }
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    setPlaying(false)
    setIndex(0)
  }
  return { index, ref, onPointerEnter, onPointerLeave }
}

function LabCardMedia({ project }: { project: Project }) {
  const images = project.images ?? []
  const { index, ref, onPointerEnter, onPointerLeave } = useSlideshow(images.length)

  if (!images.length) {
    return (
      <div className="lab-card-media" aria-hidden="true">
        <span>{project.tech[0]} →</span>
      </div>
    )
  }

  if (images.length === 1) {
    const [image] = images
    return (
      <div className="lab-card-media lab-card-media--photos">
        <img
          className={`lab-card-photo${image.fit === 'contain' ? ' lab-card-photo--contain' : ''}`}
          src={image.src}
          alt={image.alt}
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="lab-card-media lab-card-media--slider"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="lab-card-track" style={{ transform: `translateX(${-index * 100}%)` }}>
        {images.map((image, i) => (
          <img
            key={image.src}
            className={`lab-card-photo${image.fit === 'contain' ? ' lab-card-photo--contain' : ''}`}
            src={image.src}
            alt={`${image.alt} (${i + 1} of ${images.length})`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
      <div className="lab-card-slider-ui" aria-hidden="true">
        <span className="lab-card-slider-hint">hover to browse</span>
        <div className="lab-card-slider-dots">
          {images.map((image, i) => (
            <span key={image.src} className={`lab-card-slider-dot${i === index ? ' is-active' : ''}`} />
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
      {project.context ? <div className="lab-card-context">{project.context}</div> : null}
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

/** Tab order: Software leads. */
const TABS: { id: LabTab; label: string }[] = [
  { id: 'GENERAL', label: 'Software · ソフト' },
  { id: 'AI', label: 'AI/LLM · 機械' },
  { id: 'WRITING', label: 'Writing · 論文' },
]
/** How long each tab stays before the next one comes in. */
const DWELL_MS = 5000

/**
 * The tabs move on by themselves so a visitor who never touches them still
 * sees all three. A bar inside the active tab fills over DWELL_MS and the
 * next tab comes in when it's full. It waits whenever someone could be
 * reading or deciding: while the section is mostly off screen, while the
 * pointer is over the projects or the tabs, while the browser tab is hidden.
 * Hovering a tab opens it; clicking or using the keyboard on a tab is a
 * choice, so the tabs stop moving on their own after that. Reduced motion:
 * no auto-advance at all.
 */
function useTabAutoplay(
  sectionRef: React.RefObject<HTMLElement | null>,
  tab: LabTab,
  setTab: (t: LabTab) => void,
) {
  const [inView, setInView] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    const el = sectionRef.current
    const io = el ? new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 }) : null
    if (el && io) io.observe(el)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      io?.disconnect()
    }
  }, [sectionRef])

  const enabled = !stopped && !reduced
  const running = enabled && inView && !hovering && visible
  const next = () => {
    const i = TABS.findIndex((t) => t.id === tab)
    setTab(TABS[(i + 1) % TABS.length].id)
  }
  const hold = {
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === 'mouse' && setHovering(true),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === 'mouse' && setHovering(false),
  }
  return { enabled, running, next, hold, stop: () => setStopped(true) }
}

export function LabSection() {
  const [tab, setTab] = useState<LabTab>('GENERAL')
  const [lightbox, setLightbox] = useState<LightboxMedia | null>(null)
  const list = tab === 'WRITING' ? [] : projectsByCategory(tab)
  const [featured, ...rest] = list
  const sectionRef = useRef<HTMLElement>(null)
  const auto = useTabAutoplay(sectionRef, tab, setTab)
  const hoverTimer = useRef<number | undefined>(undefined)

  // Keep the panel at the tallest height it has shown, so the page below
  // doesn't jump each time the tabs change on their own.
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelMin, setPanelMin] = useState(0)
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setPanelMin((m) => Math.max(m, el.offsetHeight)))
    ro.observe(el)
    const onResize = () => setPanelMin(0)
    window.addEventListener('resize', onResize)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section id="lab" className="section section--alt" ref={sectionRef}>
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="section-kicker">研 — Projects</div>
              <h2 className="section-title">Personal projects</h2>
            </div>
            <ul className="section-lead lab-domains" aria-label="Domains">
              <li>Software engineering</li>
              <li>LLM fine-tuning</li>
              <li>AI agents</li>
              <li>AI/ML model pipelines &amp; evaluation</li>
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div className="lab-toggle" role="tablist" aria-label="Project category" {...auto.hold}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`lab-toggle-btn ${tab === t.id ? 'is-active' : ''}`}
                onClick={() => {
                  setTab(t.id)
                  auto.stop()
                }}
                onKeyDown={() => auto.stop()}
                onPointerEnter={(e) => {
                  if (e.pointerType !== 'mouse') return
                  window.clearTimeout(hoverTimer.current)
                  hoverTimer.current = window.setTimeout(() => setTab(t.id), 160)
                }}
                onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
              >
                {t.label}
                {tab === t.id && auto.enabled ? (
                  <span
                    key={t.id}
                    className="lab-tab-progress"
                    aria-hidden="true"
                    style={{
                      animationDuration: `${DWELL_MS}ms`,
                      animationPlayState: auto.running ? 'running' : 'paused',
                    }}
                    onAnimationEnd={auto.next}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </Reveal>

        <div ref={panelRef} style={panelMin ? { minHeight: panelMin } : undefined} {...auto.hold}>
        {tab === 'WRITING' ? (
          <Reveal>
            <div key="writing" className="writing-grid lab-panel-in" style={{ marginTop: 'clamp(28px, 4vw, 44px)' }}>
              {writings.map((writing) => (
                <WritingCard key={writing.pdf} writing={writing} onOpen={setLightbox} />
              ))}
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div key={tab} className="lab-grid lab-panel-in" style={{ marginTop: 'clamp(28px, 4vw, 44px)' }}>
              {featured ? <FeaturedCard project={featured} /> : null}
              {rest.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </Reveal>
        )}
        </div>
      </div>

      <Lightbox media={lightbox} onClose={() => setLightbox(null)} />
    </section>
  )
}
