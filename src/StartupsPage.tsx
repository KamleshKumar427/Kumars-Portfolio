import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { ImageSlot } from './components/ImageSlot'
import { Lightbox, type LightboxMedia } from './components/Lightbox'
import { Reveal } from './components/ui/Reveal'
import { SiteFooter } from './components/SiteFooter'
import { inkConfig, resolveSwatch } from './hero/fluid/inkConfig'
import { clearInk, useActiveInk } from './hero/fluid/inkSelection'
import { useIsDark } from './hooks/useIsDark'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSeo } from './hooks/useSeo'
import { profile } from './data/profile'
import { splitPoint, xstryv } from './data/experience'

const HeroFluid = lazy(() =>
  import('./hero/fluid/HeroFluid').then((m) => ({ default: m.HeroFluid })),
)

const NAV = [
  { href: '#xstryv', label: 'Startup' },
  { href: '#pathways', label: 'Pathways' },
  { href: '#slush', label: 'Slush' },
]

function StartupNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-menu-open' : ''}`}>
      <div className="nav-inner">
        <Link
          className="nav-brand nav-back"
          to="/"
          aria-label="Back to home"
          onClick={() => setOpen(false)}
        >
          <span className="nav-seal" aria-hidden="true">
            墨
          </span>
          <span className="nav-name">← Home</span>
        </Link>

        <div className="nav-end">
          <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Sections">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle />

          {/* Below 900px .nav-links collapses into a sheet — it needs a trigger,
              same as the main header, or these links become unreachable. */}
          <button
            type="button"
            className="nav-menu"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

// Highlight cards: one per labelled point of the shared XSTRYV entry
// (src/data/experience.ts), so this page and the home page always agree.
const XSTRYV_CARDS = xstryv.points.map((point) => {
  const { label, text } = splitPoint(point)
  return { title: label ?? '', body: text }
})

const PATHWAYS_SPECS = [
  ['Programme', 'Interdisciplinary pre-incubator'],
  ['Duration', 'Four months · in person'],
  ['Host', 'Helsinki Incubators · University of Helsinki'],
]

/** Static assets in public/images/startups/
 *  Each certificate keeps a .jpg of its page beside the .pdf: phones refuse to
 *  render a PDF in a frame and show an "open PDF" button instead, so there they
 *  get the picture. See useInlinePdf. */
const STARTUP_MEDIA = {
  helsinkiIncubators: '/images/startups/helsinki-incubators.jpg',
  pathwaysCertificate: '/images/startups/pathways-certificate.pdf',
  pathwaysCertificateImage: '/images/startups/pathways-certificate.jpg',
  slushCertificate: '/images/startups/slush-certificate.pdf',
  slushCertificateImage: '/images/startups/slush-certificate.jpg',
  slushTeam: '/images/startups/slush-team.jpeg',
  slushFloor: '/images/startups/slush-floor.jpeg',
} as const

const STARTUP_HERO_POINTS: { key: string; content: ReactNode }[] = [
  { key: 'xstryv', content: 'Sole engineer on a live recruitment platform' },
  { key: 'pathways', content: 'Alum of Helsinki’s Pathways pre-incubator' },
  {
    key: 'slush',
    content: (
      <>
        Volunteer at <strong>Slush</strong> — Europe’s largest startup event
      </>
    ),
  },
]

export function StartupsPage() {
  useSeo({
    title: 'Startups — Kamlesh Kumar · Founder-Minded Engineer',
    description:
      'The founder side of Kamlesh Kumar: sole engineer on XSTRYV, a live recruitment platform (1,600+ users, 250+ companies), alum of Helsinki’s Pathways pre-incubator, and Slush volunteer.',
    canonical: 'https://kamleshkumar.eu/startups',
  })
  const isDark = useIsDark()
  const reduced = useReducedMotion()
  const [activeId, setActiveId] = useActiveInk()
  const swatches = inkConfig.swatches.map((s) => resolveSwatch(s, isDark))
  const activeInk = swatches.find((s) => s.id === activeId) ?? swatches[0]
  const [lightbox, setLightbox] = useState<LightboxMedia | null>(null)

  return (
    <>
      <StartupNav />

      <main id="top">
        {/* ░░ HERO BAND ░░ */}
        <section className="startup-hero">
          {reduced ? (
            <div className="hero-fluid is-fallback" aria-hidden="true" />
          ) : (
            <Suspense fallback={<div className="hero-fluid is-fallback" aria-hidden="true" />}>
              <HeroFluid color={activeInk.hex} isDark={isDark} />
            </Suspense>
          )}
          <div className="hero-frame" aria-hidden="true" />
          <div className="hero-watermark startup-watermark" aria-hidden="true">
            起業
          </div>

          <div className="scene-overlay startup-hero-overlay">
            <div className="startup-hero-copy">
              <div className="section-kicker">起業 — Startups &amp; Ventures</div>
              <h1 className="startup-hero-title">The founder side of an engineer</h1>
              <ul className="startup-hero-points">
                {STARTUP_HERO_POINTS.map(({ key, content }) => (
                  <li className="startup-hero-point" key={key}>
                    {content}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Same cue as the home hero — this page had none, so nothing told a
              visitor there was anything below the fold. */}
          <a className="hero-scroll" href="#xstryv" aria-label="Scroll to startup experience">
            <span className="hero-scroll-label">scroll</span>
            <span className="hero-scroll-line" aria-hidden="true" />
          </a>

          {!reduced && (
            <div className="ink-dock">
              <p className="ink-dock-hint">
                <span className="ink-dock-hint-lead">Change colour</span>
              </p>
              <div className="startup-inkpicker" role="group" aria-label="Pick an ink color">
                {swatches.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`ink-swatch ${s.id === activeId ? 'is-active' : ''}`}
                    style={{ background: s.hex }}
                    onPointerEnter={() => setActiveId(s.id)}
                    onFocus={() => setActiveId(s.id)}
                    onClick={() => setActiveId(s.id)}
                    aria-pressed={s.id === activeId}
                    aria-label={`${s.name} ink`}
                    title={s.name}
                  />
                ))}
                {/* Reset sits in the same panel it acts on, set apart by a hairline so it
                    reads as an action, not a sixth colour. Outlined, not filled, for the
                    same reason. */}
                <span className="ink-picker-divider" aria-hidden="true" />
                <button type="button" className="ink-clear" onClick={clearInk} aria-label="Clear colour">
                  <svg className="ink-clear-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.6 19.5 3.9 14.8a1.6 1.6 0 0 1 0-2.3l8.7-8.7a1.6 1.6 0 0 1 2.3 0l5.3 5.3a1.6 1.6 0 0 1 0 2.3L11.9 19.5" /><path d="M8.6 19.5H20" /><path d="m7.3 10.9 6.3 6.3" /></svg>
                  <span className="ink-clear-tip" aria-hidden="true">
                    Clear colour
                  </span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ░░ 01 · XSTRYV ░░ */}
        <section id="xstryv" className="section">
          <div className="section-inner">
            <Reveal>
              <div className="startup-sec-head">
                <span className="startup-sec-kanji">一</span>
                <span className="startup-sec-label">Startup Experience</span>
              </div>
            </Reveal>

            <div className="startup-x">
              <Reveal className="startup-x-side">
                <div className="startup-x-num">01</div>
                <div className="startup-x-meta">
                  {xstryv.meta.map((line, i) => (
                    <span key={line}>
                      {line}
                      {i < xstryv.meta.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </div>
                <a className="startup-x-link" href="https://xstryv.com" target="_blank" rel="noopener noreferrer">
                  xstryv.com ↗
                </a>
              </Reveal>

              <Reveal className="startup-x-body" delay={0.05}>
                <div className="work-kicker">{xstryv.kicker}</div>
                <h2 className="startup-h2">{xstryv.title}</h2>
                <p className="startup-p">{xstryv.summary}</p>

                {xstryv.stats ? (
                  <ul className="stat-row">
                    {xstryv.stats.map((stat) => (
                      <li className="stat" key={stat.label}>
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="startup-cards">
                  {XSTRYV_CARDS.map((card) => (
                    <div className="startup-card" key={card.title}>
                      <div className="startup-card-title">
                        <span aria-hidden="true">◇</span> {card.title}
                      </div>
                      <p className="startup-card-body">{card.body}</p>
                    </div>
                  ))}
                </div>

                <ul className="tags">
                  {xstryv.tech.map((t) => (
                    <li className="tag" key={t}>
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ░░ 02 · PATHWAYS ░░ */}
        <section id="pathways" className="section section--alt">
          <div className="section-inner">
            <Reveal>
              <div className="startup-sec-head">
                <span className="startup-sec-kanji">二</span>
                <span className="startup-sec-label">Helsinki Incubators · Alumni</span>
              </div>
            </Reveal>

            <div className="startup-two">
              <Reveal className="startup-two-text">
                <span className="startup-badge">Pathways · Pre-Incubator</span>
                <h2 className="startup-h2">Pathways — University of Helsinki pre-incubator</h2>
                <p className="startup-p">
                  Pathways is the University of Helsinki’s interdisciplinary pre-incubator, run by{' '}
                  <strong>Helsinki Incubators</strong>. Over four months it guides early-stage founders
                  through turning a raw idea into a real business — from defining the problem and
                  ideating solutions to testing, piloting, and building a business plan, ending in a
                  final showcase.
                </p>
                <p className="startup-p">
                  As an alum, I went through expert-led lectures and workshops on goal-setting and
                  time management, problem definition and ideation, testing and piloting, and
                  business planning — held in person at the City Centre Campus.
                </p>

                <dl className="startup-specs">
                  {PATHWAYS_SPECS.map(([k, v]) => (
                    <div className="startup-spec" key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal className="startup-figs" delay={0.05}>
                <figure className="startup-fig">
                  <ImageSlot
                    src={STARTUP_MEDIA.helsinkiIncubators}
                    alt="Kamlesh Kumar at the Helsinki Incubators during Pathways"
                    label="Photo at the Helsinki Incubators"
                    className="startup-fig-img"
                    onExpand={(m) => setLightbox({ ...m, caption: 'At the Helsinki Incubators · Pathways' })}
                  />
                  <figcaption>At the Helsinki Incubators · Pathways</figcaption>
                </figure>
                <figure className="startup-fig">
                  <ImageSlot
                    src={STARTUP_MEDIA.pathwaysCertificate}
                    poster={STARTUP_MEDIA.pathwaysCertificateImage}
                    alt="Pathways pre-incubator certificate of attendance"
                    label="Pathways certificate"
                    fit="contain"
                    className="startup-fig-img startup-fig-img--cert"
                    onExpand={(m) => setLightbox({ ...m, caption: 'Certificate of attendance', aspect: 842 / 595 })}
                  />
                  <figcaption>Certificate of attendance</figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ░░ 03 · SLUSH ░░ */}
        <section id="slush" className="section">
          <div className="section-inner">
            <Reveal>
              <div className="startup-sec-head">
                <span className="startup-sec-kanji">三</span>
                <span className="startup-sec-label">Slush 2025 · Volunteer</span>
              </div>
            </Reveal>

            <div className="startup-slush-top">
              <Reveal className="startup-slush-text">
                <h2 className="startup-h2">@SLUSH - Europe’s largest startup event</h2>
                <p className="startup-p">
                  I volunteered at <strong>Slush 2025</strong>, supporting Founder Days — helping
                  coordinate a gathering of <strong>1,500+ founders</strong> through on-site
                  operations and attendee guidance.
                </p>
                <p className="startup-p">
                  Being in the room with that many builders at once is its own kind of education:
                  it’s where the startup world I work in stops being abstract.
                </p>
                <div className="startup-stats">
                  <div className="startup-stat">
                    <div className="startup-stat-n">1,500+</div>
                    <div className="startup-stat-l">Founders</div>
                  </div>
                  <div className="startup-stat">
                    <div className="startup-stat-n">2025</div>
                    <div className="startup-stat-l">Helsinki</div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <figure className="startup-fig">
                  <ImageSlot
                    src={STARTUP_MEDIA.slushCertificate}
                    poster={STARTUP_MEDIA.slushCertificateImage}
                    alt="Slush 2025 volunteer certificate"
                    label="Slush volunteer certificate"
                    fit="contain"
                    className="startup-fig-img startup-fig-img--cert"
                    onExpand={(m) => setLightbox({ ...m, caption: 'Slush volunteer certificate', aspect: 596 / 843 })}
                  />
                  <figcaption>Slush volunteer certificate</figcaption>
                </figure>
              </Reveal>
            </div>

            <Reveal className="startup-slush-grid">
              <figure className="startup-fig">
                <ImageSlot
                  src={STARTUP_MEDIA.slushTeam}
                  alt="Kamlesh Kumar with the Slush volunteer team"
                  label="Slush team photo"
                  className="startup-fig-img"
                  onExpand={(m) => setLightbox({ ...m, caption: 'With the team at Slush' })}
                />
                <figcaption>With the team at Slush</figcaption>
              </figure>
              <figure className="startup-fig">
                <ImageSlot
                  src={STARTUP_MEDIA.slushFloor}
                  alt="On the floor at Slush Founder Days"
                  label="Slush floor photo"
                  className="startup-fig-img"
                  onExpand={(m) => setLightbox({ ...m, caption: 'On the floor · Founder Days' })}
                />
                <figcaption>On the floor · Founder Days</figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* ░░ CONTACT ░░ */}
        <section id="contact" className="section section--alt">
          <div className="contact-inner">
            <Reveal>
              <div className="section-kicker">了 — Get in touch</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="contact-title">Building something? I like rooms full of founders.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="contact-actions">
                <a className="btn btn--seal" href={`mailto:${profile.email}`}>
                  {profile.email} →
                </a>
                <a className="btn btn--ghost" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a className="btn btn--ghost" href={profile.links.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <Link className="btn btn--ghost" to="/">
                  ← Home
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />

      <Lightbox media={lightbox} onClose={() => setLightbox(null)} />
    </>
  )
}
