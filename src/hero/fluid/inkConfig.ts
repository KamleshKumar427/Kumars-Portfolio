// ──────────────────────────────────────────────────────────────
// All hero ink/fluid tunables live here. Tweak freely.
// The simulation is a GPU "Stable Fluids" solver (Jos Stam):
// advect → splat → vorticity → divergence → pressure → gradient.
// ──────────────────────────────────────────────────────────────

export type Swatch = {
  id: string
  name: string
  /** sRGB hex of the ink released for this swatch */
  hex: string
}

export type ThemeTint = {
  /** clear-water base color the ink blooms into */
  water: string
  /** glossy reflection / sheen color of the glass sheet */
  glass: string
}

export const inkConfig = {
  // — Simulation resolution (internal, independent of display size) —
  // Lower = faster. These are the main 60fps levers.
  simResolution: 128, // velocity/pressure grid
  dyeResolution: 1024, // ink/color grid (capped per device below)

  // — Fluid feel —
  // densityDissipation: how slowly ink fades. 0 = never fades (pure accumulation),
  // higher = fades faster. Kept very low so colors persist, accumulate and blend.
  // Single tunable for ink persistence; ~0.045 lets ink linger noticeably longer.
  // Do NOT reach 0 — muddy brown build-up + sim instability.
  densityDissipation: 0.045,
  // velocityDissipation: how fast motion settles to stillness.
  // Higher = ink comes to rest sooner (calmer).
  velocityDissipation: 1.1,
  // pressureIterations: incompressibility solve quality. More = more "liquid".
  pressureIterations: 24,
  pressure: 0.8,
  // curl: vorticity strength — the wispy, viscous ink filaments.
  // Higher = more turbulent curls; lower = smoother diffusion.
  curl: 22,
  // splatRadius: size of each ink drop (thick bloom, not a thin line).
  // The Gaussian's visible radius scales with sqrt(splatRadius), so a value of
  // 0.205 (= 0.32 * 0.8^2) renders a bloom ~80% the diameter of 0.32.
  splatRadius: 0.205,
  // splatForce: how hard pointer motion pushes the water.
  splatForce: 6200,

  // — Glass sheet over the water —
  glass: {
    reflectivity: 0.42, // how strongly the glass reflects (Fresnel mix)
    fresnelPower: 2.6, // edge falloff of the reflection
    sheen: 0.5, // specular highlight + surface gloss strength
    refraction: 0.55, // how much ink bends light beneath the glass
  },

  // — Per-theme water + glass tints (washi paper / sumi ink moods) —
  tints: {
    dark: { water: '#0e1014', glass: '#cfdde4' } as ThemeTint,
    light: { water: '#ece3d0', glass: '#fbf4e6' } as ThemeTint,
  },

  // — The 5 selectable inks — traditional Japanese pigments —
  swatches: [
    { id: 'beni', name: 'Beni', hex: '#b23a2e' },
    { id: 'sumi', name: 'Sumi', hex: '#3a3530' },
    { id: 'ai', name: 'Ai', hex: '#2c4a60' },
    { id: 'rokusho', name: 'Rokushō', hex: '#5e7b58' },
    { id: 'kincha', name: 'Kincha', hex: '#a97b30' },
  ] as Swatch[],
} as const

export type InkConfig = typeof inkConfig
