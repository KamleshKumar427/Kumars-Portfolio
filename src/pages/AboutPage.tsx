import { RouteHero } from '../components/RouteHero'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { GlassPanel } from '../components/ui/GlassPanel'
import { ChapterPager } from '../components/ChapterPager'

/**
 * Chapter 04 · Profile (/about) — real route, scaffold body. Full content
 * (education, skills matrix, certifications, contact) lands after template approval.
 */
export function AboutPage() {
  return (
    <>
      <RouteHero
        eyebrow="04 · profile"
        title={
          <>
            The <span className="hero-name-family">person</span>
          </>
        }
        lead="MSc Computer Science at the University of Helsinki (5/5), a BSc from NUST, a skills matrix, certifications — and how to get in touch."
      />

      <Section>
        <Reveal className="mn-lede">
          <Eyebrow>04 · profile — scaffold</Eyebrow>
        </Reveal>
        <Reveal>
          <GlassPanel className="mn-scaffold">
            <p className="mn-lede-statement">
              Chapter 04 scaffold. Education, the skills matrix, certifications, and contact
              build out here to the chapter-01 template.
            </p>
          </GlassPanel>
        </Reveal>
      </Section>

      <ChapterPager from="/about" />
    </>
  )
}
