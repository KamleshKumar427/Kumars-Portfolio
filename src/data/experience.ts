// Selected Work: the three roles, word for word from Kamlesh's CV (2026-10-17).
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
      'Migrated an in-house MSSQL server database to a **managed YugabyteDB service on Azure**, moving millions of rows with multi-tenant database isolation.',
      'Cut end-to-end payment processing time by **11%** by optimizing slow SQL queries and indexes, and making transaction status updates asynchronous.',
      'Built the end-to-end **Google Pay** integration (APIs, token handling, and webhooks) and collaborated with Google tech team to qualify as an official participating processor.',
      'Helped complete the **Apple Pay integration** in the core gateway.',
      'Worked directly with **gateway customers** to resolve technical issues (webhooks, risk rules, performance) and ship fixes to production.',
      'Improved data consistency and user experience across platforms by designing PCI-compliant, JWT-secured **REST APIs** for direct mobile integration.',
    ],
    stats: [
      { value: '11%', label: 'faster payment processing' },
      { value: 'Client-Facing Engineering', label: '' },
      { value: '€10M+', label: 'PROCESSED ANNUALLY' },
    ],
    tech: ['TypeScript', 'React', 'Python', 'Java', 'Spring Boot', 'MSSQL', 'YugabyteDB (database-per-tenant)', 'Azure', 'Docker'],
    href: 'https://pbtgateway.com/',
  },
  {
    n: '03',
    meta: ['NOV 2022–NOV 2023', 'PART-TIME', 'SOUTH KOREA · REMOTE'],
    kicker: 'Bitnine Global · Apache AGE',
    title: 'Software Engineer Intern, Open Source',
    summary:
      'Contributed 11 merged pull requests to **Apache AGE**, an open-source graph database extension for PostgreSQL.',
    points: [
      'Made AGE’s Cypher queries to work with **Pgpool-II** (Load balancing tool for PostgreSQL).',
      'Wrote C code that lets Pgpool-II parse each cypher query and route it: sending reads to replica servers and writes to the main server. Covered the change with **regression tests**.',
      'Built the Go backend for a desktop app for managing AGE databases. Wrote the REST APIs, routing, and sessions that let users connect to a database, run queries and visualize query results.',
      'Contributed to AgeDB-Cloud, a web app for using AGE in the browser without installing it. Set up automatic deployment to a **DigitalOcean** VM with **GitHub Actions**.',
    ],
    stats: [
      {
        value: '11 PRs',
        label: 'merged into Apache AGE\u00a0↗',
        href: 'https://github.com/apache/age/pulls?q=is:pr+author:KamleshKumar427+is:merged',
      },
      { value: '4.9k', label: 'Github Stars ⭐' },
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
