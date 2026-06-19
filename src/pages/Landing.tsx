import { Hero } from '../sections/Hero'
import { IndexStatement } from '../sections/IndexStatement'
import { ChapterIndex } from '../components/ChapterIndex'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { GlassPanel } from '../components/ui/GlassPanel'
import { profile } from '../data/profile'

/**
 * Chapter 00 · Index — the cover. NOT a long scroll of every section: it sells
 * the throughline and routes each audience to their chapter. Hero → Index
 * statement → ChapterIndex (the table of contents) → closing CTA.
 */
export function Landing() {
  return (
    <>
      <Hero />
      <IndexStatement />

      <Section id="contents">
        <ChapterIndex />
      </Section>

      <Section id="contact" tight>
        <Reveal>
          <GlassPanel className="mn-cta">
            <Eyebrow>contact · open to roles</Eyebrow>
            <h2 className="mn-cta-title">
              Let’s build something where being&nbsp;wrong is <em>expensive</em>.
            </h2>
            <div className="mn-cta-actions">
              <a href={`mailto:${profile.email}`} className="btn btn-primary">
                Send email
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                LinkedIn
              </a>
            </div>
          </GlassPanel>
        </Reveal>
      </Section>
    </>
  )
}
