/**
 * ════════════════════════════════════════════════════════════════
 *  KOI POND · "Feed my pet" — tunable parameters (single source).
 *  Realizes the §8 Fish companion as the Lab chapter's centerpiece.
 *  Every feel-knob the brief asked for lives here; tweak freely.
 * ════════════════════════════════════════════════════════════════
 */
export type KoiConfig = {
  fishCount: number
  swimSpeed: number
  fedSpeedBoost: number
  foodAttraction: number
  foodLifespanMs: number
  /** how fast one nibbling fish drains a pellet (mass/sec). Lower = food lingers. */
  eatRatePerSec: number
  rippleIntensity: number
  pelletsPerClick: number

  /** Use the optimized GLB koi model. false → procedural koi fallback. */
  useModels: boolean
  /** Target koi body length in world units (tune to taste). */
  koiLength: number
  /** Extra koi yaw (radians) if the model faces the wrong way: try Math.PI or ±Math.PI/2. */
  koiYawOffset: number
  /** Lotus GLB scale multiplier. */
  lotusScale: number

  weights: {
    separation: number
    cohesion: number
    alignment: number
    wander: number
    bounds: number
  }
  radii: {
    separation: number
    cohesion: number
    alignment: number
    arrive: number
    eat: number
  }

  /** Visible water plane size (world units) — wide so it fills the screen width. */
  waterWidth: number
  waterDepth: number
  /** Water surface tessellation [segX, segZ] — reduced on the lite tier. */
  waterSegments: [number, number]
  /** Elliptical fish swim area half-extents (wide × shallow). */
  swimHalfWidth: number
  swimHalfDepth: number
  /** Food pellet display radius. */
  pelletSize: number
  cameraAngle: 'angled' | 'topdown'
  caustics: boolean

  limits: {
    maxPellets: number
    maxRipples: number
    maxFoodPoints: number
  }

  koiColors: string[]

  palette: {
    deep: string
    shallow: string
    surface: string
    floor: string
    caustic: string
    light: string
    sky: string
    /** warm golden-hour color the water reflects at grazing angles + the surrounding bank */
    horizon: string
    bank: string
  }
}

export const koiConfig: KoiConfig = {
  fishCount: 5,
  swimSpeed: 0.62,
  fedSpeedBoost: 1.9,
  foodAttraction: 1.85,
  foodLifespanMs: 16000,
  eatRatePerSec: 0.42,
  rippleIntensity: 1.6,
  pelletsPerClick: 9,

  useModels: true,
  koiLength: 1.5, // bigger so the koi read clearly as fish in the wide pond
  koiYawOffset: 0,
  lotusScale: 1.35,

  weights: {
    separation: 1.5,
    cohesion: 0.62,
    alignment: 0.55,
    wander: 0.9,
    bounds: 1.7,
  },
  radii: {
    separation: 0.85,
    cohesion: 1.7,
    alignment: 1.25,
    arrive: 1.5,
    eat: 0.4, // bigger fish reach food from a little further (mouth reach)
  },

  waterWidth: 64,
  waterDepth: 38,
  waterSegments: [128, 72],
  swimHalfWidth: 11,
  swimHalfDepth: 4.5,
  pelletSize: 0.18, // food clearly visible on the water
  cameraAngle: 'angled',
  caustics: true,

  limits: {
    maxPellets: 64,
    maxRipples: 14,
    maxFoodPoints: 6,
  },

  koiColors: ['#d4a574', '#f5f0e8', '#e8925a', '#9aa8b8', '#5b8fd4'],

  palette: {
    deep: '#1c6f7e', // deep teal-green, never black
    shallow: '#3aa6b6',
    surface: '#8fe0ea',
    floor: '#c2a878', // warm sand, visible through the water
    caustic: '#ecfdff',
    light: '#ffecca', // golden-hour sun
    sky: '#cfe9ea', // soft bright horizon — keeps the scene from reading dark
    horizon: '#f5dca6', // warm reflection at grazing angles
    bank: '#5f7b46', // mossy garden bank around the pond
  },
}

export function liteConfig(base: KoiConfig = koiConfig): KoiConfig {
  return {
    ...base,
    fishCount: Math.min(base.fishCount, 4),
    caustics: false,
    waterSegments: [72, 40],
    limits: { ...base.limits, maxPellets: 28, maxRipples: 8 },
  }
}
