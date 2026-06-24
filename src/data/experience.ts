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
    meta: ['2026', 'MAR–JUN', 'REMOTE'],
    kicker: 'XSTRYV · Recruitment Platform',
    title: 'Developer (Sole Engineer) — Startup',
    summary:
      'Sole engineer on a live recruitment platform connecting talent with companies — owned all three panels (admin, company, talent), serving 1,600+ users and 250+ companies. Shipped features, fixed production bugs, and ran deployments via GitHub Actions, acting as a core team member shaping product decisions.',
    points: [
      'Built LinkedIn-style messaging between companies and talent, with CRON jobs that send one summary email after a conversation goes quiet.',
      'Built a self-serve workflow for companies to shortlist, reject, and accept candidates with data export, plus bulk messaging and announcements.',
      'Traced and fixed a race condition between two signup paths that mismatched user IDs across Supabase auth and application schemas.',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'GitHub Actions'],
    href: 'https://xstryv.com',
  },
  {
    n: '02',
    meta: ['2024–2025', 'FULL-TIME', 'IRELAND · REMOTE'],
    kicker: 'Datapulse Technologies · PCI DSS L1 Gateway',
    title: 'Full-Stack Engineer — Payment Gateway (Fintech)',
    summary:
      'Full-stack engineer on a PCI DSS Level 1 payment gateway with a 25-year legacy, running in 20+ currencies and processing hundreds of millions of euros. Worked with teams across Ireland, Cyprus, and Pakistan to modernise core services; deployed to production independently and worked directly with white-label merchants on live issues.',
    points: [
      'Onboarded the gateway as a Google-listed processor and integrated Google Pay with full merchant support (notifications, webhooks, emails).',
      'Helped complete Apple Pay integration into the core gateway.',
      'Built PCI-compliant, JWT-secured REST APIs for the mobile app and cut end-to-end processing time 11% via query and workflow optimisation.',
    ],
    tech: ['React', 'Java', 'Spring Boot', '.NET', 'OAuth 2.0', 'JWT', 'MSSQL', 'YugabyteDB', 'Azure', 'Docker'],
  },
  {
    n: '03',
    meta: ['2022–2023', 'PART-TIME', 'S. KOREA · REMOTE'],
    kicker: 'Bitnine Global · Apache AGE',
    title: 'Software Engineer Intern (Open Source)',
    summary:
      'Contributed to open-source tooling for the Apache AGE graph database — a DBaaS, high-availability via Pgpool-II, and a Go desktop client for managing AGE databases.',
    points: [
      'AgeDB-Cloud: built a Database-as-a-Service letting users run AGE in a web interface with no local install.',
      'Pgpool-II: added high availability with load balancing and read/write splitting for uninterrupted access during failures.',
      'AgeViewer-Go: built REST APIs, routing, and sessions in Golang for the age-viewer-go desktop app.',
    ],
    tech: ['React', 'Node.js', 'Go', 'C / C++', 'Apache AGE', 'PostgreSQL', 'MongoDB'],
  },
]
