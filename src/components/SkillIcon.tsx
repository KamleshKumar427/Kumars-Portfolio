import type { CSSProperties, ReactNode } from 'react'
import {
  siCplusplus,
  siDocker,
  siDotnet,
  siFastapi,
  siGithubactions,
  siGnubash,
  siGooglecloud,
  siJavascript,
  siJenkins,
  siKubernetes,
  siLinux,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPython,
  siReact,
  siSpringboot,
  siSupabase,
  siTerraform,
  siThreedotjs,
  siTypescript,
  type SimpleIcon,
} from 'simple-icons'

/**
 * Brand marks from Simple Icons (CC0). Imported one by one so only these ship.
 * Deliberately NOT mapped, though the set has a near-match:
 * - x86 Assembly → AssemblyScript is a TypeScript-like WebAssembly language.
 * - SQL → MySQL is one product; SQL is the language.
 * AWS, Azure, MSSQL and YugabyteDB have no mark in the set (their owners had
 * them withdrawn), so they — and the practices — get a line glyph instead.
 */
const BRANDS: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  Python: siPython,
  Java: siOpenjdk,
  'C / C++': siCplusplus,
  Shell: siGnubash,
  React: siReact,
  'Next.js': siNextdotjs,
  'Node.js': siNodedotjs,
  'Spring Boot': siSpringboot,
  '.NET': siDotnet,
  FastAPI: siFastapi,
  'Three.js': siThreedotjs,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  Supabase: siSupabase,
  GCP: siGooglecloud,
  Terraform: siTerraform,
  Docker: siDocker,
  Kubernetes: siKubernetes,
  'GitHub Actions': siGithubactions,
  Jenkins: siJenkins,
  Linux: siLinux,
}

/** Line glyphs, drawn on the same 24px grid as the brand marks. */
const GLYPHS: Record<string, ReactNode> = {
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
      <path d="M4.5 5.5v13c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13" />
      <path d="M4.5 12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8" />
    </>
  ),
  chip: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
      <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </>
  ),
  cloud: <path d="M7.5 19h10a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7.3 9.6 4.75 4.75 0 0 0 7.5 19Z" />,
  api: (
    <path d="M8 4C6 4 5 5 5 7v2.5C5 10.7 4.2 12 3 12c1.2 0 2 1.3 2 2.5V17c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2.5c0 1.2.8 2.5 2 2.5-1.2 0-2 1.3-2 2.5V17c0 2-1 3-3 3" />
  ),
  system: (
    <>
      <rect x="9" y="3" width="6" height="5" rx="1" />
      <rect x="3" y="16" width="6" height="5" rx="1" />
      <rect x="15" y="16" width="6" height="5" rx="1" />
      <path d="M12 8v4M6 16v-2.5h12V16" />
    </>
  ),
  services: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4.5" />
      <path d="M11.2 11.8 20 3M15.5 7.5l2.5 2.5M18 5l2.5 2.5" />
    </>
  ),
  loop: (
    <path d="M12 12c-2-2.7-3.7-4-5.5-4a4 4 0 0 0 0 8c1.8 0 3.5-1.3 5.5-4Zm0 0c2 2.7 3.7 4 5.5 4a4 4 0 0 0 0-8c-1.8 0-3.5 1.3-5.5 4Z" />
  ),
  cycle: (
    <>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v4.5h-4.5" />
    </>
  ),
  neural: (
    <>
      <circle cx="5" cy="7" r="2" />
      <circle cx="5" cy="17" r="2" />
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M6.8 6.1 10.2 5M6.8 8 10.4 11M6.8 16 10.4 13M6.8 17.9 10.2 19M13.6 6.3 17.6 10.7M14 12h3M13.6 17.7l4-4.4" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
      <path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z" />
    </>
  ),
}

const GLYPH_FOR: Record<string, keyof typeof GLYPHS> = {
  SQL: 'database',
  MSSQL: 'database',
  YugabyteDB: 'database',
  'x86 Assembly': 'chip',
  AWS: 'cloud',
  'AWS CDK': 'cloud',
  Azure: 'cloud',
  'REST APIs': 'api',
  'System Design': 'system',
  Microservices: 'services',
  'OAuth 2.0 / JWT': 'key',
  'CI/CD': 'loop',
  Agile: 'cycle',
  'AI-native development': 'spark',
  'Deep Learning': 'neural',
}

/* Brand colours don't all read on every background: JavaScript yellow and
   React cyan nearly vanish on a white chip, and the black marks (Next.js,
   Three.js, Java) vanish on a dark one. So each mark keeps its colour only in
   a theme where it stays visible, and falls back to the text colour where it
   doesn't. The backgrounds are the chip's --card in each theme. */
const CHIP_BG = { light: '#ffffff', dark: '#1d1e23' }
const MIN_CONTRAST = 1.8

function luminance(hex: string) {
  const h = hex.replace('#', '')
  const channel = (i: number) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4)
}

function readableOn(hex: string, bg: string) {
  const [a, b] = [luminance(hex), luminance(bg)]
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= MIN_CONTRAST
}

/** Glyphs aren't brands, so they sit a step quieter than the logos. */
const GLYPH_TONE = { '--icon-light': 'var(--ink2)', '--icon-dark': 'var(--ink2)' } as CSSProperties

/** Small mark shown before a skill's name. Purely decorative: the name is
 *  right beside it, so it is hidden from screen readers. */
export function SkillIcon({ name }: { name: string }) {
  const brand = BRANDS[name]
  if (brand) {
    const hex = `#${brand.hex}`
    const style = {
      '--icon-light': readableOn(hex, CHIP_BG.light) ? hex : 'currentColor',
      '--icon-dark': readableOn(hex, CHIP_BG.dark) ? hex : 'currentColor',
    } as CSSProperties
    return (
      <svg className="skill-icon" viewBox="0 0 24 24" fill="currentColor" style={style} aria-hidden="true">
        <path d={brand.path} />
      </svg>
    )
  }

  const glyph = GLYPH_FOR[name]
  if (!glyph) return null
  return (
    <svg
      className="skill-icon skill-icon--glyph"
      style={GLYPH_TONE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[glyph]}
    </svg>
  )
}
