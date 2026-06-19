import { RouteHero } from '../components/RouteHero'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { GlassPanel } from '../components/ui/GlassPanel'
import { ChapterPager } from '../components/ChapterPager'

/**
 * Chapter 02 · Venture (/startup) — real route, scaffold body. Full content
 * (XSTRYV + founder community) lands once the chapter-01 template is approved.
 */
export function StartupPage() {
  return (
    <>
      <RouteHero
        eyebrow="02 · venture"
        title={
          <>
            Built <span className="hero-name-family">solo</span>
          </>
        }
        lead="XSTRYV — a live recruitment platform of 1,600+ users and 250+ companies, run end to end by one engineer. Plus the founder community around it."
      />

      <Section>
        <Reveal className="mn-lede">
          <Eyebrow>02 · venture — scaffold</Eyebrow>
        </Reveal>
        <Reveal>
          <GlassPanel className="mn-scaffold">
            <p className="mn-lede-statement">
              Chapter 02 scaffold. XSTRYV ownership story, messaging/CRON system, the
              race-condition fix, and founder community (Slush, UN Millennium) build out here
              to the chapter-01 template.
            </p>
          </GlassPanel>
        </Reveal>
      </Section>

      <ChapterPager from="/startup" />
    </>
  )
}
