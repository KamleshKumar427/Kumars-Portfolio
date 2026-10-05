// Selected Work — the three roles, derived from Curriculum_Vitae_Md.md (source of truth).
export type Experience = {
  /** display index, e.g. "01" */
  n: string
  /** meta lines under the number (dates · employment · place) */
  meta: string[]
  /** mono kicker, e.g. "XSTRYV · Recruitment Platform" */
  kicker: string
  /** job title from CV */
  title: string
  summary: string
  /** one or two highlighted ◇ points */
  points: string[]
  /** labelled figures for this role, shown as chips */
  stats?: { value: string; label: string }[]
  tech: string[]
  href?: string
}

/** XSTRYV — shown on the home page AND /startups. One entry, so the two
 *  pages can't drift apart again (they had: "sole engineer, 50+ commits" on one,
 *  different figures on the other). */
export const xstryv: Experience = {
  n: '01',
  meta: ['MAR–JUN 2026', 'FULL-TIME', 'ESPOO, FINLAND'],
  kicker: 'XSTRYV · HR-Tech Platform',
  title: 'Full-Stack Developer (HR-Tech)',
  summary:
    'Took ownership of the codebase from day 1, delivering 67 commits in 4 months across the frontend, server, and data layers, and later onboarded two new developers onto the platform.',
  points: [
    'Application architecture: Built and extended feature modules for jobs, chat, admin, onboarding, and dashboards in Next.js (App Router) with React, TypeScript, Tailwind, and Radix UI, backed by a typed service layer.',
    'Server layer: Implemented server-side logic through Next.js Server Actions covering authentication, messaging, admin approval flows, bulk job operations, and candidate data export to Excel.',
    'Data layer: Designed and shipped 14 PostgreSQL migrations with Prisma covering company-scoped chat, review statuses, rejection reasons, and program enrolment.',
    'Authentication: Worked across Supabase Auth OAuth and email flows, unified separate company and talent sign-in into a single entry point, and hardened one-time verification links against automated email scanners.',
    'Async processing & caching: Used Inngest for background workflows, Upstash Redis for caching, and Resend for transactional email, including debounced notifications for unread messages.',
    'Reliability: Configured Sentry error monitoring and added audit logging through a dedicated service.',
  ],
  stats: [
    { value: '67', label: 'commits in 4 months' },
    { value: '14', label: 'PostgreSQL migrations' },
    { value: 'Day 1', label: 'owned the codebase' },
    { value: '2', label: 'developers onboarded' },
  ],
  tech: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'Supabase Auth', 'Inngest', 'Tailwind'],
  href: 'https://xstryv.com/signin',
}

export const experience: Experience[] = [
  xstryv,
  {
    n: '02',
    meta: ['2024–2025', 'FULL-TIME', 'IRELAND · REMOTE'],
    kicker: 'Datapulse Technologies · PCI DSS L1 Gateway',
    title: 'Full-Stack Engineer — Payment Gateway (Fintech)',
    summary:
      'Full-stack engineer on a PCI DSS Level 1 payment gateway with a 25-year legacy — 20+ currencies, hundreds of millions of euros processed. Modernised core services with teams across Ireland, Cyprus, and Pakistan; deployed to production independently.',
    points: [
      'Onboarded the gateway as a Google-listed processor; integrated Google Pay with full merchant support (notifications, webhooks, emails).',
      'Completed Apple Pay integration into the core gateway.',
      'Built PCI-compliant, JWT-secured REST APIs so the mobile app could talk straight to the gateway, unifying the experience across platforms.',
      'Cut end-to-end processing time by 11% by optimising queries and workflows across the gateway architecture and database.',
      'Worked directly with white-label merchants on notification, webhook, risk-rule and performance issues — deploying to production independently.',
    ],
    stats: [
      { value: '20+', label: 'currencies' },
      { value: 'Hundreds of millions €', label: 'processed' },
      { value: '25 yrs', label: 'of legacy codebase' },
      { value: '11%', label: 'faster processing' },
    ],
    tech: [
      'React',
      'TypeScript',
      'Java',
      'Spring Boot',
      '.NET',
      'Docker',
      'OAuth 2.0',
      'JWT',
      'REST APIs',
      'MSSQL',
      'YugabyteDB',
      'Azure',
    ],
    href: 'https://pbt.com.cy/',
  },
  {
    n: '03',
    meta: ['2022–2023', 'PART-TIME', 'S. KOREA · REMOTE'],
    kicker: 'Bitnine Global · Apache AGE',
    title: 'Software Engineer Intern (Open Source)',
    summary:
      'Open-source tooling for the Apache AGE graph database — a browser-based DBaaS, high availability via Pgpool-II, and a Go desktop client for managing AGE databases.',
    points: [
      'AgeDB-Cloud: Database-as-a-Service to run AGE in a web interface with no local install.',
      'Pgpool-II: load balancing and read/write splitting for uninterrupted access during failures.',
      'AgeViewer-Go: REST APIs, routing, and sessions in Go for the age-viewer-go desktop app.',
    ],
    stats: [
      { value: '3', label: 'open-source tools shipped' },
      { value: 'Apache AGE', label: 'graph database internals' },
      { value: '1 yr', label: 'alongside a CS degree' },
    ],
    tech: [
      'React',
      'Node.js',
      'Go',
      'C / C++',
      'Apache AGE',
      'PostgreSQL internals',
      'Pgpool-II',
      'MongoDB',
      'PM2',
      'DigitalOcean',
    ],
    href: 'https://age.apache.org/',
  },
]

/** "Data layer: Designed and shipped…" → { label: 'Data layer', text: 'Designed…' }.
 *  Points without a short leading label come back with no label. */
export function splitPoint(point: string): { label?: string; text: string } {
  const m = point.match(/^([^:.]{2,32}):\s+(.+)$/)
  return m ? { label: m[1], text: m[2] } : { text: point }
}
