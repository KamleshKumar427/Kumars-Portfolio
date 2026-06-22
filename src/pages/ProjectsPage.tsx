import { RouteHero } from '../components/RouteHero'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { ChapterPager } from '../components/ChapterPager'
import { ProjectCard } from '../components/ProjectCard'
import { KoiPondSection } from '../pond/KoiPondSection'
import { projects } from '../data/projects'

/**
 * Chapter 03 · Lab (/projects) — technical range. The "Feed my pet" koi pond (§8)
 * is the interactive centerpiece; the selected builds give it substance.
 */
export function ProjectsPage() {
  return (
    <>
      <RouteHero
        eyebrow="03 · lab"
        title={
          <>
            The <span className="hero-name-family">lab</span>
          </>
        }
        lead="Personal builds and technical range — a sub-second JSON search engine, fine-tuned language models, computer vision, and a Snake game in x86 assembly."
      />

      {/* §8 Fish, realized: feed the koi, then read on. */}
      <KoiPondSection />

      <Section>
        <Reveal className="mn-lede">
          <Eyebrow>03 · lab — selected builds</Eyebrow>
          <p className="mn-lede-statement">
            Range, from a <em>sub-second</em> search engine over 6&nbsp;GB of data to a Snake
            game written in x86 assembly.
          </p>
        </Reveal>

        <Reveal stagger className="mn-cards">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </Reveal>
      </Section>

      <ChapterPager from="/projects" />
    </>
  )
}
