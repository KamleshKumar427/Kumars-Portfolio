import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { nextChapter } from '../data/chapters'
import { Container } from './ui/Container'
import { ease, duration } from '@/lib/motion'

/**
 * "Next chapter →" pager at the foot of each chapter page — turning the page.
 * Hover micro-state is Motion (interaction → Motion). Renders nothing on the
 * last chapter.
 */
export function ChapterPager({ from }: { from: string }) {
  const next = nextChapter(from)
  if (!next) return null

  return (
    <Container className="mn-pager-wrap">
      <Link to={next.route} className="mn-pager" aria-label={`Next chapter — ${next.n} ${next.title}`}>
        <motion.div
          className="mn-pager-inner mn-glass"
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          <span className="mn-pager-label">next chapter</span>
          <span className="mn-pager-title">
            <span className="mn-pager-n">{next.n}</span>
            {next.title}
          </span>
          <span className="mn-pager-summary">{next.summary}</span>
          <motion.span
            className="mn-pager-arrow"
            aria-hidden="true"
            variants={{ rest: { x: 0 }, hover: { x: 10 } }}
            transition={{ duration: duration.micro, ease: ease.water }}
          >
            →
          </motion.span>
        </motion.div>
      </Link>
    </Container>
  )
}
