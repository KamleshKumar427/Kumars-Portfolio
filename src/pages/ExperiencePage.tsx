import { RouteHero } from '../components/RouteHero'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { RoleRecord } from '../components/RoleRecord'
import { ChapterPager } from '../components/ChapterPager'
import { experience } from '../data/experience'

const productionRoles = experience.filter((role) => role.theater === 'production')

const metrics = [
  { value: 'PCI DSS L1', label: 'compliance' },
  { value: '€100Ms+', label: 'processed' },
  { value: '+11%', label: 'faster processing' },
  { value: '20+', label: 'currencies' },
]

/**
 * Chapter 01 · Production (/experience) — built fully to Meniscus as the template
 * for the rest. Payment-gateway + open-source database-internals work, in glass.
 */
export function ExperiencePage() {
  return (
    <>
      <RouteHero
        eyebrow="01 · production"
        title={
          <>
            Production, <span className="hero-name-family">at scale</span>
          </>
        }
        lead="Where being wrong is expensive: a PCI-DSS Level 1 payment gateway moving hundreds of millions of euros, and database internals for an open-source graph engine."
      />

      <Section>
        <Reveal className="mn-lede">
          <Eyebrow>01 · production — the brief</Eyebrow>
          <p className="mn-lede-statement">
            Two years on systems where downtime and inconsistency cost real money — owned end
            to end, from merchant integrations to query paths under load.
          </p>
        </Reveal>

        <Reveal stagger className="mn-metrics">
          {metrics.map((metric) => (
            <div key={metric.label} className="mn-metric">
              <span className="mn-metric-value">{metric.value}</span>
              <span className="mn-metric-label">{metric.label}</span>
            </div>
          ))}
        </Reveal>

        <div className="mn-roles">
          {productionRoles.map((role) => (
            <Reveal key={role.company}>
              <RoleRecord role={role} />
            </Reveal>
          ))}
        </div>
      </Section>

      <ChapterPager from="/experience" />
    </>
  )
}
