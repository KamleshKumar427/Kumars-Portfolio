import { lazy, Suspense, useState } from 'react'
import { profile } from '../data/profile'
import { inkConfig } from '../hero/fluid/inkConfig'
import { useIsDark } from '../hooks/useIsDark'
import { useReducedMotion } from '../hooks/useReducedMotion'

const HeroFluid = lazy(() =>
  import('../hero/fluid/HeroFluid').then((m) => ({ default: m.HeroFluid })),
)

export function Hero() {
  const isDark = useIsDark()
  const reduced = useReducedMotion()
  const [activeId, setActiveId] = useState(inkConfig.swatches[0].id)
  const active = inkConfig.swatches.find((s) => s.id === activeId) ?? inkConfig.swatches[0]

  return (
    <section id="hero" className="hero">
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
          <p className="hero-role">AI Full-Stack Engineer</p>
        </div>

        <div className="hero-bottom">
          <div className="ink-dock" role="group" aria-label="Ink color">
            <span className="ink-dock-label">墨 — drag the water · pick an ink</span>
            <div className="ink-swatches">
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
          </div>

          <a className="hero-scroll" href="#experience" aria-label="Scroll to experience">
            <span className="hero-scroll-label">scroll</span>
            <span className="hero-scroll-line" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
