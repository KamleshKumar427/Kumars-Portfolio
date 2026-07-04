// Personal-projects data — the source of truth for the Lab section's tabs.
// Which tab a project appears in is controlled by the featureInAi /
// featureInGeneral flags (independent of `category`, which only drives the
// featured card's badge). Each tab is ranked by `order`.
export type ProjectCategory = 'AI' | 'GENERAL'

export type Project = {
  title: string
  description: string
  tech: string[]
  github: string | null
  /** Optional screenshots under public/images/projects/ */
  images?: string[]
  /** rank within its section (1 = most important) */
  order: number
  category: ProjectCategory
  featureInAi: boolean
  featureInGeneral: boolean
}

export const projects: Project[] = [
  {
    title: 'Cloud DevOps: AWS Deployment with Infrastructure-as-Code',
    description:
      'Designed and automated the full cloud deployment of a containerized web app on AWS using Infrastructure-as-Code (AWS CDK). Provisioned the entire environment (ECS Fargate, ECR, Application Load Balancer, S3, CloudFront, and networking) as versioned code that spins up with a single command, and built cross-platform CI-style scripts for Windows, macOS, and Linux to deploy, verify, and tear down the whole stack reproducibly in minutes.',
    tech: ['AWS CDK', 'Terraform', 'Docker', 'ECS Fargate', 'CloudFront', 'S3', 'CI/CD', 'TypeScript'],
    github: 'https://github.com/KamleshKumar427/WebApplicationAWSHostingUsingIaC',
    order: 1,
    category: 'GENERAL',
    featureInAi: false,
    featureInGeneral: true,
  },
  {
    title: 'LLM Agent with MCP Tool-Calling',
    description:
      "Built an AI agent that gets things done through natural voice and text conversations, powered by OpenAI's LLMs. Gave the agent real-world abilities using the Model Context Protocol (MCP), building custom MCP tools that let it securely read and act on a user's Google Calendar and personal context. Wired it into Telegram (with a Mini App) and the web so users can just talk to it and have it take action on their behalf.",
    tech: ['LLM Agents', 'MCP', 'OpenAI Realtime API', 'Next.js', 'TypeScript', 'MongoDB', 'Telegram'],
    github: 'https://github.com/KamleshKumar427/micromanager-agent',
    order: 2,
    category: 'GENERAL',
    featureInAi: true,
    featureInGeneral: false,
  },
  {
    title: 'Compiler for a Custom Language',
    description:
      'Built a compiler from scratch in Python that takes source code in a custom language all the way down to native x86-64 Linux assembly. Implemented every stage of the pipeline by hand: tokenizer, parser, type checker, intermediate representation, and code generation, then packaged it as a Docker image with a full test suite.',
    tech: ['Python', 'Docker', 'x86-64 Assembly'],
    github: 'https://github.com/KamleshKumar427/my-lang-compiler',
    order: 3,
    category: 'GENERAL',
    featureInAi: false,
    featureInGeneral: true,
  },
  {
    title: 'JSON Files Search Engine',
    description:
      "Built a search engine inspired by Google's research paper 'The Anatomy of a Large-Scale Hypertextual Web Search Engine,' querying 6 GB of JSON data for multi-word searches in under 1 second.",
    tech: ['Python', 'NLTK'],
    github: 'https://github.com/KamleshKumar427/JsonFilesSearchEngine',
    order: 4,
    category: 'GENERAL',
    featureInAi: false,
    featureInGeneral: true,
  },
  {
    title: 'National ID Card Detector',
    description:
      "Developed an OpenCV application detecting ID cards with 95% accuracy across varying angles, dimensions, and environments; initially tailored for Pakistan's National ID.",
    tech: ['Python', 'OpenCV'],
    github: 'https://github.com/KamleshKumar427/National_ID_CARD_detection-',
    order: 5,
    category: 'GENERAL',
    featureInAi: false,
    featureInGeneral: true,
  },
  {
    title: 'Snake Game in x86 Assembly',
    description:
      'Led a team of three to build a Snake game in assembly, featuring dynamic movement, collision detection, and reward generation with manual stack/heap memory management.',
    tech: ['x86 Assembly', 'MASM/TASM'],
    github: 'https://github.com/KamleshKumar427/Snake_game_Assembly_Language',
    order: 6,
    category: 'GENERAL',
    featureInAi: false,
    featureInGeneral: true,
  },
  {
    title: 'VR Metaverse Classroom',
    description:
      'Built a VR metaverse classroom (WebXR, Three.js) with a fine-tuned LLaMA-2 7B model on Meta Quest 2 for live teacher interaction.',
    tech: ['WebXR', 'Three.js', 'Python', 'PyTorch', 'LLaMA-2 7B'],
    github: 'https://github.com/KamleshKumar427/AI-based-conversational-bot-in-Metaverse',
    images: ['/images/projects/VR-metaverse1.png', '/images/projects/VR-metaverse2.png'],
    order: 1,
    category: 'AI',
    featureInAi: true,
    featureInGeneral: false,
  },
  {
    title: 'Automatic Assessments and Feedback System using LLMs',
    description:
      'Created an innovative system for generating automatic assessments and providing feedback post-results utilizing the capabilities of LLaMA-2 7B and LangChain, aimed at enhancing the educational process for teachers and students.',
    tech: ['LangChain', 'Python', 'PyTorch', 'LLaMA-2 7B'],
    github: 'https://github.com/KamleshKumar427/Assessment-Generation-and-Realtime-Feedback-System-using-Large-Language-Models',
    order: 2,
    category: 'AI',
    featureInAi: true,
    featureInGeneral: false,
  },
  {
    title: 'Fine-tuning DistilGPT-2 for Writing Prompts',
    description:
      'Fine-tuned DistilGPT-2 on a 273K-example writingprompts dataset to generate coherent, creative stories from prompts.',
    tech: ['Python', 'PyTorch', 'Transformers', 'Hugging Face'],
    github: 'https://github.com/KamleshKumar427/DistilGpt2_fineTunning',
    order: 3,
    category: 'AI',
    featureInAi: false,
    featureInGeneral: false,
  },
  {
    title: 'Atmospheric Event Classification',
    description:
      'Developed a two-stage ML pipeline to classify daily atmospheric conditions into new particle formation (NPF) event types (Ia, Ib, II) or nonevent using meteorological data from the SMEAR II station in Hyytiälä, Finland. Used calibrated Logistic Regression for binary event detection and Random Forest for multi-class classification, achieving a Kaggle leaderboard score of 0.76139.',
    tech: ['Python', 'scikit-learn', 'XGBoost', 'Random Forest', 'Logistic Regression'],
    github: null,
    order: 4,
    category: 'AI',
    featureInAi: true,
    featureInGeneral: false,
  },
]

/** Projects for a section, chosen by its feature flag and ranked by `order`. */
export function projectsByCategory(category: ProjectCategory): Project[] {
  return projects
    .filter((p) => (category === 'AI' ? p.featureInAi : p.featureInGeneral))
    .sort((a, b) => a.order - b.order)
}
