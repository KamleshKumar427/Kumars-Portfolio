export type Education = {
  degree: string
  school: string
  period: string
  note?: string
}

export const education: Education[] = [
  {
    degree: 'MSc Computer Science',
    school: 'University of Helsinki · Grade 4.9/5',
    period: 'Sep 2025 —  May 2027',
    note: 'Intro to Machine Learning, Engineering of Machine Learning, Docker, Kubernetes, distributed systems, scalable architecture.',
  },
  {
    degree: 'BSc Computer Science',
    school: 'NUST, Islamabad',
    period: 'Sep 2020 — Jun 2024',
  },
]

/** A short line of standout extracurriculars for the Path section. */
export const recognition =
  'Slush 2025 volunteer · UN Millennium Fellow — top 9% of 44,000, appointed Campus Director.'
