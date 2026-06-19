export type Theater = 'production' | 'venture'

export type Experience = {
  /** which chapter this role belongs to: Production (01) or Venture (02) */
  theater: Theater
  role: string
  company: string
  location: string
  type: string
  period: string
  url?: string
  highlights: string[]
  tech: string[]
}

export const experience: Experience[] = [
  {
    theater: 'venture',
    role: 'Developer (Sole Engineer) — Recruitment Platform',
    company: 'XSTRYV',
    location: 'Remote',
    type: 'Full-Stack',
    period: 'Mar 2026 – Jun 2026',
    url: 'https://xstryv.com',
    highlights: [
      'Sole engineer on a live recruitment platform connecting talent with companies; owned and ran all three panels (admin, company, talent), serving 1,600+ users and 250+ companies.',
      'End-to-End Ownership: shipped features, fixed production bugs, and ran deployments via GitHub Actions CI/CD — acting as a core team member shaping product decisions, not just a developer.',
      'Messaging System: built LinkedIn-style messaging between companies and talent, with scheduled CRON jobs that send one summary email after a conversation goes quiet.',
      'Race-Condition Fix: traced and fixed a race condition between two signup paths that mismatched user IDs across the Supabase auth and application schemas, restoring data integrity.',
      'Self-Serve Hiring: built a self-serve workflow for companies to shortlist, reject, and accept candidates with data export, plus bulk messaging and announcements.',
      'AI-Native Delivery: sped up delivery ~10x using AI-native development with Cursor and Claude, while clearing pre-existing data inconsistencies across the auth and app layers.',
    ],
    tech: [
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Supabase',
      'REST APIs',
      'CRON Jobs',
      'GitHub Actions',
    ],
  },
  {
    theater: 'production',
    role: 'Full-Stack Engineer — Payment Gateway',
    company: 'Datapulse Technologies',
    location: 'Ireland · Remote',
    type: 'Full-time',
    period: 'Jun 2024 – Jul 2025',
    highlights: [
      'Full-stack engineer on a PCI DSS Level 1 payment gateway (25+ year legacy) running in 20+ currencies and processing hundreds of millions of euros; worked with teams across Ireland, Cyprus, and Pakistan to modernize core services.',
      'Google Pay: onboarded the gateway as a Google-listed processor and integrated Google Pay with full merchant support (notifications, webhooks, emails).',
      'Apple Pay: helped complete Apple Pay integration into the core gateway.',
      'Mobile APIs: built PCI-compliant, JWT-secured REST APIs that let the mobile app connect directly to the gateway and unified UX across platforms.',
      '11% faster processing: optimized queries and workflows across the gateway architecture and database, cutting end-to-end processing time by 11%.',
      'Live issue resolution: worked directly with white-label merchants to fix notification, webhook, risk-rule, and performance issues, deploying to production independently.',
    ],
    tech: [
      'React',
      'Java',
      '.NET',
      'Spring Boot',
      'REST APIs',
      'OAuth 2.0',
      'JWT',
      'MSSQL',
      'YugabyteDB',
      'Azure',
      'Docker',
    ],
  },
  {
    theater: 'production',
    role: 'Software Engineer Intern (Open Source)',
    company: 'Bitnine Global Inc',
    location: 'South Korea · Remote',
    type: 'Part-time',
    period: 'Nov 2022 – Nov 2023',
    highlights: [
      'AgeDB-Cloud: built a Database-as-a-Service (DBaaS) for the Apache AGE graph database, letting users run AGE in a web interface with no local install.',
      'Pgpool-II: added high availability for Apache AGE with load balancing and read/write splitting across servers for uninterrupted access during failures.',
      'AgeViewer-Go: built REST APIs, routing, and sessions in Golang for the age-viewer-go desktop app used to manage Apache AGE databases.',
    ],
    tech: [
      'React',
      'Node.js',
      'MongoDB',
      'Golang',
      'C/C++',
      'Apache AGE',
      'PostgreSQL internals',
      'PM2',
      'DigitalOcean VMs',
    ],
  },
]

export type Volunteer = {
  role: string
  org: string
  period: string
  description: string
  link?: string
}

export const volunteer: Volunteer[] = [
  {
    role: 'Slush Volunteer — Founder Days Team',
    org: 'Slush',
    period: '2025',
    description:
      'Supported Founder Days at Slush (Europe’s largest startup event), helping coordinate a 1,500+ founder gathering through on-site operations and attendee guidance.',
  },
  {
    role: 'Campus Director — UN Millennium Fellowship',
    org: 'United Nations Millennium Fellowship',
    period: '2023',
    description:
      'Selected as a Millennium Fellow (top 9% from 44,000 applicants across 119 nations) and appointed Campus Director (top 1%); led 17 fellows across 5 projects and delivered 6 training sessions.',
    link: 'https://www.millenniumfellows.org/',
  },
]
