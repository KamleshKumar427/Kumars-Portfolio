import { ProofLinks, RecordSlip } from '../components/RecordSlip'
import { Reveal } from '../components/ui/Reveal'
import { honours } from '../data/recognition'

/**
 * Recognition and volunteering, in the same transcript-slip layout as
 * Education: the story on the left, the figures on a "Record" slip on the
 * right.
 */
export function RecognitionSection() {
  return (
    <section id="recognition" className="section">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div>
              <h2 className="section-title section-title--marked">
                <span className="section-mark" aria-hidden="true">
                  誉
                </span>
                Recognition
              </h2>
            </div>
          </div>
        </Reveal>

        <Reveal stagger>
          {honours.map((honour) => {
            const links = honour.links ?? []
            const slip = honour.stats.length ? honour.stats : null
            const ownLinks = slip ? links.slice(1) : links
            return (
              <article className={`slip-item${slip ? '' : ' slip-item--solo'}`} key={honour.title}>
                <div className="slip-main">
                  <div className="slip-kicker">
                    {honour.kind} · {honour.period}
                  </div>
                  <h3 className="slip-title slip-title--honour">{honour.title}</h3>
                  <div className="slip-org">{honour.org}</div>
                  <p className="slip-summary">{honour.summary}</p>

                  {honour.points.length ? (
                    <div className="work-points">
                      {honour.points.map((point) => (
                        <div className="work-point" key={point}>
                          {point}
                        </div>
                      ))}
                    </div>
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
