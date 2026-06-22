/**
 * Scroll pin-and-release for the pond, on the site's GSAP ScrollTrigger
 * (Lenis already drives ScrollTrigger.update). The pin is FINITE and short
 * (default +=70%) so the visitor is never trapped — they can always scroll on.
 * `release()` ends it early (seamlessly, while still at the pin's start) after
 * the first feed or the 6s timeout.
 */
import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

type Options = {
  enabled: boolean
  pinDistance?: string
  onEnter?: () => void
}

export function usePondPin(
  ref: RefObject<HTMLElement | null>,
  { enabled, pinDistance = '+=50%', onEnter }: Options,
) {
  const stRef = useRef<ReturnType<typeof ScrollTrigger.create> | null>(null)

  useEffect(() => {
    if (!enabled || !ref.current) return
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: pinDistance,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onEnter: () => onEnter?.(),
    })
    stRef.current = st
    return () => {
      st.kill()
      stRef.current = null
    }
    // onEnter is read fresh via closure; intentionally not a dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, pinDistance, ref])

  const release = useCallback(() => {
    const st = stRef.current
    // Only end early if the visitor is still at the top of the pin — avoids a jump.
    if (st && st.progress < 0.05) {
      st.kill(true)
      stRef.current = null
    }
  }, [])

  return release
}
