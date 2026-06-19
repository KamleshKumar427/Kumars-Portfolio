export type Project = {
  title: string
  description: string
  tools: string[]
  github?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    title: 'Payment Gateway Integrations',
    description:
      'Google Pay and Apple Pay integrations on a PCI DSS Level 1 gateway processing hundreds of millions of euros — merchant onboarding, webhooks, and mobile APIs.',
    tools: ['Java', 'Spring Boot', 'React', 'JWT', 'MSSQL', 'Azure'],
    featured: true,
  },
  {
    title: 'Agedb-Cloud (DBaaS)',
    description:
      'Database-as-a-Service for Apache AGE graph database — hosted on DigitalOcean with a web interface for collaborative use without local setup.',
    tools: ['React', 'Node.js', 'MongoDB', 'PM2', 'Apache AGE'],
    github: 'https://github.com/AGEDB-INC/Cloud-Express',
    featured: true,
  },
  {
    title: 'VR Metaverse Classroom',
    description:
      'Final year project: WebXR classroom on Meta Quest 2 with fine-tuned LLaMA-2 7B for teacher interaction and live student evaluation.',
    tools: ['WebXR', 'Three.js', 'LLaMA-2', 'Python'],
    featured: true,
  },
  {
    title: 'Assessment & Feedback with LLMs',
    description:
      'System for generating automatic assessments and post-result feedback using LLaMA-2 7B and LangChain to enhance the educational process.',
    tools: ['LangChain', 'Python', 'PyTorch', 'LLaMA-2'],
    github:
      'https://github.com/KamleshKumar427/Assessment-Generation-and-Realtime-Feedback-System-using-Large-Language-Models',
  },
  {
    title: 'DistilGPT-2 Fine-tuning',
    description:
      'Fine-tuned DistilGPT-2 on 273K writing prompts for coherent, creative story generation from given prompts.',
    tools: ['DistilGPT-2', 'Python', 'PyTorch', 'Hugging Face'],
    github: 'https://github.com/KamleshKumar427/DistilGpt2_fineTunning',
  },
  {
    title: 'JSON Files Search Engine',
    description:
      'Search engine inspired by Google’s original paper — queries 6 GB of JSON data for multi-word searches in under 1 second.',
    tools: ['Python', 'NLTK'],
    github: 'https://github.com/KamleshKumar427/JsonFilesSearchEngine',
  },
  {
    title: 'Snake Game in x86 Assembly',
    description:
      'Team-led Snake game in assembly with dynamic movement, collision detection, and reward generation; optimized memory via manual stack and heap allocation.',
    tools: ['x86 Assembly', 'MASM/TASM'],
  },
  {
    title: 'National ID Card Detector',
    description:
      'OpenCV application detecting Pakistan’s National ID cards with 95% accuracy across angles, dimensions, and environments.',
    tools: ['Python', 'OpenCV'],
    github: 'https://github.com/KamleshKumar427/National_ID_Card_detection-',
  },
]
