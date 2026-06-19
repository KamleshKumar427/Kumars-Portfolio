import { RouteHero } from '../components/RouteHero'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { GlassPanel } from '../components/ui/GlassPanel'

/**
 * /experience — dedicated work-experience route. Hero placeholder + a scaffold
 * body to be filled in a later pass. Structure only for now.
 */
export function ExperiencePage() {
  return (
    <>
      <RouteHero
        eyebrow="route · /experience"
        title={
          <>
            Work, <span className="hero-name-family">in production</span>
          </>
        }
        lead="Payment gateways, database internals, and the systems where uptime is the product. Detailed case records land here."
      />

      <Section>
        <Reveal className="mb-8">
          <Eyebrow>experience · scaffold</Eyebrow>
        </Reveal>
        <Reveal>
          <GlassPanel className="p-10 sm:p-14">
            <p className="mn-index-lead">
              Placeholder body for the work-experience route. Case studies, deployment
              records and impact metrics will be rebuilt here to the Meniscus system.
            </p>
          </GlassPanel>
        </Reveal>
      </Section>
    </>
  )
}
