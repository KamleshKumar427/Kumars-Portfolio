import type { Experience } from '../data/experience'
import { Tags } from './ui/Tags'

/** A single role, rendered as a glass dossier record. Used across chapter pages. */
export function RoleRecord({ role }: { role: Experience }) {
  return (
    <article className="mn-role mn-glass">
      <header className="mn-role-head">
        <div className="mn-role-headline">
          <h3 className="mn-role-title">{role.role}</h3>
          <p className="mn-role-org">
            {role.url ? (
              <a href={role.url} target="_blank" rel="noreferrer">
                {role.company}
              </a>
            ) : (
              role.company
            )}{' '}
            · {role.location}
          </p>
        </div>
        <div className="mn-role-meta">
          <span className="mn-role-period">{role.period}</span>
          <span className="mn-role-type">{role.type}</span>
        </div>
      </header>

      <ul className="mn-role-notes">
        {role.highlights.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <Tags items={role.tech} />
    </article>
  )
}
