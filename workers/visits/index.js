/**
 * Visit counter for kamleshkumar.eu.
 *
 * The site is static on GitHub Pages, so this Worker is the only piece with
 * state: one integer in KV. It stores nothing about anyone, no IP, no cookie,
 * no user agent, so it needs no consent banner and there is nothing to leak.
 * Whether a visit counts at all is decided in the browser (once per day per
 * browser, see src/hooks/useVisitCount.ts).
 *
 *   GET /      read the total
 *   GET /hit   count this visit, then read the total
 *
 * KV is eventually consistent and last write wins, so two visits landing in
 * the same instant can count as one, and a fresh number can take a minute to
 * reach every edge. For a line in a footer that is fine, and it keeps this to
 * one binding with no schema to migrate.
 */

/** Only the site may read the counter, so a stray page cannot drive it up.
 *  Any local port is allowed too: the dev server and the screenshot script
 *  pick their own, and both only ever read (see useVisitCount). */
const SITE = ['https://kamleshkumar.eu', 'https://www.kamleshkumar.eu']
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/
const allowed = (origin) => SITE.includes(origin) || LOCAL.test(origin)

const KEY = 'total'

/** Crawlers would make the number meaningless, and most of them say so. */
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|embed|preview|monitor|curl|wget|headless|lighthouse/i

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') ?? ''
    const headers = {
      'access-control-allow-origin': allowed(origin) ? origin : SITE[0],
      'access-control-allow-methods': 'GET, OPTIONS',
      'content-type': 'application/json',
      'cache-control': 'no-store',
      vary: 'origin',
    }

    if (request.method === 'OPTIONS') return new Response(null, { headers })
    if (request.method !== 'GET') {
      return new Response('{"error":"method not allowed"}', { status: 405, headers })
    }

    let total = Number(await env.VISITS.get(KEY)) || 0

    const counting = new URL(request.url).pathname === '/hit'
    const isBot = BOT.test(request.headers.get('user-agent') ?? '')
    if (counting && !isBot) {
      total += 1
      await env.VISITS.put(KEY, String(total))
    }

    return new Response(JSON.stringify({ total }), { headers })
  },
}
