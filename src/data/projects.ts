// Personal projects for the Lab section's tabs. `ranks` decides which tab a
// project shows in and where; `category` only picks the featured card's badge.
export type ProjectCategory = 'AI' | 'GENERAL'

export type Project = {
  title: string
  description: string
  tech: string[]
  github: string | null
  /** Optional pictures under public/images/projects/, shown as a slider on
   *  the card in this order. `fit: 'contain'` keeps a diagram whole instead
   *  of cropping it to the card. */
  images?: ProjectImage[]
  /** rank within its section (1 = most important) */
  /** Where the project shows, and its position in that tab (1 = first).
   *  A project can appear in both tabs; no rank means it isn't shown. */
  ranks: { software?: number; ai?: number }
  /** A line above the title, e.g. that a project was team coursework. */
  context?: string
  /** Drives the featured card's badge only. */
  category: ProjectCategory
}

export type ProjectImage = { src: string; alt: string; fit?: 'cover' | 'contain' }

export const projects: Project[] = [
  {
    title: 'Cloud DevOps: AWS Deployment with Infrastructure-as-Code',
    description:
      'Deployed a containerized web app on AWS entirely from code, with AWS CDK. ECS Fargate, ECR, the load balancer, S3, CloudFront and the networking are all versioned and come up with one command. CI-style scripts for Windows, macOS and Linux deploy the stack, check it, and tear it down again in minutes.',
    tech: ['AWS CDK', 'Terraform', 'Docker', 'ECS Fargate', 'CloudFront', 'S3', 'CI/CD', 'TypeScript'],
    github: 'https://github.com/KamleshKumar427/WebApplicationAWSHostingUsingIaC',
    images: [
      {
        src: '/images/projects/aws-iac/architecture.svg',
        alt: 'AWS architecture: CloudFront in front of an S3 frontend and, through a load balancer in a VPC, an Express API on ECS Fargate',
        fit: 'contain',
      },
      { src: '/images/projects/aws-iac/app-light.png', alt: 'The deployed portfolio tracker app, light theme' },
      { src: '/images/projects/aws-iac/app-dark.png', alt: 'The deployed portfolio tracker app, dark theme' },
    ],
    ranks: { software: 1 },
    category: 'GENERAL',
  },
  {
    title: 'Nodetalk: Distributed Chat',
    context: 'University of Helsinki · Distributed Systems course project',
    description:
      'Three-node prototype where the same Python server runs on three university machines and each node connects to the other two over WebSockets. A chat message sent by a client to any node is replicated to all three, so every node holds every message in memory.',
    tech: ['Python', 'WebSockets'],
    github: 'https://github.com/hojahoja/Nodetalk',
    ranks: { software: 2 },
    category: 'GENERAL',
  },
  {
    title: 'LLM Agent with MCP Tool-Calling',
    description:
      "An agent you talk to, by voice or text, which then goes and does the work. It runs on OpenAI's LLMs, and custom Model Context Protocol (MCP) tools give it secure access to a user's Google Calendar and personal context. It lives in Telegram as a Mini App, and on the web.",
    tech: ['LLM Agents', 'MCP', 'OpenAI Realtime API', 'Next.js', 'TypeScript', 'MongoDB', 'Telegram'],
    github: 'https://github.com/KamleshKumar427/micromanager-agent',
    ranks: { software: 3, ai: 3 },
    category: 'GENERAL',
  },
  {
    title: 'Compiler for a Custom Language',
    description:
      'Built a compiler from scratch in Python that takes source code in a custom language all the way down to native x86-64 Linux assembly. Implemented every stage of the pipeline by hand: tokenizer, parser, type checker, intermediate representation, and code generation, then packaged it as a Docker image with a full test suite.',
    tech: ['Python', 'Docker', 'x86-64 Assembly'],
    github: 'https://github.com/KamleshKumar427/my-lang-compiler',
    ranks: { software: 4 },
    category: 'GENERAL',
  },
  {
    title: 'JSON Files Search Engine',
    description:
      "Built a search engine inspired by Google's research paper 'The Anatomy of a Large-Scale Hypertextual Web Search Engine,' querying 6 GB of JSON data for multi-word searches in under 1 second.",
    tech: ['Python', 'NLTK'],
    github: 'https://github.com/KamleshKumar427/JsonFilesSearchEngine',
    ranks: {},
    category: 'GENERAL',
  },
  {
    title: 'National ID Card Detector',
    description:
      "An OpenCV app that finds ID cards at 95% accuracy across varying angles, sizes and environments. Built first for Pakistan's National ID.",
    tech: ['Python', 'OpenCV'],
    github: 'https://github.com/KamleshKumar427/National_ID_CARD_detection-',
    ranks: { ai: 5 },
    category: 'GENERAL',
  },
  {
    title: 'Snake Game in x86 Assembly',
    description:
      'Led a team of three to build a Snake game in assembly, featuring dynamic movement, collision detection, and reward generation with manual stack/heap memory management.',
    tech: ['x86 Assembly', 'MASM/TASM'],
    github: 'https://github.com/KamleshKumar427/Snake_game_Assembly_Language',
    ranks: { software: 5 },
    category: 'GENERAL',
  },
  {
    title: 'VR Metaverse Classroom',
    description:
      'Built a VR metaverse classroom (WebXR, Three.js) with a fine-tuned LLaMA-2 7B model on Meta Quest 2 for live teacher interaction.',
    tech: ['WebXR', 'Three.js', 'Python', 'PyTorch', 'LLaMA-2 7B'],
    github: 'https://github.com/KamleshKumar427/AI-based-conversational-bot-in-Metaverse',
    images: [
      { src: '/images/projects/VR-metaverse1.png', alt: 'VR metaverse classroom, screenshot 1' },
      { src: '/images/projects/VR-metaverse2.png', alt: 'VR metaverse classroom, screenshot 2' },
    ],
    ranks: { ai: 1 },
    category: 'AI',
  },
  {
    title: 'Automatic Assessments and Feedback System using LLMs',
    description:
      'Writes assessments for teachers and gives students feedback once their results are in, on LLaMA-2 7B and LangChain.',
    tech: ['LangChain', 'Python', 'PyTorch', 'LLaMA-2 7B'],
    github: 'https://github.com/KamleshKumar427/Assessment-Generation-and-Realtime-Feedback-System-using-Large-Language-Models',
    ranks: { ai: 4 },
    category: 'AI',
  },
  {
    title: 'Fine-tuning DistilGPT-2 for Writing Prompts',
    description:
      'Fine-tuned DistilGPT-2 on a 273K-example writingprompts dataset to generate coherent, creative stories from prompts.',
    tech: ['Python', 'PyTorch', 'Transformers', 'Hugging Face'],
    github: 'https://github.com/KamleshKumar427/DistilGpt2_fineTunning',
    ranks: {},
    category: 'AI',
  },
  {
    title: 'Atmospheric Event Classification',
    description:
      'A two-stage pipeline that sorts each day of weather data from the SMEAR II station in Hyytiälä, Finland into new particle formation event types (Ia, Ib, II) or no event. Calibrated logistic regression decides whether anything happened; random forest picks the type. Kaggle leaderboard score 0.76139.',
    tech: ['Python', 'scikit-learn', 'XGBoost', 'Random Forest', 'Logistic Regression'],
    github: null,
    ranks: { ai: 2 },
    category: 'AI',
  },
]

/** Projects for a tab, in that tab's order. */
export function projectsByCategory(category: ProjectCategory): Project[] {
  const key = category === 'AI' ? 'ai' : 'software'
  return projects
    .filter((p) => p.ranks[key] !== undefined)
    .sort((a, b) => (a.ranks[key] ?? 0) - (b.ranks[key] ?? 0))
}
