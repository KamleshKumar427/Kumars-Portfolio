import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  logKey: string
  title: string
  subtitle?: string
  children: ReactNode
  raised?: boolean
}

export function Section({ id, logKey, title, subtitle, children, raised }: SectionProps) {
  return (
    <section id={id} className={`record ${raised ? 'record--raised' : ''}`}>
      <div className="record-inner">
        <header className="record-header">
          <p className="record-log">
            <span className="record-log-bracket">[</span>
            {logKey}
            <span className="record-log-bracket">]</span>
          </p>
          <h2 className="record-title">{title}</h2>
          {subtitle && <p className="record-subtitle">{subtitle}</p>}
        </header>
        <div className="record-body">{children}</div>
      </div>
    </section>
  )
}
