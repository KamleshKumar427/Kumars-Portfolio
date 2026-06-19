import { Section } from '../components/Section'
import { TagList } from '../components/TagList'
import { projects } from '../data/projects'

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function Projects() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <Section
      id="projects"
      logKey="PROJECTS"
      title="Selected repositories and builds"
      subtitle="Payment integrations, graph database tooling, ML pipelines, and low-level systems."
    >
      <div className="repo-list">
        {featured.map((project) => (
          <ProjectEntry key={project.title} project={project} featured />
        ))}
        {rest.map((project) => (
          <ProjectEntry key={project.title} project={project} />
        ))}
      </div>
    </Section>
  )
}

function ProjectEntry({
  project,
  featured,
}: {
  project: (typeof projects)[number]
  featured?: boolean
}) {
  const path = `~/work/${slugify(project.title)}`
  const className = `repo-entry ${featured ? 'repo-entry--featured' : ''}`

  const body = (
    <>
      <div className="repo-entry-head">
        <code className="repo-entry-path">{path}</code>
        {project.github && <span className="repo-entry-arrow" aria-hidden="true">→</span>}
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <TagList items={project.tools} className="tag-list--mono" />
    </>
  )

  if (project.github) {
    return (
      <a href={project.github} target="_blank" rel="noreferrer" className={className}>
        {body}
      </a>
    )
  }

  return <article className={className}>{body}</article>
}
