/**
 * Meniscus motion constants — slow, viscous, deliberate. No bounce, no overshoot.
 * One rule: scroll position → GSAP; interaction & state → Motion (Framer Motion).
 */

/** Signature easings as cubic-bezier arrays (Framer Motion friendly). */
export const ease = {
  /** quick onset → long deceleration glide (the "water" pull) */
  water: [0.22, 1, 0.36, 1] as const,
  /** gentle settle for enters */
  settle: [0.16, 1, 0.3, 1] as const,
}

/** Same easings as CSS strings (inline styles / transitions). */
export const easeCss = {
  water: 'cubic-bezier(0.22, 1, 0.36, 1)',
  settle: 'cubic-bezier(0.16, 1, 0.3, 1)',
}

/**
 * GSAP easing names — long deceleration, no overshoot. These match the feel of
 * the cubic-beziers above without needing the CustomEase plugin.
 */
export const gsapEase = {
  water: 'power3.out',
  settle: 'power2.out',
}

/** Durations (seconds). */
export const duration = {
  micro: 0.25,
  reveal: 1.05,
  route: 0.75,
}

/** Page-level route transition (Motion / AnimatePresence). Dissolve, never slide hard. */
export const pageTransition = {
  initial: { opacity: 0, filter: 'blur(6px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(6px)' },
  transition: { duration: duration.route, ease: ease.water },
}

/** The signature scroll reveal — "ink bloom". Consumed by the <Reveal> GSAP wrapper. */
export const inkBloom = {
  from: { autoAlpha: 0, y: 24, scale: 1.01, filter: 'blur(8px)' },
  to: { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  stagger: 0.1,
}
