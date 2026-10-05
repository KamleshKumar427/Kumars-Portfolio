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
  /** colour of the light glinting off the water surface */
  glass: string
}

export const inkConfig = {
  // — Simulation resolution (internal, independent of display size) —
  // Lower = faster. These are the main 60fps levers.
  simResolution: 128, // velocity/pressure grid
  dyeResolution: 1024, // ink/color grid (capped per device below)

  // — Fluid feel —
  // densityDissipation: how fast painted ink fades, per second (exponential).
  // A stroke stays solid for several seconds, is pale by ~12s and gone by
  // ~20–25s — the same timing as before the ink started riding the flow. That
  // needed a slower rate than the old 0.16: moving ink is resampled every
  // frame, which thins the band on its own, so the fade itself had to ease off
  // to land at the same moment. Runs on real time (continues off-screen).
  // Lower = lingers longer. Do NOT reach 0 — muddy build-up + instability.
  densityDissipation: 0.11,
  // velocityDissipation: how fast motion settles to stillness.
  // Higher = ink comes to rest sooner (calmer).
  velocityDissipation: 1.1,
  // pressureIterations: incompressibility solve quality. More = more "liquid".
  pressureIterations: 24,
  pressure: 0.8,
  // curl: vorticity confinement — re-injects the small swirls the solver's
  // numerical damping loses. 4 keeps strokes as flowing ribbons that curl at
  // the turns and leave a wake at the end — how a finger dragged through real
  // water looks. Higher = busier (22 boiled into confetti); 0 = glassy.
  curl: 4,
  // splatRadius: size of each ink drop. The Gaussian's visible radius scales
  // with sqrt(splatRadius). 0.11 lays a band about as wide as the old renderer
  // showed — rendered as dye, the soft edge of a wider drop reads as more ink.
  splatRadius: 0.11,
  // splatForce: how hard pointer motion pushes the water — roughly how much of
  // the pointer's speed the water under it picks up, x60 events/s. 36 ≈ the
  // water moving at 60% of the pointer, as dragging through real water does.
  // This is what makes it feel like water. (Tried at 5 for an even release;
  // it stopped feeling like water, so the flow is back and the thinner brush
  // below keeps the curls fine and the fill down instead.)
  splatForce: 36,

  // inkAmount: how much ink each movement of the pointer releases. Strokes are
  // laid down evenly (see splatFragment), so this is the ink in the band at any
  // speed. 3 gives the deep, glossy colour. With the water flowing, a 3s
  // scribble covers 20% of the hero (the first flowing version flooded 43%).
  inkAmount: 3,
  // dropAmount: ink in a single round drop — a tap, or the two welcome blooms on
  // page load. Kept at the old value so those stay soft blooms rather than the
  // dense dots stroke-strength ink would make.
  dropAmount: 1,
  // faintInk: ink thinner than `from` is invisible, fully shown by `to`. Hides
  // the haze of each drop's soft tail so strokes keep a clean edge — that haze
  // made every stroke look wider and blurrier than the brush, and filled the
  // hero fast. Together with splatRadius and inkAmount this sets the width a
  // stroke shows at; lowering it widens every stroke.
  faintInk: { from: 0.08, to: 0.35 },

  // pushSpread: how much wider than the ink band the push is (width ratio).
  // 1.365 pushes exactly the water the earlier, wider brush pushed (0.205 =
  // 0.11 x 1.365^2), so the flow is that version's while the ink stays thin.
  // Much wider (4) lays ink evenly but the water stops feeling like water.
  pushSpread: 1.365,

  // — Small screens —
  // Drop size is measured in canvas HEIGHT, and a phone hero is about as tall as
  // a laptop's but a quarter as wide — so on a phone each drop covers far more of
  // the screen. A finger's movement is measured as a fraction of that narrow
  // width too, so it throws the ink much harder. Together they flood a phone in
  // a couple of strokes. At or below maxWidth, drops are smaller and push less.
  // Above it — desktop — nothing changes.
  compact: {
    maxWidth: 900, // px — the breakpoint the hero layout already switches at
    // Re-measured after the transport fix (which let ink finally ride the flow):
    // these put one swipe on a phone at ~0.83x the share of the hero it covers
    // on desktop — the same ratio as before the fix.
    radiusScale: 0.35, // × splatRadius
    forceScale: 0.25, // × splatForce
    // Strokes are narrower here, so a desktop-sized shadow offset sits too far
    // from them and reads as a grey ghost copy instead of depth.
    shadowScale: 0.6, // × the paper's depth (so the shadow's offset) and shadow blur
  },

  // — Ink as dye (light mode) —
  // inkDepth: optical depth per unit of ink. Higher = colours go deep faster;
  // lower = more of every stroke reads as a pale wash.
  inkDepth: 0.5,
  // thicknessCap: ink beyond this amount stops getting darker, so the core of a
  // heavy scribble stays a rich colour instead of going black.
  thicknessCap: 3,
  // How solid ink looks on dark water (it's seen by scattered light there).
  darkCoverage: 0.9,

  // — Depth: ink floats at the surface, the paper lies below the water —
  // The view is traced from a virtual eye `eyeHeight` above the hero, through
  // the water, down to the paper `floor` below the surface (both in hero
  // heights). The eye stays over the middle of the screen, so scrolling the
  // hero tilts the view into the water, and it leans toward the pointer by
  // `lean` (share of the pointer's offset): the paper and the ink's shadows
  // slide against the ink above them, which is what reads as real depth.
  // floor is the one knob for how deep it looks (shadow distance, softness and
  // parallax all follow it). Raise eyeHeight with it: seen from too close, deep
  // paper shrinks toward the middle of the view and shadows near the edges
  // drift onto the wrong side of their ink.
  depth: {
    floor: 0.52,
    eyeHeight: 2.0,
    lean: 0.25,
    // Key light: direction toward it on the page (y up — upper left), and how
    // far it travels sideways per unit of depth. The ink's shadow lands
    // floor x slope away from the ink.
    light: { x: -0.6, y: 0.8, slope: 0.2 },
  },

  // — The water's depth: ink sinks into it —
  // Below the surface the water is a stack of `layers`, surface to paper. Ink
  // painted on the surface is slowly released into it and sinks, so the hero
  // fills in depth rather than only across: fresh strokes ride the surface,
  // older ink drifts down, slows, and hazes out toward the paper.
  volume: {
    // More layers = smoother sinking, a little more work per frame. Keep it
    // even: the shadow reads the layers in pairs.
    layers: 8,
    // Resolution of each layer vs the surface ink. Sunk ink is soft anyway.
    scale: 0.25,
    // Share of surface ink per second that starts to sink, and the extra share
    // where the water spins (a stroke that curls drains faster).
    release: 0.2,
    swirlRelease: 0.4,
    // Swirl strength that counts as half-way to "full" — a fresh swirl core
    // reads ~50-400, a calm stroke's under 1 (measured).
    swirlRef: 10,
    // Sinking speed on its own, and the extra in a full swirl — both in
    // depths per second (0.2 = five seconds from surface to paper).
    settle: 0.2,
    swirlPull: 0.6,
    // How far down the surface's motion reaches (share of the depth): at this
    // depth the water moves at a third of the surface's speed.
    drag: 0.3,
    // Share of its contrast ink loses by the time it lies on the paper — deep
    // ink is seen through more water, so it fades into it.
    haze: 0.55,
    // How fast sunk ink fades, per second — slower than surface ink
    // (densityDissipation), so a stroke is seen all the way down to the paper.
    fade: 0.07,
    // Dark mode: how solid sunk ink looks next to surface ink. Lit from above
    // in dark water, a full-strength cloud read as glowing smoke.
    darkCover: 0.6,
  },

  // — The ink's shadow on the paper —
  // blur = softness per unit of depth — a shadow falling further lands softer,
  // so depth.floor alone sets how deep it all looks. strength = how dark it gets.
  // neutral: 0 = shadow tinted like the ink, 1 = plain grey. Mostly grey is
  // what reads as a shadow rather than as more ink.
  // fill: share of the light that still reaches the paper under even the
  // thickest ink (skylight from around it) — keeps shadows soft grey, never black.
  // glow: dark mode's shadow — the faint coloured light the ink scatters onto
  // the paper below (a shadow can't show on dark water).
  shadow: { blur: 0.1, strength: 0.45, neutral: 0.8, fill: 0.45, glow: 0.15 },

  // — The water surface (driven by the flow; flat when the water is still) —
  // height: pressure → surface height. refraction: how far a ripple shifts the
  // ink riding just under it. wobble: how strongly ripples bend the view of the
  // paper below (1 = real water). caustics: light focused by the moving
  // surface onto the paper. glint: light caught on tilted ripples.
  // 0.12 was the sweet spot of a 0.1 / 0.5 / 2 sweep: wet and lensed. By 0.5
  // it looks like wet plastic; by 2 the solver's noise shows as grain.
  // Refraction stays small: a vortex's pressure dip is deep, so a strong lens
  // magnifies each clear core into a white "eye" and turns spirals into rings
  // (visible by 0.02, creeping in at 0.014). 0.008 keeps the spiral intact
  // while the surface still visibly moves.
  surface: {
    height: 0.12,
    refraction: 0.008,
    wobble: 1,
    caustics: 0.35,
    glint: { light: 0.3, dark: 0.6 },
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
