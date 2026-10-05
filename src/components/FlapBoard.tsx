import { useEffect, useMemo, useRef, useState } from 'react'
import { highlights } from '../data/highlights'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Width of the board, in characters. Sized to the longest value. */
export const FLAP_CELLS = 11

/** What an unsettled cell cycles through. No space: a rolling cell always
 *  shows something, so the board never looks like it has dropped a character. */
const ROLL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%+/.'

const TICK_MS = 55
/** every cell rolls at least this long before the first one can land */
const LEAD_TICKS = 4
/** each cell lands one tick after the cell to its left */
const STAGGER_TICKS = 1
const LAST_TICK = LEAD_TICKS + (FLAP_CELLS - 1) * STAGGER_TICKS
/** how long a settled value stays up before the next one rolls in */
const HOLD_TICKS = Math.round(2800 / TICK_MS)

const BLANK = Array<string>(FLAP_CELLS).fill(' ')

type Board = {
  label: string
  cells: string[]
  /** cells left of this have landed; the rest are still spinning */
  landed: number
}

function toCells(value: string) {
  return value.toUpperCase().slice(0, FLAP_CELLS).padEnd(FLAP_CELLS, ' ').split('')
}

function randomChar() {
  return ROLL_CHARS[(Math.random() * ROLL_CHARS.length) | 0]
}

/**
 * Airport-board line under the hero headline: a label on the left, and a value
 * that flips over character by character, left to right.
 *
 * One interval drives everything — the roll and the pause between values — so
 * going off screen or into a background tab freezes the board mid-flip and
 * picks it up from there instead of restarting it.
 *
 * Label and value live in one piece of state on purpose. Driving the label
 * straight off the index instead left a tick where the new label sat beside
 * the old, still-settled value, long enough to read the wrong pairing.
 *
 * The board itself is hidden from screen readers, because a value that
 * rewrites itself every 55ms is noise to read aloud. They get the whole list
 * at once from the static one above it instead.
 */
export function FlapBoard() {
  const reduced = useReducedMotion()
  const hostRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const [index, setIndex] = useState(0)

  const item = highlights[index % highlights.length]
  const target = useMemo(() => toCells(item.value), [item.value])

  // Starts empty so the first value flaps in rather than appearing and then
  // immediately re-rolling itself.
  const [board, setBoard] = useState<Board>({ label: item.label, cells: BLANK, landed: 0 })

  // A board nobody is looking at should not be spinning.
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    let onScreen = true
    const sync = () => {
      pausedRef.current = !onScreen || document.hidden
    }
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  const label = item.label
  useEffect(() => {
    let tick = 0
    const id = window.setInterval(
      () => {
        if (pausedRef.current) return
        tick += 1

        // Reduced motion cuts straight to the value and waits there.
        if (reduced) {
          setIndex((i) => i + 1)
          return
        }

        if (tick <= LAST_TICK) {
          const landed = Math.min(FLAP_CELLS, Math.max(0, tick - LEAD_TICKS + 1))
          setBoard({
            label,
            landed,
            cells: target.map((ch, i) => (i < landed ? ch : randomChar())),
          })
        } else if (tick >= LAST_TICK + HOLD_TICKS) {
          setIndex((i) => i + 1)
        }
      },
      reduced ? (LAST_TICK + HOLD_TICKS) * TICK_MS : TICK_MS,
    )
    return () => window.clearInterval(id)
  }, [target, label, reduced])

  // With reduced motion there is no roll to read from, so the value is shown
  // settled as soon as it changes.
  const shown: Board = reduced ? { label, cells: target, landed: FLAP_CELLS } : board

  return (
    <div className="flap" ref={hostRef}>
      <ul className="flap-readable">
        {highlights.map((h) => (
          <li key={h.label}>
            {h.label}: {h.value}
          </li>
        ))}
      </ul>

      <p className="flap-line" aria-hidden="true">
        <span className="flap-label" key={shown.label}>
          {shown.label}
        </span>
        <span className="flap-cells">
          {shown.cells.map((ch, i) => (
            <span
              /* positional: cell 3 is cell 3 whatever character is in it */
              key={i}
              className={
                'flap-cell' +
                (ch === ' ' ? ' is-blank' : '') +
                (i < shown.landed ? '' : ' is-rolling')
              }
            >
              {ch}
            </span>
          ))}
        </span>
      </p>
    </div>
  )
}
