// ──────────────────────────────────────────────────────────────
// All hero ink/fluid tunables live here. Tweak freely.
// The simulation is a GPU "Stable Fluids" solver (Jos Stam):
// advect → splat → vorticity → divergence → pressure → gradient.
// ──────────────────────────────────────────────────────────────

export type Swatch = {
  id: string
  name: string
  /** sRGB hex of the ink released for this swatch — also the swatch's own fill */
  hex: string
  /** Optional dark-theme variant (the neutral ink flips black → white so it
   *  never vanishes into dark water). Fill and ink always match. */
  dark?: { name: string; hex: string }
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
  // densityDissipation: how fast painted ink fades, per second (exponential).
  // 0.16 → a dense stroke keeps its full colour for roughly 10–15s, then
  // dissolves and is gone by ~25s; light touches fade sooner. The fade runs on
  // real time — it continues while the hero is off-screen or you're on the
  // other page. Lower = lingers longer (0.045 lingered for minutes).
  // Do NOT reach 0 — muddy build-up + sim instability.
  densityDissipation: 0.16,
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

  // — Small screens —
  // Drop size is measured in canvas HEIGHT, and a phone hero is about as tall as
  // a laptop's but a quarter as wide — so on a phone each drop covers far more of
  // the screen. A finger's movement is measured as a fraction of that narrow
  // width too, so it throws the ink much harder. Together they flood a phone in
  // a couple of strokes. At or below maxWidth, drops are smaller and push less.
  // Above it — desktop — nothing changes.
  compact: {
    maxWidth: 900, // px — the breakpoint the hero layout already switches at
    radiusScale: 0.4, // × splatRadius
    forceScale: 0.35, // × splatForce
  },

  // — Glass sheet over the water (dark mode) —
  glass: {
    reflectivity: 0.42, // how strongly the glass reflects (Fresnel mix)
    fresnelPower: 2.6, // edge falloff of the reflection
    sheen: 0.5, // specular highlight + surface gloss strength
    refraction: 0.55, // how much ink bends light beneath the glass
  },

  // — Matte surface (light mode) —
  // Same solver, almost no shine: the specular highlight and Fresnel are nearly
  // gone, so the hero reads as pigment soaking into matte paper rather than ink
  // under a glass sheet. Raise `sheen` to put the gloss back.
  glassLight: {
    reflectivity: 0.12,
    fresnelPower: 2.6,
    sheen: 0.1,
    refraction: 0.48,
  },

  // — Per-theme water + glass tints (washi paper / sumi ink moods) —
  tints: {
    dark: { water: '#0e1014', glass: '#cfdde4' } as ThemeTint,
    // These hexes are NOT the colour you see. The renderer treats them as
    // linear and the canvas encodes sRGB, so what lands on screen is
    // sRGB_to_linear(hex) — markedly darker than the swatch reads here. Each
    // value below is therefore the inverse (linear_to_sRGB) of its target:
    // #fcfefb renders as #f9fcf7, the page's own sage, so the hero blends into
    // the page instead of sitting on it as a darker block. Measured, not
    // guessed — if you change these, re-measure rather than eyeballing.
    light: { water: '#fcfefb', glass: '#fdfefd' } as ThemeTint,
  },

  // — The 5 selectable inks —
  // Picked to read on BOTH waters. The gold is deliberately deep and saturated:
  // the tan light-mode water shares gold's hue, so a pale gold would vanish.
  // The neutral flips black → white in dark mode so it never sinks into dark water.
  // The display pass renders these 1:1, so a swatch's fill IS its ink colour.
  swatches: [
    { id: 'beni', name: 'Beni', hex: '#ff1810' }, // the vivid red the sim always showed
    { id: 'sumi', name: 'Sumi', hex: '#1f1b17', dark: { name: 'Gofun', hex: '#f4eee3' } },
    { id: 'kin', name: 'Kin', hex: '#d4940a' }, // gold
    { id: 'rokusho', name: 'Rokushō', hex: '#10a880' }, // verdigris jade
    { id: 'ruri', name: 'Ruri', hex: '#1f6feb' }, // lapis — the one hue the set lacked
  ] as Swatch[],
} as const

export type InkConfig = typeof inkConfig

/** A swatch as it should look — and ink — in the current theme. */
export function resolveSwatch(s: Swatch, isDark: boolean): Swatch {
  return isDark && s.dark ? { ...s, ...s.dark } : s
}
