import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { ImageSlot } from './components/ImageSlot'
import { Lightbox, type LightboxMedia } from './components/Lightbox'
import { Reveal } from './components/ui/Reveal'
import { SiteFooter } from './components/SiteFooter'
import { inkConfig } from './hero/fluid/inkConfig'
import { useIsDark } from './hooks/useIsDark'
import { useReducedMotion } from './hooks/useReducedMotion'
import { profile } from './data/profile'

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
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-inner">
        <Link className="nav-brand nav-back" to="/" aria-label="Back to home">
          <span className="nav-seal" aria-hidden="true">
            墨
          </span>
          <span className="nav-name">← Kamlesh Kumar</span>
        </Link>

        <div className="nav-end">
          <nav className="nav-links" aria-label="Sections">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

const XSTRYV_CARDS = [
  {
    title: 'Messaging system',
    body: 'Built LinkedIn-style messaging between companies and talent, with scheduled background CRON jobs so users receive one summary email after a conversation goes quiet.',
  },
  {
    title: 'Race-condition fix',
    body: 'Traced a race condition between two signup paths that caused mismatched user IDs across two database schemas, diagnosed the root cause, and shipped a permanent fix.',
  },
  {
    title: 'Data integrity',
    body: 'Debugged and resolved pre-existing inconsistent data across the auth and application layers.',
  },
  {
    title: 'Self-serve hiring',
    body: 'Built a self-serve applicant workflow so companies independently manage hiring — shortlist, reject and accept candidates with data export, plus bulk in-platform messaging and announcements.',
  },
]

const XSTRYV_TECH = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'Supabase',
  'CRON Jobs',
  'GitHub Actions',
]

const PATHWAYS_SPECS = [
  ['Programme', 'Interdisciplinary pre-incubator'],
  ['Duration', 'Four months · in person'],
  ['Host', 'Helsinki Incubators · University of Helsinki'],
]

/** Static assets in public/images/startups/ */
const STARTUP_MEDIA = {
  helsinkiIncubators: '/images/startups/helsinki-incubators.jpg',
  pathwaysCertificate: '/images/startups/pathways-certificate.pdf',
  slushCertificate: '/images/startups/slush-certificate.pdf',
  slushTeam: '/images/startups/slush-team.jpeg',
  slushFloor: '/images/startups/slush-floor.jpeg',
} as const

export function StartupsPage() {
  const isDark = useIsDark()
  const reduced = useReducedMotion()
  const [activeId, setActiveId] = useState(inkConfig.swatches[0].id)
  const activeInk = inkConfig.swatches.find((s) => s.id === activeId) ?? inkConfig.swatches[0]
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
              <p className="startup-hero-lead">
                Sole engineer on a live recruitment platform, an alum of Helsinki’s Pathways
                pre-incubator, and a volunteer @SLUSH - Europe’s largest startup event.
              </p>
              <div className="startup-hero-hint">
                <span>drag the ink ↑</span>
                <span className="startup-hero-rule" aria-hidden="true" />
              </div>
            </div>
          </div>

          {!reduced && (
            <div className="startup-inkpicker" role="group" aria-label="Pick an ink color">
              {inkConfig.swatches.map((s) => (
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
                  2026 · MAR–JUN
                  <br />
                  ONLY ENGINEER
                  <br />
                  HYBRID
                </div>
                <a className="startup-x-link" href="https://xstryv.com" target="_blank" rel="noopener noreferrer">
                  xstryv.com ↗
                </a>
              </Reveal>

              <Reveal className="startup-x-body" delay={0.05}>
                <div className="work-kicker">XSTRYV · Recruitment Platform</div>
                <h2 className="startup-h2">Sole engineer on a live recruitment platform</h2>
                <p className="startup-p">
                  Joined XSTRYV — a recruitment platform connecting talent with companies — as its
                  only engineer and a core team member. Inherited all three panels (admin, company,
                  talent) and owned them end to end while serving{' '}
                  <strong>1,600+ users</strong> and <strong>250+ companies</strong>.
                </p>
                <p className="startup-p">
                  Across <strong>50+ commits in three months</strong> I shipped features, fixed
                  production bugs, and ran deployments through GitHub Actions CI/CD — shaping
                  product and market decisions, not just the code.
                </p>

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
                  {XSTRYV_TECH.map((t) => (
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
                    alt="Pathways pre-incubator certificate of attendance"
                    label="Pathways certificate"
                    fit="contain"
                    className="startup-fig-img startup-fig-img--cert"
                    onExpand={(m) => setLightbox({ ...m, caption: 'Certificate of attendance' })}
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
                    alt="Slush 2025 volunteer certificate"
                    label="Slush volunteer certificate"
                    fit="contain"
                    className="startup-fig-img startup-fig-img--cert"
                    onExpand={(m) => setLightbox({ ...m, caption: 'Slush volunteer certificate' })}
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
