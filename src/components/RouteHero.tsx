import type { ReactNode } from 'react'
import { Container } from './ui/Container'
import { Eyebrow } from './ui/Eyebrow'

type RouteHeroProps = {
  /** Mono coordinate/telemetry label above the title. */
  eyebrow: string
  title: ReactNode
  lead: string
  /**
   * Slot for the future per-route 3D scene (R3F). Render it absolutely-positioned
   * to fill the hero; it sits *behind* the overlay copy. Leave empty to show the
   * marked placeholder + static water fallback.
   */
  scene?: ReactNode
}

/**
 * Shared hero shell for the /experience and /startup routes. Same glass+water
 * family as the landing hero. Drop a R3F scene into `scene` later — the layout,
 * overlay, scrim and scroll behavior stay identical so heroes drop in cleanly.
 */
export function RouteHero({ eyebrow, title, lead, scene }: RouteHeroProps) {
  return (
    <section className="hero" style={{ minHeight: '78svh' }}>
      {/* ════════════════════════════════════════════════════════════════
          PLACEHOLDER · per-route 3D hero — same glass + water family.
          Drop the R3F scene into the `scene` prop. Until then, the static
          water fallback below stands in (identical to the landing hero's
          `is-fallback` treatment). Do NOT restyle this shell — future heroes
          rely on it for layout, scrim and scroll.
         ════════════════════════════════════════════════════════════════ */}
      {scene ?? <div className="hero-fluid is-fallback" aria-hidden="true" />}

      <div className="hero-frame" aria-hidden="true" />

      <div className="hero-overlay">
        <Container>
          <div
            className="mn-glass"
            style={{
              maxWidth: 720,
              margin: '0 auto',
              padding: 'clamp(28px, 5vw, 52px)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="hero-name" style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)' }}>
              {title}
            </h1>
            <p className="hero-lead" style={{ maxWidth: '54ch' }}>
              {lead}
            </p>
          </div>
        </Container>
      </div>
    </section>
  )
}
