/**
 * Graceful-degradation probe. Decides which pond to render so a weak GPU or a
 * WebGL-less browser gets something calm, never broken.
 *
 *  - 'none' → no WebGL → static CSS pond fallback.
 *  - 'lite' → low-power heuristic → fewer fish, no caustics.
 *  - 'full' → the full scene.
 */
export type PondTier = 'full' | 'lite' | 'none'

let cached: PondTier | null = null

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    )
  } catch {
    return false
  }
}

export function detectPondTier(): PondTier {
  if (cached) return cached
  if (typeof window === 'undefined') return 'full'

  if (!hasWebGL()) {
    cached = 'none'
    return cached
  }

  type NavExtras = Navigator & { deviceMemory?: number }
  const nav = navigator as NavExtras
  const memory = nav.deviceMemory ?? 8
  const cores = nav.hardwareConcurrency ?? 8
  const coarse =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 560

  const weak = memory <= 4 || cores <= 4 || (coarse && smallViewport)
  cached = weak ? 'lite' : 'full'
  return cached
}
