export type Experience = {
  role: string
  company: string
  location: string
  type: string
  period: string
  highlights: string[]
  tech: string[]
}

export const experience: Experience[] = [
  {
    role: 'Full Stack Engineer — Payment Gateway',
    company: 'Datapulse Technologies',
    location: 'Ireland · Remote',
    type: 'Full-time',
    period: 'Jun 2024 – Jul 2025',
    highlights: [
      'Full stack engineer on a PCI DSS Level 1 payment gateway (25+ years legacy), operating in 20+ currencies and processing hundreds of millions of euros across Ireland, Cyprus, and Pakistan.',
      'Google Pay: Coordinated with Google to onboard the gateway as a participating processor; integrated full merchant support (notifications, webhooks, emails).',
      'Apple Pay: Contributed to completing Apple Pay integration into the core gateway.',
      'Mobile APIs: Designed and implemented PCI-compliant REST APIs secured with JWT for direct mobile integration, improving data consistency and unified UX.',
      '11% throughput improvement by optimizing queries and workflows through deep understanding of gateway architecture and database design.',
      'Resolved live merchant issues on white-labels — notifications, webhooks, risk rules, performance — and deployed fixes to production independently.',
    ],
    tech: [
      'React',
      'Java',
      '.NET',
      'Spring Boot',
      'REST',
      'OAuth 2.0',
      'MSSQL',
      'YugaByte DB',
      'Azure',
      'Docker',
      'JWT',
    ],
  },
  {
    role: 'Software Engineer Intern (Open Source)',
    company: 'Bitnine Global Inc',
    location: 'South Korea · Remote',
    type: 'Part-time',
    period: 'Nov 2022 – Nov 2023',
    highlights: [
      'Agedb-Cloud: Built a DBaaS solution for the AGE graph database on DigitalOcean VMs — web interface for collaborative use without local installation.',
      'Pgpool-II: Developed Pgpool-II integration for Apache AGE, enabling HA with load balancing and read/write splitting across multiple servers.',
      'AgeViewer-Go: Built REST APIs, routing, and sessions in Go for the age-viewer-go desktop app for administering Apache AGE databases.',
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'PM2', 'Apache AGE', 'C', 'Golang', 'PostgreSQL'],
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
    role: 'Volunteer — Founder Days Team',
    org: 'Slush',
    period: '2025',
    description:
      'Supported a 1,500+ founder gathering at Europe’s largest startup event through on-site coordination, attendee guidance, and operations.',
  },
  {
    role: 'Campus Director',
    org: 'UN Millennium Fellowship',
    period: '2023',
    description:
      'Selected as a Millennium Fellow (top 9% from 44,000 applicants across 119 nations) and appointed Campus Director (top 1%). Led 17 fellows across engineering disciplines on 5 projects.',
    link: 'https://www.millenniumfellows.org/',
  },
]
