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
  const [, ...lastNameParts] = profile.name.split(' ')
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

      <div className="hero-overlay">
        <div className="hero-panel">
          <p className="hero-coords">
            <span className="status-led" />
            {profile.location}
          </p>

          <h1 className="hero-name">
            {profile.name.split(' ')[0]}{' '}
            <span className="hero-name-family">{lastNameParts.join(' ')}</span>
          </h1>

          <p className="hero-headline">{profile.headline}</p>
          <p className="hero-lead">{profile.tagline}</p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              See projects
            </a>
            <a href={`mailto:${profile.email}`} className="btn btn-secondary">
              Send email
            </a>
          </div>

          <div className="hero-links">
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              github
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              linkedin
            </a>
            <a href={profile.links.stackoverflow} target="_blank" rel="noreferrer">
              stackoverflow
            </a>
          </div>
        </div>

        <div className="ink-dock" role="group" aria-label="Ink color">
          <span className="ink-dock-label">ink</span>
          <div className="ink-swatches">
            {inkConfig.swatches.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`ink-swatch ${s.id === activeId ? 'is-active' : ''}`}
                style={{ background: s.hex }}
                onClick={() => setActiveId(s.id)}
                aria-pressed={s.id === activeId}
                aria-label={`${s.name} ink`}
                title={s.name}
              />
            ))}
          </div>
          <span className="ink-dock-name">{active.name.toLowerCase()}</span>
        </div>

        <p className="hero-hint">move across the glass to release ink</p>
      </div>
    </section>
  )
}
