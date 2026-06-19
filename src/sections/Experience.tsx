import { Section } from '../components/Section'
import { TagList } from '../components/TagList'
import { experience, volunteer } from '../data/experience'

export function Experience() {
  return (
    <Section
      id="experience"
      logKey="EXPERIENCE"
      title="Production deployments"
      subtitle="Remote roles on payment infrastructure and Apache AGE ecosystem work."
      raised
    >
      <div className="deploy-list">
        {experience.map((job) => (
          <article key={job.company} className="deploy-record">
            <div className="deploy-record-aside">
              <time className="deploy-record-period">{job.period}</time>
              <span className="deploy-record-type">{job.type}</span>
            </div>
            <div className="deploy-record-main">
              <h3 className="deploy-record-role">{job.role}</h3>
              <p className="deploy-record-org">
                {job.company} · {job.location}
              </p>
              <ul className="deploy-record-notes">
                {job.highlights.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
              <TagList items={job.tech} />
            </div>
          </article>
        ))}
      </div>

      <div className="deploy-aside-block">
        <h3 className="deploy-aside-heading">Volunteer</h3>
        <div className="deploy-aside-list">
          {volunteer.map((entry) => (
            <article key={entry.org} className="deploy-aside-item">
              <time>{entry.period}</time>
              <h4>
                {entry.role}
                {entry.link ? (
                  <>
                    {' — '}
                    <a href={entry.link} target="_blank" rel="noreferrer">
                      {entry.org}
                    </a>
                  </>
                ) : (
                  <> — {entry.org}</>
                )}
              </h4>
              <p>{entry.description}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}
