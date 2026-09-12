import { FluidSim } from './FluidSim'

/**
 * One fluid for the whole visit. The hero on "/" and the hero on "/startups"
 * mount this same simulation and canvas, so ink painted on one page is still in
 * the water on the other. It lives in module memory only — a full page refresh
 * starts with clear water.
 *
 * Only HeroFluid (a lazy chunk) imports this, so Three.js stays out of the
 * initial bundle.
 */
export type SharedFluid = {
  canvas: HTMLCanvasElement
  /** null when the device lacks float render targets → CSS fallback */
  sim: FluidSim | null
  /** the two welcome blooms are added once per visit, not per page change */
  seeded: boolean
  /** performance.now() of the last step — lets the ink fade on real time */
  clock: number | null
}

let shared: SharedFluid | null = null

function createSim(canvas: HTMLCanvasElement): FluidSim | null {
  try {
    const sim = new FluidSim(canvas)
    if (sim.isSupported) return sim
    sim.dispose()
  } catch {
    // no WebGL / float render targets — the hero falls back to CSS
  }
  return null
}

export function getSharedFluid(): SharedFluid {
  if (shared) return shared

  const canvas = document.createElement('canvas')
  canvas.className = 'hero-fluid-canvas'
  canvas.setAttribute('aria-hidden', 'true')

  shared = { canvas, sim: createSim(canvas), seeded: false, clock: null }
  return shared
}
