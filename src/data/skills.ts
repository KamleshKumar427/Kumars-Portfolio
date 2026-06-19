export type SkillGroup = {
  category: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    items: [
      'Python',
      'JavaScript',
      'TypeScript',
      'Java',
      'C/C++',
      'SQL',
      'Shell',
      'x86/RISC-V Assembly',
      'PostgreSQL internals',
    ],
  },
  {
    category: 'Frameworks',
    items: ['Spring Boot', '.NET', 'React', 'Node.js', 'FastAPI'],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      'CI/CD',
      'Linux',
      'Git/GitHub',
      'Azure',
      'Docker',
      'Docker Compose',
      'VMs',
      'Jenkins',
      'PM2',
    ],
  },
  {
    category: 'Collaboration',
    items: [
      'Cross-cultural teams (IE/CY/PK)',
      'Jira',
      'Customer-facing issue resolution',
      'Documentation',
      'Ownership',
    ],
  },
]

export const certifications = [
  {
    title: 'DevOps with Docker',
    issuer: 'University of Helsinki MOOC',
    year: '2026',
    topics: 'Docker, Compose, networking, volumes, multi-stage builds',
  },
  {
    title: 'Java Spring Framework 6 with Spring Boot 3',
    issuer: 'Udemy — Navin Reddy',
    year: '2024',
    topics: 'Spring 6, Boot 3, JDBC, Microservices, JPA, Security, Docker',
  },
  {
    title: 'PostgreSQL Indexes Deep Dive',
    issuer: 'Percona University — Ibrar Ahmed',
    year: '2023',
    topics: 'PostgreSQL index internals and optimization',
  },
  {
    title: 'Neural Networks and Deep Learning',
    issuer: 'Coursera — Andrew Ng',
    year: '2023',
    topics: 'Deep Learning Specialization',
  },
  {
    title: 'Finetuning Large Language Models',
    issuer: 'DeepLearning.ai — Sharon Zhou',
    year: '2023',
    topics: 'LLM fine-tuning and deployment',
  },
]
