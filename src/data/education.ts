export type Education = {
  degree: string
  school: string
  location: string
  period: string
  highlight?: string
  details: string[]
}

export const education: Education[] = [
  {
    degree: 'Master of Science in Computer Science',
    school: 'University of Helsinki',
    location: 'Helsinki, Finland',
    period: 'Sep 2025 – Present',
    highlight: 'Grade: 5/5',
    details: [
      'Focus: Software engineering, backend, system design, scalable architectures, modern practices.',
      'Coursework: Distributed Systems, DevOps, Full-Stack Development (JavaScript, React, TypeScript, Node.js, databases) with focus on scalable apps.',
    ],
  },
  {
    degree: 'Bachelor of Science in Computer Science',
    school: 'National University of Sciences and Technology (NUST)',
    location: 'Islamabad, Pakistan',
    period: 'Sep 2020 – Jun 2024',
    details: [
      'Final Year Project: Led a VR metaverse classroom (WebXR, Three.js) using fine-tuned LLaMA-2 7B; ran on Meta Quest 2 for teacher interaction and live evaluation.',
      'Core courses: Databases, Distributed Computing, Operating Systems, OOP, Networks, DSA.',
    ],
  },
]
