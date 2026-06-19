/**
 * ════════════════════════════════════════════════════════════════
 *  FISH COMPANION · §8 — RESERVED SEAM. DO NOT BUILD THE FISH HERE.
 *
 *  A small animated fish will swim in the water layer *beneath the glass*.
 *  Mechanic (later): "feed the fish to browse more" — interacting drops
 *  food/ink and nudges the visitor onward. Primary home: the Lab (/projects),
 *  but this mounts in any water surface (RouteHero, the fluid hero, …).
 *
 *  This component intentionally renders an empty, marked, aria-hidden mount
 *  point only — the owner drops the R3F/canvas fish into this slot later.
 *  Keep the data-fish-slot attribute stable; the future fish targets it.
 * ════════════════════════════════════════════════════════════════
 */
export function FishCompanion({ surface = 'water' }: { surface?: string }) {
  return <div className="mn-fish-slot" data-fish-slot={surface} aria-hidden="true" />
}
