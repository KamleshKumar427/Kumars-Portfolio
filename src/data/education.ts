export type Education = {
  degree: string
  school: string
  period: string
  /** Logo under public/images/education/ */
  logo?: string
  /** mono logos (e.g. Helsinki wordmark) invert on dark; color logos stay as-is */
  logoTheme?: 'mono' | 'color'
  /** what the degree is actually pointed at */
  focus?: string
  note?: string
  /** claims worth stating in full */
  points?: string[]
  /** figures, shown as boxes — quicker to read than the same numbers in a sentence */
  stats?: { value: string; label: string }[]
  /** coursework worth naming */
  courses?: string[]
  /** proof: transcripts, certificates, profiles */
  links?: { label: string; href: string }[]
}

export const education: Education[] = [
  {
    degree: 'MSc Computer Science',
    school: 'University of Helsinki',
    period: 'Sep 2025 — Mar 2027',
    logo: '/images/education/helsinki.svg',
    logoTheme: 'mono',
    focus:
      'Study track: Software Engineering — scalable systems, full-stack development, ML/deep learning and MLOps.',
    points: [
      'Awarded a 100% scholarship on academic merit.',
      'Master’s thesis: a deep learning algorithm for detecting hypertensive retinopathy in cats from retinal fundus images, part of Optomed Oy’s veterinary AI project.',
      'The thesis is funded by an AI Thesis Grant from the Technology Industries of Finland Centennial Foundation (2026).',
      'Expected graduation: May 2027.',
    ],
    stats: [
      { value: '4.9 / 5', label: 'Grade' },
      { value: '85 / 90 ECTS', label: 'Coursework completed' },
      { value: 'Deep learning · retinal images', label: 'Master’s thesis · 30 ECTS · ongoing' },
      { value: '100%', label: 'Scholarship · merit-based' },
    ],
    courses: [
      'Distributed Systems',
      'DevOps',
      'Machine Learning',
      'MLOps',
      'Docker & Kubernetes',
      'Full-Stack (React · TypeScript · Node)',
      'Databases',
      'Scalable Architecture',
    ],
    links: [
      {
        label: 'Transcript',
        href: 'https://drive.google.com/file/d/1wKcTWc5bp_OL3i7F3ANYalVgW1f-oRul/view?usp=drive_link',
      },
    ],
  },
  {
    degree: 'BSc Computer Science',
    school: 'NUST · Islamabad',
    period: 'Sep 2020 — Jun 2024',
    logo: '/images/education/nust.svg',
    logoTheme: 'color',
    focus: 'Computer-science fundamentals, with a final year spent on VR and language models.',
    points: [
      'Awarded a 100% scholarship on academic merit.',
      'Vice-President of Hack Club, and a United Nations MCN Fellow.',
    ],
    stats: [{ value: '100%', label: 'Scholarship · merit-based' }],
    note: 'Final-year project: WebXR metaverse classroom with a fine-tuned LLaMA-2 7B model on Meta Quest 2.',
    courses: [
      'Databases',
      'Distributed Computing',
      'Operating Systems',
      'Computer Networks',
      'OOP',
      'Data Structures & Algorithms',
    ],
    links: [
      {
        label: 'Transcript',
        href: 'https://drive.google.com/file/d/1JHPBLhS0tAdyOVVjbnvBHtfLHKrYHLy8/view?usp=sharing',
      },
      {
        label: 'United Nations MCN Fellow',
        href: 'https://drive.google.com/drive/u/0/folders/1g2FoR_6SYC1bY6Og4j09LgebYkWnFTrw',
      },
      {
        label: 'Vice-President · Hack Club',
        href: 'https://drive.google.com/file/d/1m9TwM5f71ssgoHWki6CvfqVYYEVvjyzq/view?usp=drive_link',
      },
    ],
  },
]
