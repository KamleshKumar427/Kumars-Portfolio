import { lazy, Suspense, useState } from 'react'
import { profile } from '../data/profile'
import { inkConfig } from '../hero/fluid/inkConfig'
import { useIsDark } from '../hooks/useIsDark'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Lazy-load the WebGL fluid so Three.js stays out of the initial bundle (perf mandate).
const HeroFluid = lazy(() =>
  import('../hero/fluid/HeroFluid').then((m) => ({ default: m.HeroFluid })),
)

export function Hero() {
  const isDark = useIsDark()
  const reduced = useReducedMotion()
  const [activeId, setActiveId] = useState(inkConfig.swatches[0].id)

  const active =
    inkConfig.swatches.find((s) => s.id === activeId) ?? inkConfig.swatches[0]

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

      {/* Stylish white corner title — intuitive, no CV dump (the dossier is below). */}
      <div className="scene-overlay">
        <div className="scene-titleblock">
          <span className="scene-eyebrow">
            <span className="status-led" />
            {profile.location} · open to roles
          </span>
          <h1 className="scene-title">
            Drip ink into <em>deep water</em>
          </h1>
          <p className="scene-cue">drag across the glass — pick a color</p>

          <div className="ink-dock" role="group" aria-label="Ink color">
            <div className="ink-swatches">
              {inkConfig.swatches.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`ink-swatch ${s.id === activeId ? 'is-active' : ''}`}
                  style={{ background: s.hex }}
                  // Hover (fine pointers) and keyboard focus switch ink with no click.
                  onPointerEnter={() => setActiveId(s.id)}
                  onFocus={() => setActiveId(s.id)}
                  // Tap/click kept as equivalent selectors (touch has no hover; a11y).
                  onClick={() => setActiveId(s.id)}
                  aria-pressed={s.id === activeId}
                  aria-label={`${s.name} ink`}
                  title={s.name}
                />
              ))}
            </div>
            <span className="ink-dock-name">{active.name.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
