#!/usr/bin/env node
/**
 * Catches claims and wording the site must never publish.
 *
 *   npm run check:content                 scan every content file and list what it finds
 *   node scripts/check-content.mjs FILE…  scan these files
 *   node scripts/check-content.mjs --hook Claude Code PostToolUse hook: checks only the
 *                                         text that was just written, never blocks
 *
 * "fact" rules come from the never-rules in the CV project's profile/facts.md
 * and stories.md (linked at .claude/profile/). When one of those rules
 * changes, change it here too. "style" rules are judgment calls: the hook
 * mentions them, and they never fail a scan.
 *
 * Comments are ignored; only strings, JSX text and HTML are checked.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const FACT = 'fact'
const STYLE = 'style'

const RULES = [
  {
    kind: FACT,
    re: /hundreds of millions/gi,
    why: 'Datapulse processed tens of millions of euros. Never "hundreds of millions" (facts.md).',
  },
  {
    kind: FACT,
    re: /\bmerchants?\b/gi,
    why: 'Say "gateway customers", never "merchants" (facts.md).',
  },
  {
    kind: FACT,
    re: /\bcore (?:of (?:the |a |an )?)?(?:graph )?database\b|\bdatabase['’]?s core\b|\bcore database internals\b|\bcore of (?:apache )?age\b/gi,
    why: 'The Bitnine work was close to Apache AGE and PostgreSQL internals, not the core of the database (stories.md).',
  },
  {
    kind: FACT,
    re: /\b(?:built|created|founded|co-?founded|launched|started)\b[^.\n]{0,40}\b(?:XSTRYV|the (?:recruitment )?platform|(?:a |the )?platform from scratch)\b|\b(?:co-?)?founder (?:of|at) XSTRYV\b/gi,
    why: 'XSTRYV existed before Kamlesh joined: "managed and extended" it as the sole full-stack engineer. Never built, founded or started it (facts.md).',
  },
  {
    kind: FACT,
    re: /\bbuilt (?:its|a|an|the) (?:high[- ]availability )?load[- ]balancer\b/gi,
    why: 'Pgpool-II is the load balancer; the work made it run with Apache AGE (stories.md).',
  },
  {
    kind: FACT,
    re: /\breloca(?:te|tion|ting)\b/gi,
    why: 'Never mention relocation (facts.md).',
  },
  {
    kind: FACT,
    re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    allow: (m) => m.toLowerCase() === 'kamlesh.kumar@helsinki.fi',
    why: 'The only public email is kamlesh.kumar@helsinki.fi (facts.md).',
  },
  {
    kind: STYLE,
    re: /[—–]/g,
    allow: (_m, before, after) =>
      // Date ranges ("Mar–Jun 2026", "2024–2025") and kanji kickers ("選 — Experience") are fine.
      (DATEISH_END.test(before) && DATEISH_START.test(after)) || /[　-鿿]\s?$/.test(before),
    why: 'No em or en dashes inside sentences. A separator in a page title is fine; otherwise use a comma, colon or full stop.',
  },
  {
    kind: STYLE,
    re: /\b(?:passionate|innovative|cutting[- ]edge|leverag(?:e|es|ed|ing)|seamless(?:ly)?|synerg(?:y|ies)|world[- ]class|rockstar|ninja|guru|delv(?:e|es|ing)|tapestry|testament|showcas(?:e|es|ed|ing)|vibrant|results[- ]driven|detail[- ]oriented)\b/gi,
    why: 'Templated word. Say the specific thing that happened instead.',
  },
  {
    kind: STYLE,
    re: /\b(?:2\.5|two and a half|three|3)\+?\s+years\b|\b(?:2|two)\+?\s+years?(?: of)? (?:production|professional|work|industry)/gi,
    why: 'Experience length: full-time work is about 1.5 years, and "2.5 years" counts the part-time internship. Don\'t stretch it (facts.md).',
  },
  {
    kind: STYLE,
    re: /\bkubernetes\b|\bk8s\b/gi,
    why: 'Kubernetes is coursework (an Ongoing MOOC). Show it as a course, never as job or project experience (facts.md).',
  },
]

const MONTHS = 'jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec'
const DATEISH_END = new RegExp(`(?:\\d|\\b(?:${MONTHS})[a-z]*)\\s?$`, 'i')
const DATEISH_START = new RegExp(`^\\s?(?:\\d|(?:${MONTHS})[a-z]*\\b|present\\b|now\\b)`, 'i')

/** Files whose strings end up on the page. Testimonials are left out on
 *  purpose: they are other people's words, quoted as given. */
const CONTENT_PATTERNS = [
  /^index\.html$/,
  /^src\/(?:Portfolio|StartupsPage)\.tsx$/,
  /^src\/data\/(?!testimonials\.ts$).+\.ts$/,
  /^src\/sections\/.+\.tsx$/,
  /^src\/components\/(?!SkillIcon\.tsx$).+\.tsx$/,
  /^src\/pond\/KoiPondSection\.tsx$/,
]
const CONTENT = { test: (rel) => CONTENT_PATTERNS.some((re) => re.test(rel.split(path.sep).join('/'))) }
const DEFAULT_FILES = [
  'index.html',
  'src/Portfolio.tsx',
  'src/StartupsPage.tsx',
  'src/data',
  'src/sections',
  'src/components',
  'src/pond/KoiPondSection.tsx',
]

/** Blank out comments, keep line numbers. Strings and JSX text survive. */
function stripComments(text, file) {
  if (file.endsWith('.html')) return text.replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ' '))
  let out = ''
  let i = 0
  let quote = null
  while (i < text.length) {
    const c = text[i]
    const next = text[i + 1]
    if (quote) {
      out += c
      if (c === '\\') {
        out += next ?? ''
        i += 2
        continue
      }
      if (c === quote) quote = null
      i++
      continue
    }
    if (c === '/' && next === '/') {
      while (i < text.length && text[i] !== '\n') {
        out += ' '
        i++
      }
      continue
    }
    if (c === '/' && next === '*') {
      const end = text.indexOf('*/', i + 2)
      const stop = end === -1 ? text.length : end + 2
      out += text.slice(i, stop).replace(/[^\n]/g, ' ')
      i = stop
      continue
    }
    if (c === "'" || c === '"' || c === '`') quote = c
    out += c
    i++
  }
  return out
}

function findIssues(text, file) {
  const clean = stripComments(text, file)
  const issues = []
  for (const rule of RULES) {
    rule.re.lastIndex = 0
    for (const m of clean.matchAll(rule.re)) {
      const before = clean.slice(Math.max(0, m.index - 12), m.index)
      const after = clean.slice(m.index + m[0].length, m.index + m[0].length + 12)
      if (rule.allow?.(m[0], before, after)) continue
      const line = clean.slice(0, m.index).split('\n').length
      const lineText = text.split('\n')[line - 1] ?? ''
      const col = m.index - clean.lastIndexOf('\n', m.index - 1) - 1
      const snippet = lineText.slice(Math.max(0, col - 30), col + m[0].length + 30).trim()
      issues.push({ kind: rule.kind, match: m[0], why: rule.why, line, snippet })
    }
  }
  return issues
}

async function expand(entries) {
  const { readdir, stat } = await import('node:fs/promises')
  const files = []
  for (const entry of entries) {
    const abs = path.resolve(root, entry)
    const info = await stat(abs).catch(() => null)
    if (!info) continue
    if (info.isDirectory()) {
      for (const name of await readdir(abs, { recursive: true })) {
        const rel = path.relative(root, path.join(abs, name))
        if (CONTENT.test(rel)) files.push(rel)
      }
    } else {
      files.push(path.relative(root, abs))
    }
  }
  return [...new Set(files)].sort()
}

async function scan(args) {
  const files = await expand(args.length ? args : DEFAULT_FILES)
  let facts = 0
  let styles = 0
  for (const file of files) {
    const issues = findIssues(await readFile(path.join(root, file), 'utf8'), file)
    for (const issue of issues) {
      if (issue.kind === FACT) facts++
      else styles++
      console.log(`${file}:${issue.line}  [${issue.kind}] "${issue.match}"  ${issue.why}\n    ${issue.snippet}`)
    }
  }
  console.log(`\n${files.length} files checked: ${facts} fact problem(s), ${styles} style note(s).`)
  if (facts) process.exitCode = 1
}

async function hook() {
  let input = ''
  for await (const chunk of process.stdin) input += chunk
  const payload = JSON.parse(input || '{}')
  const tool = payload.tool_input ?? {}
  const abs = tool.file_path ?? payload.tool_response?.filePath
  if (!abs) return
  const rel = path.relative(root, abs)
  if (!CONTENT.test(rel)) return

  const written =
    tool.new_string ?? tool.content ?? (Array.isArray(tool.edits) ? tool.edits.map((e) => e.new_string).join('\n') : '')
  if (!written) return

  const issues = findIssues(written, rel)
  if (!issues.length) return

  const facts = issues.filter((i) => i.kind === FACT)
  const lines = issues.map((i) => `- [${i.kind}] "${i.match}" in "${i.snippet}": ${i.why}`)
  const context = [
    `check-content: the text just written to ${rel} has ${issues.length} issue(s).`,
    ...lines,
    facts.length
      ? 'Fix the [fact] items before moving on. [style] items are judgment calls: fix them unless there is a reason not to.'
      : '[style] items are judgment calls: fix them unless there is a reason not to.',
  ].join('\n')

  const out = { hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: context } }
  if (facts.length) out.systemMessage = `Content check: ${facts.length} claim(s) in ${rel} break the facts rules.`
  process.stdout.write(JSON.stringify(out))
}

const args = process.argv.slice(2)
const run = args[0] === '--hook' ? hook() : scan(args)
run.catch((err) => {
  // A broken check must never block an edit.
  console.error(`check-content: ${err.message}`)
  process.exit(args[0] === '--hook' ? 0 : 2)
})
