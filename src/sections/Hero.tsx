import { lazy, Suspense } from 'react'
import { profile } from '../data/profile'
import { inkConfig, resolveSwatch } from '../hero/fluid/inkConfig'
import { useActiveInk } from '../hero/fluid/inkSelection'
import { InkCursor } from '../hero/InkCursor'
import { useIsDark } from '../hooks/useIsDark'
import { useReducedMotion } from '../hooks/useReducedMotion'

const HeroFluid = lazy(() =>
  import('../hero/fluid/HeroFluid').then((m) => ({ default: m.HeroFluid })),
)

export function Hero() {
  const isDark = useIsDark()
  const reduced = useReducedMotion()
  const [activeId, setActiveId] = useActiveInk()
  const swatches = inkConfig.swatches.map((s) => resolveSwatch(s, isDark))
  const active = swatches.find((s) => s.id === activeId) ?? swatches[0]

  return (
    <section id="hero" className="hero">
      {!reduced && <InkCursor />}
      {reduced ? (
        <div className="hero-fluid is-fallback" aria-hidden="true" />
      ) : (
        <Suspense fallback={<div className="hero-fluid is-fallback" aria-hidden="true" />}>
          <HeroFluid color={active.hex} isDark={isDark} />
        </Suspense>
      )}
      <div className="hero-frame" aria-hidden="true" />
      <div className="hero-watermark" aria-hidden="true">
        墨と水
      </div>

      <div className="scene-overlay">
        <div className="hero-id">
          <span className="scene-eyebrow">
            <span className="status-led" />
            {profile.location} · open to roles
          </span>
          <h1 className="hero-name">
            Kamlesh <em>Kumar</em>
          </h1>
          <p className="hero-role">{profile.title}</p>
          <p className="hero-tagline">{profile.headline}</p>
        </div>

      </div>

      {/* Pinned to the hero, not to the copy: it shares the right rail with the
          ink dock and stays at the bottom while the copy centres. */}
      <a className="hero-scroll" href="#experience" aria-label="Scroll to experience">
        <span className="hero-scroll-label">scroll</span>
        <span className="hero-scroll-line" aria-hidden="true" />
      </a>

      {/* Ink dock: the instruction sits with the swatches rather than across the
          hero from them, so it's obvious what the circles are for. */}
      {!reduced && (
        <div className="ink-dock">
          <p className="ink-dock-hint">
            <span className="ink-dock-hint-lead">Change colour</span>
          </p>
          <div className="ink-picker" role="group" aria-label="Ink color">
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
          </div>
        </div>
      )}
    </section>
  )
}
