export type SkillGroup = {
  label: string
  items: string[]
}

// "Tools & Materials" — grouped to match the Path section of the design.
export const skills: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C / C++', 'SQL', 'Shell', 'x86 Assembly'],
  },
  {
    label: 'Frameworks',
    items: ['React', 'Next.js', 'Node.js', 'Spring Boot', '.NET', 'FastAPI', 'Three.js'],
  },
  {
    label: 'Data',
    items: ['PostgreSQL', 'MSSQL', 'MongoDB', 'YugabyteDB', 'Supabase'],
  },
  {
    label: 'Cloud · DevOps',
    items: [
      'AWS',
      'AWS CDK',
      'Terraform',
      'Docker',
      'Kubernetes',
      'GitHub Actions',
      'Jenkins',
      'Linux',
    ],
  },
  {
    label: 'Practices',
    items: [
      'Agile',
      'REST APIs',
      'System Design',
      'Microservices',
      'OAuth 2.0 / JWT',
      'CI/CD',
      'AI-native development',
    ],
  },
]
