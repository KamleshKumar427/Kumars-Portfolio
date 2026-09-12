export type Education = {
  degree: string
  school: string
  period: string
  /** Logo under public/images/education/ */
  logo?: string
  /** mono logos (e.g. Helsinki wordmark) invert on dark; color logos stay as-is */
  logoTheme?: 'mono' | 'color'
  /** Highlighted grade badge, e.g. MSc GPA */
  grade?: string
  note?: string
}

export const education: Education[] = [
  {
    degree: 'MSc Computer Science',
    school: 'University of Helsinki',
    period: 'Sep 2025 — May 2027',
    logo: '/images/education/helsinki.svg',
    logoTheme: 'mono',
    grade: 'Grade 4.9 / 5',
    note: 'Courses: Machine learning, MLOps, Docker, Kubernetes (ongoing), distributed systems, and scalable architecture.',
  },
  {
    degree: 'BSc Computer Science',
    school: 'NUST · Islamabad',
    period: 'Sep 2020 — Jun 2024',
    logo: '/images/education/nust.svg',
    logoTheme: 'color',
    note: 'Final-year project: WebXR metaverse classroom with a fine-tuned LLaMA-2 7B model on Meta Quest 2.',
  },
]

export const recognition =
  'Slush 2025 volunteer · UN Millennium Fellow (top 9% of 44,000 applicants) · Campus Director, top 1%.'
