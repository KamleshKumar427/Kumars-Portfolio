// Selected Work: the three roles, word for word from Kamlesh's CV (2026-10-07).
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
  stats?: { value: string; label: string; href?: string }[]
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
  title: 'Full-Stack Developer',
  summary:
    "A startup recruitment platform connecting talent with companies. Joined as the only engineer and **a core team member**, owning the platform end-to-end while it handled real users traffic.",
  points: [
    "Built a **multi-user messaging system** between companies and talent, featuring in-chat acceptance/rejection workflows and scheduled Inngest background jobs to deliver **rate-limited email notifications**",
    "**Implemented a self-serve applicant workflow** so companies can independently manage hiring on the platform, with excel data export and bulk in-platform messaging announcements.",
    "Implemented **Upstash Redis caching layer** and Sentry error tracking from scratch, boosting **system performance** and **observability**.",
    "**Traced a race condition** between two signup paths that caused mismatched user IDs across database tables and metadata, diagnosed the root cause, and shipped a permanent fix.",
    "Debugged and resolved **pre-existing inconsistent data across the auth and application layers**.",
    "Participated in product and market discussions, shaped decisions, built a full understanding of the business alongside the code, and hired two new developer interns.",
  ],
  stats: [
    { value: '2', label: 'developer interns onboarded' },

    { value: 'Core Team Member', label: 'owned the platform end-to-end' },
  ],
  tech: ['Next.js', 'TypeScript', 'WebSockets', 'Supabase', 'Prisma', 'nginx', 'GitHub Actions', 'Docker Swarm', 'Terraform'],
  href: 'https://xstryv.com/signin',
}

export const experience: Experience[] = [
  xstryv,
  {
    n: '02',
    meta: ['JUN 2024–JUL 2025', 'FULL-TIME', 'IRELAND · REMOTE'],
    kicker: 'Datapulse Technologies · PCI DSS L1 Gateway',
    title: 'Full Stack Engineer (Fin-Tech)',
    summary:
      'PCI DSS Level 1 payment gateway, with 25+ years legacy code, processing tens of millions of euros in 20+ currencies. Worked with teams in Ireland, Cyprus, and Pakistan.',
    points: [
      'Cut end-to-end payment processing time by **11%**: optimized slow SQL queries and indexes, made log writes and transaction status updates asynchronous so payments no longer waited on them, and removed legacy VBScript.',
      'Built the core gateway’s **Google Pay** integration end to end, from the payment API and token handling to the transaction flow and webhooks, and worked with Google’s technical teams to qualify it as a participating processor.',
      'Helped complete the **Apple Pay integration** in the core gateway.',
      'Designed and built **PCI-compliant REST APIs** secured with JWT, so the mobile app could connect directly to the core gateway. This improved data consistency and unified the experience across platforms.',
      '**Worked directly with gateway customers** on their white-label setups, each isolated in its own database: diagnosed notification, webhook, risk rule, and performance issues, and shipped the fixes to production.',
    ],
    stats: [
      { value: '11%', label: 'faster payment processing' },
      { value: 'Client-Facing Engineering', label: '' },
      { value: '€10M+', label: 'PROCESSED ANNUALLY' },
    ],
    tech: ['TypeScript', 'React', 'Python', 'Java', 'Spring Boot', 'MSSQL', 'YugabyteDB (database-per-tenant)', 'Azure', 'Docker'],
    href: 'https://pbt.com.cy/',
  },
  {
    n: '03',
    meta: ['NOV 2022–NOV 2023', 'PART-TIME', 'SOUTH KOREA · REMOTE'],
    kicker: 'Bitnine Global · Apache AGE',
    title: 'Software Engineer Intern, Open Source',
    summary:
      'Contributed 11 merged pull requests to **Apache AGE**, an open-source graph database extension for PostgreSQL.',
    points: [
      'Worked on high availability for AGE through Pgpool-II (load balancing, read/write splitting): implemented Cypher function extraction and added regression tests for Cypher load balancing, in C.',
      'Wrote REST APIs, routing, and sessions in Go for AgeViewer-Go, the desktop app for managing AGE databases: connecting and disconnecting databases, reading graph metadata, and returning query results.',
      'Built AgeDB-Cloud, a web app for using AGE in the browser without installing it, on a DigitalOcean VM.',
    ],
    stats: [
      {
        value: '11 PRs',
        label: 'merged into Apache AGE\u00a0↗',
        href: 'https://github.com/apache/age/pulls?q=is:pr+author:KamleshKumar427+is:merged',
      },
      { value: '5k', label: 'Github Stars ⭐' },
    ],
    tech: ['C', 'Go', 'PostgreSQL', 'Pgpool-II', 'React', 'Node.js', 'MongoDB', 'PM2'],
    href: 'https://github.com/apache/age',
  },
]

/** "Data layer: Designed and shipped…" → { label: 'Data layer', text: 'Designed…' }.
 *  Points without a short leading label come back with no label. */
export function splitPoint(point: string): { label?: string; text: string } {
  const m = point.match(/^([^:.]{2,32}):\s+(.+)$/)
  return m ? { label: m[1], text: m[2] } : { text: point }
}
