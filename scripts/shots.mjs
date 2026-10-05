#!/usr/bin/env node
/**
 * Screenshots of the site, section by section, so a change can be looked at
 * before anyone calls it done.
 *
 *   npm run shots                          every section of /, desktop + phone, light + dark
 *   npm run shots -- about experience      only these section ids
 *   npm run shots -- --page /startups      another route
 *   npm run shots -- --only desktop-light  one viewport/theme pair (also: phone, dark, ...)
 *   npm run shots -- --text                also write the visible text of each section
 *   npm run shots -- --full                also one full-page image per viewport and theme
 *   npm run shots -- --motion              real motion (scroll reveals, live ink, pond pin)
 *   npm run shots -- --url http://localhost:5173   use a server that's already running
 *
 * Images go to .claude/shots/<page>/<viewport>-<theme>/ (gitignored). The
 * first image, 00-fold.png, is exactly what a visitor sees on arrival. Tall
 * sections are cut into screen-height slices so the text stays readable.
 *
 * By default the page runs with prefers-reduced-motion, so every section is
 * visible without scrolling through the reveals, and the hero shows its still
 * fallback instead of the live ink. Use --motion to see the real thing.
 *
 * The run also reports what a visitor would trip over: console errors, failed
 * requests, broken images, sideways scroll, and text smaller than 12px.
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
}
const THEMES = ['light', 'dark']

const HELP = `Usage: npm run shots -- [section ids] [--page /path] [--only desktop-light,phone]
                      [--text] [--full] [--motion] [--url http://localhost:5173] [--out dir]`

function parseArgs(argv) {
  const opts = { ids: [], page: '/', url: null, text: false, full: false, motion: false, only: null, out: '.claude/shots' }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--page') opts.page = argv[++i]
    else if (a === '--url') opts.url = argv[++i]
    else if (a === '--only') opts.only = argv[++i]
    else if (a === '--out') opts.out = argv[++i]
    else if (a === '--text') opts.text = true
    else if (a === '--full') opts.full = true
    else if (a === '--motion') opts.motion = true
    else if (a === '-h' || a === '--help') opts.help = true
    else if (a.startsWith('-')) throw new Error(`Unknown option ${a}\n${HELP}`)
    else opts.ids.push(a.replace(/^#/, ''))
  }
  if (!opts.page.startsWith('/')) opts.page = `/${opts.page}`
  return opts
}

function combos(only) {
  const all = []
  for (const vp of Object.keys(VIEWPORTS)) for (const theme of THEMES) all.push({ vp, theme, name: `${vp}-${theme}` })
  if (!only) return all
  const wanted = only.split(',').map((s) => s.trim()).filter(Boolean)
  const picked = all.filter((c) => wanted.some((w) => w === c.name || w === c.vp || w === c.theme))
  if (!picked.length) throw new Error(`--only ${only} matches nothing. Use desktop, phone, light, dark or e.g. desktop-light.`)
  return picked
}

const pageSlug = (p) => (p === '/' ? 'home' : p.replace(/^\/+|\/+$/g, '').replace(/[^\w-]+/g, '-') || 'home')

async function startServer() {
  const { createServer } = await import('vite')
  const server = await createServer({
    root,
    logLevel: 'error',
    clearScreen: false,
    server: { port: 5290, strictPort: false, open: false },
  })
  await server.listen()
  const url = server.resolvedUrls?.local?.[0]
  if (!url) throw new Error('Vite started but reported no local URL.')
  return { url, close: () => server.close() }
}

async function launchBrowser() {
  const { chromium } = await import('playwright-core')
  try {
    return await chromium.launch({ channel: 'chrome', headless: true })
  } catch (chromeError) {
    try {
      return await chromium.launch({ headless: true })
    } catch {
      throw new Error(
        `Couldn't start a browser. Install Google Chrome, or run "npx playwright install chromium".\n${chromeError.message}`,
      )
    }
  }
}

/** Everything a visitor would trip over, measured on the loaded page. */
function measureHealth() {
  const vw = document.documentElement.clientWidth
  const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - vw
  const describe = (el) =>
    el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : '')

  let overflowing = []
  if (overflow > 0) {
    const wide = [...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > vw + 1)
    // Keep the outermost offenders only; their children overflow because they do.
    overflowing = wide.filter((el) => !wide.includes(el.parentElement)).slice(0, 4).map(describe)
  }

  const broken = [...document.images]
    .filter((img) => img.complete && img.naturalWidth === 0 && (img.currentSrc || img.src))
    .map((img) => img.currentSrc || img.src)

  const small = []
  const seen = new Set()
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    const el = node.parentElement
    const text = node.textContent.trim()
    if (!el || !text || seen.has(el)) continue
    seen.add(el)
    if (el.closest('[aria-hidden="true"], script, style, noscript')) continue
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) continue
    const size = parseFloat(cs.fontSize)
    if (size < 12) small.push(`${size}px "${text.slice(0, 32)}" (${describe(el)})`)
  }
  return { overflow, overflowing, broken, small }
}

/** Top-level sections in reading order, plus the footer. */
function listSections() {
  const tops = [...document.querySelectorAll('main section')].filter((s) => !s.parentElement.closest('section'))
  const footer = document.querySelector('body footer')
  const els = footer ? [...tops, footer] : tops
  return els.map((el, i) => {
    const r = el.getBoundingClientRect()
    return {
      // Sections without an id (the koi pond, the /startups hero) go by their first class.
      id: el.id || (el.tagName === 'FOOTER' ? 'footer' : el.classList[0] || `section-${i + 1}`),
      top: Math.round(r.top + window.scrollY),
      height: Math.round(r.height),
      text: el.innerText.trim(),
    }
  })
}

async function settle(page, motion) {
  await page.evaluate(
    () =>
      Promise.all(
        [...document.images]
          .filter((img) => !img.complete)
          .map((img) => new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true })
            img.addEventListener('error', resolve, { once: true })
            setTimeout(resolve, 3000)
          })),
      ),
  )
  await page.waitForTimeout(motion ? 1300 : 120)
}

async function scrollTo(page, y) {
  return page.evaluate((target) => {
    if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true, force: true })
    else window.scrollTo(0, target)
    return window.scrollY
  }, y)
}

async function clearOld(dir, ids) {
  let files = []
  try {
    files = await readdir(dir)
  } catch {
    return
  }
  const stale = files.filter((f) => f.endsWith('.png') && (!ids.length || ids.some((id) => new RegExp(`^\\d\\d-${id}(-\\d+)?\\.png$`).test(f))))
  await Promise.all(stale.map((f) => rm(path.join(dir, f))))
}

async function shoot(browser, base, opts, combo, wantText) {
  const { vp, theme, name } = combo
  const { viewport } = VIEWPORTS[vp]
  const context = await browser.newContext({
    ...VIEWPORTS[vp],
    colorScheme: theme,
    reducedMotion: opts.motion ? 'no-preference' : 'reduce',
  })
  // The site reads its theme from localStorage before React mounts (index.html).
  await context.addInitScript((t) => {
    try {
      localStorage.setItem('theme', t)
    } catch {
      /* private mode: the page falls back to light */
    }
  }, theme)

  const page = await context.newPage()
  const problems = []
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`console: ${m.text().slice(0, 200)}`)
  })
  page.on('pageerror', (e) => problems.push(`page error: ${e.message.slice(0, 200)}`))
  page.on('response', (r) => {
    if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`)
  })
  page.on('requestfailed', (r) => {
    const reason = r.failure()?.errorText ?? ''
    if (!/ERR_ABORTED/.test(reason)) problems.push(`request failed: ${r.url()} (${reason})`)
  })

  await page.goto(new URL(opts.page, base).href, { waitUntil: 'networkidle', timeout: 90_000 })
  await page.evaluate(() => document.fonts?.ready)
  await page.waitForTimeout(opts.motion ? 2500 : 500)

  const dir = path.join(root, opts.out, pageSlug(opts.page), name)
  await mkdir(dir, { recursive: true })
  await clearOld(dir, opts.ids)
  const written = []

  // What a visitor sees on arrival, header and all.
  if (!opts.ids.length || opts.ids.includes('fold')) {
    const file = path.join(dir, '00-fold.png')
    await page.screenshot({ path: file })
    written.push(file)
  }

  // Sections are shot without the fixed header, which would otherwise cover
  // the top of every slice.
  await page.addStyleTag({ content: 'header.nav, .nav { visibility: hidden !important; }' })

  const sections = await page.evaluate(listSections)
  const unknown = opts.ids.filter((id) => id !== 'fold' && !sections.some((s) => s.id === id))
  const chosen = opts.ids.length ? sections.filter((s) => opts.ids.includes(s.id)) : sections

  for (const [index, section] of sections.entries()) {
    if (!chosen.includes(section)) continue
    const n = String(index + 1).padStart(2, '0')
    const slices = Math.max(1, Math.ceil(section.height / viewport.height - 0.15))
    const sliceHeight = Math.ceil(section.height / slices)
    for (let s = 0; s < slices; s++) {
      const want = section.top + s * sliceHeight
      const actual = await scrollTo(page, want)
      await settle(page, opts.motion)
      const offset = want - actual
      const height = Math.min(sliceHeight, section.height - s * sliceHeight, viewport.height - offset)
      if (height <= 0) continue
      const file = path.join(dir, `${n}-${section.id}${slices > 1 ? `-${s + 1}` : ''}.png`)
      await page.screenshot({ path: file, clip: { x: 0, y: offset, width: viewport.width, height } })
      written.push(file)
    }
  }

  if (opts.full) {
    await scrollTo(page, 0)
    const file = path.join(dir, 'full.png')
    await page.screenshot({ path: file, fullPage: true })
    written.push(file)
  }

  const health = await page.evaluate(measureHealth)

  let textFile = null
  if (wantText) {
    textFile = path.join(root, opts.out, pageSlug(opts.page), 'text.md')
    const body = chosen.map((s) => `## ${s.id}\n\n${s.text}\n`).join('\n')
    await writeFile(textFile, `# Visible text of ${opts.page}\n\n${body}`)
  }

  await context.close()
  return { name, written, problems: [...new Set(problems)], health, unknown, textFile, sections: sections.map((s) => s.id) }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help) {
    console.log(HELP)
    return
  }

  const server = opts.url ? null : await startServer()
  const base = opts.url ?? server.url
  const browser = await launchBrowser()
  const results = []
  try {
    for (const [i, combo] of combos(opts.only).entries()) {
      results.push(await shoot(browser, base, opts, combo, opts.text && i === 0))
    }
  } finally {
    await browser.close()
    await server?.close()
  }

  const rel = (f) => path.relative(root, f)
  console.log(`Screenshots of ${opts.page} (${opts.motion ? 'real motion' : 'reduced motion'})`)
  console.log(`Sections on the page: ${results[0]?.sections.join(', ')}`)
  for (const r of results) {
    console.log(`\n${r.name}:`)
    for (const f of r.written) console.log(`  ${rel(f)}`)
    if (r.textFile) console.log(`  ${rel(r.textFile)}`)
  }

  console.log('\nChecks:')
  let clean = true
  const unknown = results[0]?.unknown ?? []
  if (unknown.length) {
    clean = false
    console.log(`  No section with id: ${unknown.join(', ')}`)
  }
  for (const r of results) {
    const notes = []
    if (r.health.overflow > 0) notes.push(`sideways scroll of ${r.health.overflow}px from ${r.health.overflowing.join(', ') || 'an unknown element'}`)
    if (r.health.broken.length) notes.push(`broken images: ${r.health.broken.join(', ')}`)
    if (r.health.small.length) notes.push(`${r.health.small.length} text(s) under 12px, e.g. ${r.health.small.slice(0, 3).join('; ')}`)
    notes.push(...r.problems)
    if (notes.length) {
      clean = false
      console.log(`  ${r.name}:`)
      for (const n of notes) console.log(`    - ${n}`)
    }
  }
  if (clean) console.log('  Nothing to report: no console errors, failed requests, broken images, sideways scroll or tiny text.')
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
