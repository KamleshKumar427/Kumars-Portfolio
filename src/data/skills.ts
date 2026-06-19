export type SkillGroup = {
  category: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C/C++', 'SQL', 'Shell', 'x86 Assembly'],
  },
  {
    category: 'Frameworks & Libraries',
    items: ['React', 'Next.js', 'Node.js', 'Spring Boot', '.NET', 'FastAPI', 'Three.js'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'MSSQL', 'MongoDB', 'YugabyteDB', 'Supabase'],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      'Docker',
      'Docker Compose',
      'CI/CD',
      'GitHub Actions',
      'Jenkins',
      'Azure',
      'Linux',
      'Git',
      'PM2',
      'Virtual Machines',
    ],
  },
  {
    category: 'Practices & Tools',
    items: [
      'REST APIs',
      'JWT',
      'OAuth 2.0',
      'Microservices',
      'System Design',
      'Agile',
      'CRON Jobs',
      'Jira',
      'AI-assisted dev (Cursor, Claude, Copilot)',
    ],
  },
]

export type Certification = {
  title: string
  issuer: string
  year: string
  topics: string
}

export const certifications: Certification[] = [
  {
    title: 'DevOps with Docker',
    issuer: 'University of Helsinki MOOC',
    year: '2026',
    topics: 'Docker, Compose, networking, volumes, multi-stage builds',
  },
  {
    title: 'Java Spring Framework 6 with Spring Boot 3',
    issuer: 'Udemy',
    year: '2024',
    topics: 'Spring 6, Boot 3, JDBC, JPA, Security, Docker, Microservices',
  },
  {
    title: 'PostgreSQL Indexes',
    issuer: 'Percona University',
    year: '2023',
    topics: 'Deep dive into PostgreSQL index internals and optimization',
  },
  {
    title: 'Deep Learning Specialization',
    issuer: 'Coursera — Andrew Ng',
    year: '2023',
    topics: 'Neural Networks and Deep Learning',
  },
]
