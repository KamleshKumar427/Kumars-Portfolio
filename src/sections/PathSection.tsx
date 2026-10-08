import { ProofLinks, RecordSlip } from '../components/RecordSlip'
import { Reveal } from '../components/ui/Reveal'
import { education } from '../data/education'

/** Degrees as transcript slips: the story on the left, the figures on a
 *  "Record" slip on the right, with the first proof link in its header. */
export function PathSection() {
  return (
    <section id="education" className="section">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <h2 className="section-title section-title--marked">
                <span className="section-mark" aria-hidden="true">
                  道
                </span>
                Education
              </h2>
            </div>
          </div>
        </Reveal>

        <Reveal stagger>
          {education.map((edu) => {
            const links = edu.links ?? []
            const slip = edu.stats?.length ? edu.stats : null
            // With a slip, the first link moves into its header.
            const ownLinks = slip ? links.slice(1) : links
            return (
              <article className={`slip-item${slip ? '' : ' slip-item--solo'}`} key={edu.degree}>
                <div className="slip-main">
                  <div className="slip-period">{edu.period}</div>
                  <h3 className="slip-title">{edu.degree}</h3>
                  <div className="edu-school">
                    {edu.logo ? (
                      <img
                        className={`edu-logo ${edu.logoTheme === 'mono' ? 'edu-logo--mono' : ''}`}
                        src={edu.logo}
                        alt=""
                        loading="lazy"
                      />
                    ) : null}
                    <span>{edu.school}</span>
                  </div>

                  {edu.focus ? <p className="slip-summary">{edu.focus}</p> : null}

                  {edu.points ? (
                    <div className="work-points">
                      {edu.points.map((point) => (
                        <div className="work-point" key={point}>
                          {point}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {edu.note ? <p className="edu-note">{edu.note}</p> : null}

                  {edu.courses ? (
                    <ul className="tags edu-courses">
                      {edu.courses.map((course) => (
                        <li className="chip" key={course}>
                          {course}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <ProofLinks links={ownLinks} />
                </div>

                {slip ? <RecordSlip stats={slip} link={links[0]} /> : null}
              </article>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
