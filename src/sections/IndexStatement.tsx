import { profile } from '../data/profile'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'

/**
 * Index — the opening statement after the hero. Large, confident serif claim
 * paired with a quiet lead and three telemetry metrics. First section rebuilt
 * to the Meniscus system: glass metrics, generous rhythm, "ink bloom" reveals.
 */
export function IndexStatement() {
  return (
    <Section id="index">
      <Reveal className="mb-8 sm:mb-12">
        <Eyebrow>index · 00 — {profile.location.toLowerCase()}</Eyebrow>
      </Reveal>

      <div className="mn-index">
        <Reveal>
          <h2 className="mn-index-statement">
            I build software where failure is <em>expensive</em>—and make it hold.
          </h2>
        </Reveal>

        <div className="mn-index-aside">
          <Reveal delay={0.05}>
            <p className="mn-index-lead">{profile.summary}</p>
          </Reveal>

          <Reveal stagger className="mn-index-metrics">
            {profile.metrics.map((metric) => (
              <div key={metric.label} className="mn-metric">
                <span className="mn-metric-value">{metric.value}</span>
                <span className="mn-metric-label">{metric.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
