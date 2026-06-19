import { Link } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { Reveal } from './ui/Reveal'
import { Eyebrow } from './ui/Eyebrow'

/**
 * The cover's table of contents — primary navigation of the dossier. A numbered
 * list (00–04) in Meniscus glass; each chapter is a page to turn to. The cover
 * itself (00) is marked "you are here" and is not a link.
 */
export function ChapterIndex() {
  return (
    <div>
      <Reveal className="mn-toc-eyebrow">
        <Eyebrow>contents · the dossier</Eyebrow>
      </Reveal>

      <Reveal stagger className="mn-toc mn-glass">
        {chapters.map((chapter) => {
          const isCover = chapter.route === '/'
          const body = (
            <>
              <span className="mn-toc-n">{chapter.n}</span>
              <span className="mn-toc-body">
                <span className="mn-toc-titlerow">
                  <span className="mn-toc-title">{chapter.title}</span>
                  <span className="mn-toc-audience">{isCover ? 'you are here' : chapter.audience}</span>
                </span>
                <span className="mn-toc-summary">{chapter.summary}</span>
              </span>
              <span className="mn-toc-arrow" aria-hidden="true">
                {isCover ? '·' : '→'}
              </span>
            </>
          )

          if (isCover) {
            return (
              <div key={chapter.n} className="mn-toc-row is-current" aria-current="page">
                {body}
              </div>
            )
          }

          return (
            <Link
              key={chapter.n}
              to={chapter.route}
              className="mn-toc-row"
              aria-label={`Chapter ${chapter.n} — ${chapter.title}: ${chapter.summary}`}
            >
              {body}
            </Link>
          )
        })}
      </Reveal>
    </div>
  )
}
