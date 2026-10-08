import type { Figure } from './Figures'

export type ProofLink = { label: string; href: string }

type RecordSlipProps = {
  stats: readonly Figure[]
  /** The item's first proof link, shown in the slip's header. */
  link?: ProofLink
}

/**
 * The "Record" slip beside an education entry or an honour: its figures as a
 * transcript, label on the left, value on the right, joined by a dotted
 * leader. "Record" is a UI label, not data.
 */
export function RecordSlip({ stats, link }: RecordSlipProps) {
  return (
    <aside className="record">
      <div className="record-head">
        <span className="record-title">Record</span>
        {link ? (
          <a className="record-link" href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label} ↗
          </a>
        ) : null}
      </div>
      <dl className="record-rows">
        {stats.map((stat) => (
          <div className="record-row" key={stat.label}>
            <dt className="record-label">{stat.label}</dt>
            <span className="record-leader" aria-hidden="true" />
            <dd className="record-value">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

/** Proof links in the item's own column (all but the one in the slip). */
export function ProofLinks({ links }: { links: readonly ProofLink[] }) {
  if (!links.length) return null
  return (
    <div className="proof-links">
      {links.map((link) => (
        <a className="proof-link" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
          {link.label} ↗
        </a>
      ))}
    </div>
  )
}
