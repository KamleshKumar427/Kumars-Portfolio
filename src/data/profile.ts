export const profile = {
  name: 'Kamlesh Kumar',
  title: 'AI Full-Stack Software Engineer',
  tagline:
    'Full-stack engineer on a PCI DSS Level 1 payment gateway, and the only engineer on a live recruitment platform (1,600+ users, 250+ companies). MSc Computer Science, University of Helsinki.',
  summary:
    'AI full-stack engineer with 2+ years owning production systems end to end. I take on the work most people would rather not touch — payment routing, PCI-compliant APIs, database internals — and I see it through: from a fintech gateway moving tens of millions of euros to a recruitment platform I ran as its only engineer.',
  /** The only place on the site that speaks in the first person, and it stays
   *  a gist: the roles, degrees and projects below are the detail, so saying
   *  it twice only made people skim. Set in giant quote marks (AboutSection). */
  about:
    'A high-agency full-stack software engineer, with 2.5 years of production work experience on a PCI DSS Level 1 payment gateway, a recruitment platform, and open‑source database tooling.',
  /** Second line of the statement: smaller, in serif italic. */
  aboutNote: 'I hold a BSc in Computer Science and MSc completing soon.',
  /** Caption at the portrait's corner. */
  greeting: 'こんにちは — Hello — Hei — Bonjour — مرحبا 👋🏽 ',
  /** Short answers for the at-a-glance panel beside the About copy. What I
   *  want next leads, and "open to" carries the same green dot as the hero. */
  glance: [
    { label: 'Open to', value: 'Discussing opportunities', led: true },
    { label: 'Aspiring', value: 'Software Architect · Forward Deployed Engineer' },
    { label: 'Based in', value: 'Helsinki, Finland', flag: 'fi' },
    { label: 'Experience in', value: 'Fintech · Startups · Open Source' },
    { label: 'Master’s', value: 'Coursework completed · thesis ongoing' },
    { label: 'Thesis · due Mar 2027', value: 'Deep learning on retinal images' },
  ],
  /** About portrait, cut out of its background (transparent). Served from
   *  public/images/about/ as AVIF with a PNG fallback. */
  portrait: {
    avif: '/images/about/portrait.avif',
    src: '/images/about/portrait.png',
    alt: 'Kamlesh Kumar',
    width: 1024,
    height: 1024,
  },
  location: 'Helsinki, Finland',
  email: 'kamlesh.kumar@helsinki.fi',
  phone: '+358 44 939 3428',
  links: {
    linkedin: 'https://linkedin.com/in/kamlesh-kumar-389847224',
    github: 'https://github.com/KamleshKumar427',
    stackoverflow: 'https://stackoverflow.com/users/15808441/kamlesh-kumar',
    recommendations:
      'https://www.linkedin.com/in/kamlesh-kumar-%E2%9C%AA-389847224/details/recommendations/?detailScreenTabIndex=0',
  },
  cv: {
    /** Served from public/downloads/ — copied to dist root on build (GitHub Pages). */
    path: '/downloads/Kamlesh_Kumar_CV.pdf',
    filename: 'Kamlesh_Kumar_CV.pdf',
  },
  metrics: [
    { value: 'PCI DSS L1', label: 'payment gateway' },
    { value: '1,600+', label: 'xstryv users' },
    { value: '4.9/5', label: 'msc · helsinki' },
  ],
} as const
