import { SkillIcon } from '../components/SkillIcon'
import { Reveal } from '../components/ui/Reveal'
import { skills } from '../data/skills'

/**
 * Tools & Materials, as a band of its own. It used to sit inside Education
 * behind a hairline, which left it with no background of its own and broke
 * the page's plain / tinted alternation.
 */
export function SkillsSection() {
  return (
    <section id="skills" className="section section--alt">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="section-kicker">器 — Skills</div>
              <h2 className="section-title">Tools &amp; Materials</h2>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="skills skills--grid">
            {skills.map((group) => (
              <div key={group.label}>
                <div className="skill-label">{group.label}</div>
                <ul className="tags">
                  {group.items.map((item) => (
                    <li className="chip skill-chip" key={item}>
                      <SkillIcon name={item} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
