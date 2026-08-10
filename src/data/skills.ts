export type SkillGroup = {
  label: string
  items: string[]
}

// "Tools & Materials" — grouped to match the Path section of the design.
export const skills: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C / C++', 'SQL', 'x86 Assembly'],
  },
  {
    label: 'Frameworks',
    items: ['React', 'Next.js', 'Node.js', 'Spring Boot', 'FastAPI', 'Three.js'],
  },
  {
    label: 'Data',
    items: ['PostgreSQL', 'MSSQL', 'MongoDB', 'YugabyteDB'],
  },
  {
    label: 'Cloud · DevOps',
    items: [
      'AWS',
      'AWS CDK',
      'GCP',
      'Terraform',
      'Docker',
      'Kubernetes',
      'GitHub Actions',
      'Linux',
    ],
  },
]
