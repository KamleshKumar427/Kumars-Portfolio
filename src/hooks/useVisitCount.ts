import { useEffect, useState } from 'react'

/**
 * The counter Worker's URL, printed by `npx wrangler deploy`
 * (see workers/visits/README.md). Empty means the footer shows no number and
 * nothing is requested, so the site is never waiting on a counter that isn't
 * there yet.
 */
const ENDPOINT = 'https://kamleshkumar-visits.kamleshkumar.workers.dev'

/** One visit per browser per day: a reload is not a new visitor. */
const SEEN = 'kk-visit'
const today = () => new Date().toISOString().slice(0, 10)

/** Only the live site counts. A dev server or the screenshot script still
 *  shows the number, so the footer can be checked, but never adds to it. */
const LIVE = ['kamleshkumar.eu', 'www.kamleshkumar.eu']

/**
 * The number of visits the site has counted, or null while it is unknown.
 * Null is also what a blocked request, an offline visitor or a private window
 * gets, and the footer simply leaves the line out: a counter is not worth a
 * broken-looking page.
 */
export function useVisitCount(): number | null {
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    if (!ENDPOINT) return
    let live = true

    // Reading localStorage throws in some private windows, which is a fine
    // reason to skip the dedupe but not to skip the count.
    let counted = false
    try {
      counted = localStorage.getItem(SEEN) === today()
    } catch {
      // a private window can refuse storage: count the visit rather than skip it
    }

    const count = !counted && LIVE.includes(location.hostname)
    fetch(count ? `${ENDPOINT}/hit` : ENDPOINT)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { total?: number } | null) => {
        if (!live || typeof data?.total !== 'number') return
        setTotal(data.total)
        if (!count) return
        try {
          localStorage.setItem(SEEN, today())
        } catch {
          // no dedupe in this browser; the count is still right for today
        }
      })
      .catch(() => {
        // offline, blocked by an extension, or the Worker is down
      })

    return () => {
      live = false
    }
  }, [])

  return total
}
