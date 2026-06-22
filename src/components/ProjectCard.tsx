import type { Project } from '../data/projects'
import { Tags } from './ui/Tags'

/** A personal build, rendered as a glass card. Used in the Lab chapter. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="mn-card mn-glass">
      <h3 className="mn-card-title">{project.title}</h3>
      <p className="mn-card-desc">{project.description}</p>
      <Tags items={project.tools} />
      {project.github && (
        <a className="mn-card-link" href={project.github} target="_blank" rel="noreferrer">
          view on github ↗
        </a>
      )}
    </article>
  )
}
