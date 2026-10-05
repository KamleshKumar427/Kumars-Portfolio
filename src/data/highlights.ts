/**
 * The one-line highlights that cycle under the hero headline, on a split-flap
 * board. Each one is already stated (and evidenced) further down the page —
 * this is the trailer, not the claim.
 *
 * Keep values at or under FLAP_CELLS characters in src/components/FlapBoard.tsx,
 * or they get cut. Keep them true: every line below traces to a section.
 */
export type Highlight = {
  /** small label in the left column */
  label: string
  /** the part that flips; rendered in upper case */
  value: string
}

export const highlights: Highlight[] = [
  { label: 'Payments', value: 'PCI DSS L1' }, // Datapulse, experience
  { label: 'Currencies', value: '20+' }, // Datapulse, about
  { label: 'Processing', value: '11% faster' }, // Datapulse, about
  { label: 'At XSTRYV', value: '67 commits' }, // experience stats
  { label: 'UN fellow', value: 'Top 9%' }, // recognition stats
  { label: 'MSc grade', value: '4.9 / 5' }, // education stats
  { label: 'Open to', value: 'Full-stack' }, // glance — see profile.availability
]
