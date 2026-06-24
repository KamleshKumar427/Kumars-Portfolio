// Lab projects — mirrors Projects.json (source of truth). Two categories the UI
// can toggle between (AI / General), each ranked by `order`.
export type ProjectCategory = 'AI' | 'GENERAL'

export type Project = {
  title: string
  description: string
  tech: string[]
  github: string | null
  /** rank within its category (1 = most important) */
  order: number
  category: ProjectCategory
  featureInAi: boolean
  featureInGeneral: boolean
}

export const projects: Project[] = [
  {
    title: 'VR Metaverse Classroom',
    description:
      'A WebXR classroom on Meta Quest 2 with a fine-tuned LLaMA-2 7B model for live teacher interaction and student evaluation.',
    tech: ['WebXR', 'Three.js', 'Python', 'PyTorch', 'LLaMA-2 7B'],
    github: 'https://github.com/KamleshKumar427/AI-based-conversational-bot-in-Metaverse',
    order: 1,
    category: 'AI',
    featureInAi: true,
    featureInGeneral: false,
  },
  {
    title: 'Fine-tuning DistilGPT-2 for Writing Prompts',
    description:
      'Fine-tuned DistilGPT-2 on a 273K-example writing-prompts dataset to generate coherent, creative short stories.',
    tech: ['Python', 'PyTorch', 'Transformers', 'Hugging Face'],
    github: 'https://github.com/KamleshKumar427/DistilGpt2_fineTunning',
    order: 4,
    category: 'AI',
    featureInAi: true,
    featureInGeneral: false,
  },
  {
    title: 'Assessments & Feedback with LLMs',
    description:
      'A system that generates automatic assessments and post-result feedback using LLaMA-2 7B and LangChain, aimed at enhancing teaching and learning.',
    tech: ['LangChain', 'Python', 'PyTorch', 'LLaMA-2 7B'],
    github: 'https://github.com/KamleshKumar427/Assessment-Generation-and-Realtime-Feedback-System-using-Large-Language-Models',
    order: 3,
    category: 'AI',
    featureInAi: true,
    featureInGeneral: false,
  },
  {
    title: 'Atmospheric Event Classification',
    description:
      'A two-stage ML pipeline classifying daily atmospheric conditions (NPF event types) from SMEAR II meteorological data — calibrated Logistic Regression then Random Forest. Kaggle score 0.76139.',
    tech: ['Python', 'scikit-learn', 'XGBoost', 'Random Forest'],
    github: 'https://github.com/darelj13/IML-Project',
    order: 2,
    category: 'AI',
    featureInAi: true,
    featureInGeneral: false,
  },
  {
    title: 'JSON Files Search Engine',
    description:
      'Inspired by Google’s “Anatomy of a Large-Scale Hypertextual Web Search Engine” — multi-word search across 6 GB of JSON in under a second.',
    tech: ['Python', 'NLTK'],
    github: 'https://github.com/KamleshKumar427/JsonFilesSearchEngine',
    order: 1,
    category: 'GENERAL',
    featureInAi: false,
    featureInGeneral: true,
  },
  {
    title: 'National ID Card Detector',
    description:
      'An OpenCV detector hitting 95% accuracy across varying angles, dimensions and lighting environments; initially tailored for Pakistan’s National ID.',
    tech: ['Python', 'OpenCV'],
    github: 'https://github.com/KamleshKumar427/National_ID_CARD_detection-',
    order: 2,
    category: 'GENERAL',
    featureInAi: false,
    featureInGeneral: true,
  },
  {
    title: 'Snake Game in x86 Assembly',
    description:
      'Led a team of three to build Snake in assembly — movement, collision detection, rewards, and manual stack/heap memory management.',
    tech: ['x86 Assembly', 'MASM/TASM'],
    github: 'https://github.com/KamleshKumar427/Snake_game_Assembly_Language',
    order: 3,
    category: 'GENERAL',
    featureInAi: false,
    featureInGeneral: true,
  },
]

/** Projects for a section, ranked by `order`. */
export function projectsByCategory(category: ProjectCategory): Project[] {
  return projects
    .filter((p) =>
      category === 'AI' ? p.featureInAi : p.featureInGeneral || p.category === 'GENERAL',
    )
    .filter((p) => p.category === category)
    .sort((a, b) => a.order - b.order)
}
