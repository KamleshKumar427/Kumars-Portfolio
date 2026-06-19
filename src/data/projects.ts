export type Project = {
  title: string
  description: string
  tools: string[]
  github?: string
  featured?: boolean
}

// Personal projects / technical range (Lab · chapter 03). Work projects live in
// the Production chapter; this list tracks the CV's personal + final-year work.
export const projects: Project[] = [
  {
    title: 'VR Metaverse Classroom',
    description:
      'Final-year project: a WebXR classroom on Meta Quest 2 with a fine-tuned LLaMA-2 7B model for live teacher interaction and student evaluation.',
    tools: ['WebXR', 'Three.js', 'LLaMA-2 7B', 'Python'],
    featured: true,
  },
  {
    title: 'JSON Files Search Engine',
    description:
      'Search engine inspired by Google’s paper “The Anatomy of a Large-Scale Hypertextual Web Search Engine” — queries 6 GB of JSON data for multi-word searches in under 1 second.',
    tools: ['Python', 'NLTK'],
    github: 'https://github.com/KamleshKumar427/JsonFilesSearchEngine',
    featured: true,
  },
  {
    title: 'DistilGPT-2 Fine-tuning for Writing Prompts',
    description:
      'Fine-tuned DistilGPT-2 on a 273K-example writingprompts dataset to generate coherent, creative stories from given prompts.',
    tools: ['Python', 'PyTorch', 'Transformers', 'Hugging Face'],
    github: 'https://github.com/KamleshKumar427/DistilGpt2_fineTunning',
  },
  {
    title: 'National ID Card Detector',
    description:
      'OpenCV application detecting ID cards with 95% accuracy across varying angles, dimensions, and environments; initially tailored for Pakistan’s National ID.',
    tools: ['Python', 'OpenCV'],
    github: 'https://github.com/KamleshKumar427/National_ID_Card_detection-',
  },
  {
    title: 'Snake Game in x86 Assembly',
    description:
      'Led a team of three to build Snake in assembly — dynamic movement, collision detection, and reward generation with manual stack/heap memory management.',
    tools: ['x86 Assembly', 'MASM/TASM'],
  },
]
