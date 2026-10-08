import { useRef, useState, type ReactNode } from 'react'

type PagedGridProps = {
  items: ReactNode[]
  /** Items per page: two rows of two. */
  pageSize?: number
  /** What the items are, for the indicators' labels ("courses"). */
  noun: string
  className?: string
}

/**
 * A two-by-two grid whose pages sit side by side on a track and slide.
 * Below it, one line per page: the current one long and in the seal, the
 * others short. Hovering a line (after a short pause, so a pointer passing
 * over it does nothing), clicking it, focusing it or swiping the grid brings
 * that page in. Nothing moves on a timer. The track is as tall as its
 * tallest page, so the content below never jumps.
 */
export function PagedGrid({ items, pageSize = 4, noun, className }: PagedGridProps) {
  const pages: ReactNode[][] = []
  for (let i = 0; i < items.length; i += pageSize) pages.push(items.slice(i, i + pageSize))
  const [page, setPage] = useState(0)
  const hoverTimer = useRef<number | undefined>(undefined)
  const swipeX = useRef<number | null>(null)

  const go = (next: number) => setPage(Math.max(0, Math.min(pages.length - 1, next)))
  const range = (i: number) => {
    const first = i * pageSize + 1
    const last = Math.min(first + pageSize - 1, items.length)
    return first === last ? `${noun} ${first}` : `${noun} ${first} to ${last}`
  }

  return (
    <div className={`paged${className ? ` ${className}` : ''}`}>
      <div
        className="paged-viewport"
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse') swipeX.current = e.clientX
        }}
        onPointerUp={(e) => {
          if (swipeX.current === null) return
          const dx = e.clientX - swipeX.current
          swipeX.current = null
          if (Math.abs(dx) > 50) go(page + (dx < 0 ? 1 : -1))
        }}
      >
        <div className="paged-track" style={{ transform: `translateX(calc(${-page} * (100% + 24px)))` }}>
          {pages.map((group, i) => (
            <div className="paged-grid" key={i} inert={i !== page} aria-hidden={i !== page}>
              {group}
            </div>
          ))}
        </div>
      </div>

      {pages.length > 1 ? (
        <div className="paged-lines" role="group" aria-label={`Browse ${noun}`}>
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`paged-line${i === page ? ' is-active' : ''}`}
              aria-label={`Show ${range(i)}`}
              aria-pressed={i === page}
              onClick={() => go(i)}
              onFocus={() => go(i)}
              onPointerEnter={(e) => {
                if (e.pointerType !== 'mouse') return
                window.clearTimeout(hoverTimer.current)
                hoverTimer.current = window.setTimeout(() => go(i), 140)
              }}
              onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
