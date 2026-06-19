import { RouteHero } from '../components/RouteHero'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { GlassPanel } from '../components/ui/GlassPanel'
import { ChapterPager } from '../components/ChapterPager'

/**
 * Chapter 03 · Lab (/projects) — real route, scaffold body. Primary home of the
 * Fish companion (§8); the RouteHero already reserves its water-layer seam.
 * Full content (personal builds, technical range) lands after template approval.
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

      <Section>
        <Reveal className="mn-lede">
          <Eyebrow>03 · lab — scaffold</Eyebrow>
        </Reveal>
        <Reveal>
          <GlassPanel className="mn-scaffold">
            <p className="mn-lede-statement">
              Chapter 03 scaffold. Personal projects build out here to the chapter-01 template.
              This chapter is the Fish companion’s home — the seam is reserved in the hero’s
              water layer.
            </p>
          </GlassPanel>
        </Reveal>
      </Section>

      <ChapterPager from="/projects" />
    </>
  )
}
