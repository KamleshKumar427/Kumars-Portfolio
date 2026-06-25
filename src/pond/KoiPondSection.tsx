/**
 * ════════════════════════════════════════════════════════════════
 *  "Feed my pet" — the Lab chapter's interactive koi pond (§8 Fish).
 *
 *  · Lazy-mounts the R3F canvas only when near the viewport (perf).
 *  · Finite GSAP ScrollTrigger pin; releases on first feed OR ~6s.
 *  · prefers-reduced-motion → no pin, slow drift, reduced feed FX.
 *  · No WebGL → calm static pond fallback.
 * ════════════════════════════════════════════════════════════════
 */
import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { detectPondTier } from './capability'
import { koiConfig, liteConfig, type KoiConfig } from './koiConfig'
import { usePondPin } from './usePondPin'

const PondCanvas = lazy(() => import('./PondCanvas'))

/** If the 3D scene throws (e.g. a GLB fails to load), show the static pond
 *  instead of white-screening the whole page. */
class PondErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export function KoiPondSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const tier = useMemo(() => detectPondTier(), [])

  const cfg: KoiConfig = useMemo(() => {
    const base = tier === 'lite' ? liteConfig() : koiConfig
    if (!reduced) return base
    return {
      ...base,
      caustics: false,
      pelletsPerClick: Math.min(5, base.pelletsPerClick),
      rippleIntensity: base.rippleIntensity * 0.6,
      swimSpeed: base.swimSpeed * 0.7,
    }
  }, [tier, reduced])

  const [mounted, setMounted] = useState(false)
  const fedRef = useRef(false)
  const timerRef = useRef<number | undefined>(undefined)

  const pinEnabled = tier !== 'none' && !reduced

  const onEnterRef = useRef<() => void>(() => {})
  const release = usePondPin(sectionRef, {
    enabled: pinEnabled,
    onEnter: () => onEnterRef.current(),
  })

  const fadeAndRelease = useCallback(() => {
    release()
  }, [release])

  // The pin's onEnter: arm the auto-release after 6s if the visitor hasn't fed.
  useEffect(() => {
    onEnterRef.current = () => {
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        if (!fedRef.current) fadeAndRelease()
      }, 6000)
    }
  }, [fadeAndRelease])

  // First feed ends the pin immediately; later feeds just keep pulling the school.
  const handleFeed = useCallback(() => {
    if (fedRef.current) return
    fedRef.current = true
    window.clearTimeout(timerRef.current)
    fadeAndRelease()
  }, [fadeAndRelease])

  // Lazy-mount the canvas as the section nears the viewport.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- legacy browser fallback
      setMounted(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMounted(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  return (
    <section ref={sectionRef} className="koi-section" aria-label="Feed my pet — an interactive koi pond">
      {tier === 'none' ? (
        <div className="koi-fallback" aria-hidden="true" />
      ) : (
        mounted && (
          <PondErrorBoundary fallback={<div className="koi-fallback" aria-hidden="true" />}>
            <Suspense fallback={<div className="koi-fallback" aria-hidden="true" />}>
              <PondCanvas cfg={cfg} reduced={reduced} onFeed={handleFeed} />
            </Suspense>
          </PondErrorBoundary>
        )
      )}

      <div className="koi-vignette" aria-hidden="true" />

      <div className="scene-overlay">
        <div className="scene-titleblock">
          <span className="scene-eyebrow">鯉 — a moment at the pond</span>
          <h2 className="scene-title">
            Feed my <em>pets</em>, koi!
          </h2>
          <p className="scene-cue">
            <span className="scene-cue-dot" />
            {tier === 'none' ? 'a quiet pond' : 'click to drop food into the water'}
          </p>
        </div>
      </div>

      {pinEnabled && (
        <div className="koi-scrollcue" aria-hidden="true">
          scroll to continue <span className="koi-scrollcue-arrow">↓</span>
        </div>
      )}
    </section>
  )
}
