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
  tech: string[]
  href?: string
}

export const experience: Experience[] = [
  {
    n: '01',
    meta: ['2026', 'MAR–JUN', 'HYBRID'],
    kicker: 'XSTRYV · Recruitment Platform',
    title: 'Developer (Sole Engineer) — Startup Recruitment Platform',
    summary:
      'Sole engineer on a live recruitment platform connecting talent with companies — admin, company, and talent panels, serving 1,600+ users and 250+ companies. Landed 50+ commits in three months — shipped features, fixed production bugs, and ran deployments via GitHub Actions while acting as a core team member on product decisions.',
    points: [
      'Built LinkedIn-style messaging with CRON jobs that send one summary email after a conversation goes quiet.',
      'Built self-serve hiring — shortlist, reject, accept, data export, bulk messaging, and announcements.',
      'Traced and fixed a race condition between two signup paths that mismatched user IDs across Supabase auth and application schemas.',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'GitHub Actions'],
    href: 'https://xstryv.com/signin',
  },
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
      'Built PCI-compliant, JWT-secured REST APIs for mobile and cut end-to-end processing time 11% through query and workflow optimisation.',
    ],
    tech: ['React', 'TypeScript', 'Java', 'Spring Boot',  'Docker', 'OAuth 2.0', 'JWT', 'REST APIs', 'YugabyteDB', 'Azure'],
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
    tech: ['React', 'Node.js', 'Go', 'C / C++', 'Apache AGE', 'PostgreSQL', 'MongoDB'],
    href: 'https://age.apache.org/',
  },
]
