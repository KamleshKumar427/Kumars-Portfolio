import { RouteHero } from '../components/RouteHero'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { GlassPanel } from '../components/ui/GlassPanel'

/**
 * /startup — dedicated founder / venture route. Hero placeholder + scaffold body
 * to be filled in a later pass. Structure only for now.
 */
export function StartupPage() {
  return (
    <>
      <RouteHero
        eyebrow="route · /startup"
        title={
          <>
            Building <span className="hero-name-family">from zero</span>
          </>
        }
        lead="Founder-side work: product bets, early architecture, and the trade-offs of moving fast without breaking what matters."
      />

      <Section>
        <Reveal className="mb-8">
          <Eyebrow>startup · scaffold</Eyebrow>
        </Reveal>
        <Reveal>
          <GlassPanel className="p-10 sm:p-14">
            <p className="mn-index-lead">
              Placeholder body for the startup route. Ventures, roles and outcomes will be
              rebuilt here to the Meniscus system.
            </p>
          </GlassPanel>
        </Reveal>
      </Section>
    </>
  )
}
