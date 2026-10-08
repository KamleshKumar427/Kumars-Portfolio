import type { CSSProperties } from 'react'

export type Figure = { value: string; label: string; href?: string }

type FiguresProps = {
  stats: readonly Figure[]
  /** "ledger": a row of figures under a strong rule (Education, Recognition,
   *  /startups). "margin": a stacked list in the Experience rail. */
  variant?: 'ledger' | 'margin'
  className?: string
}

/**
 * The site's one way of showing a figure: a number set in ink over a short
 * uppercase label, separated by rules rather than boxed. Red stays reserved
 * for the role numbers.
 */
export function Figures({ stats, variant = 'ledger', className }: FiguresProps) {
  if (!stats.length) return null
  const style = { '--figures-n': Math.min(stats.length, 4) } as CSSProperties
  return (
    <ul className={`figures figures--${variant}${className ? ` ${className}` : ''}`} style={style}>
      {stats.map((stat) => (
        <li className="figure" key={stat.label}>
          {stat.href ? (
            <a className="figure-link" href={stat.href} target="_blank" rel="noopener noreferrer">
              <span className="figure-value">{stat.value}</span>
              <span className="figure-label">{stat.label}</span>
            </a>
          ) : (
            <>
              <span className="figure-value">{stat.value}</span>
              <span className="figure-label">{stat.label}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}
