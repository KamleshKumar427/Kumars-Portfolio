export const profile = {
  name: 'Kamlesh Kumar',
  title: 'AI Full-Stack Engineer',
  headline: 'Hand me the part that has to work. I’ll own it end to end.',
  tagline:
    'Full-stack engineer on a PCI DSS Level 1 payment gateway, and the only engineer on a live recruitment platform (1,600+ users, 250+ companies). MSc Computer Science, University of Helsinki.',
  summary:
    'AI full-stack engineer with 2+ years owning production systems end to end. I take on the work most people would rather not touch — payment routing, PCI-compliant APIs, database internals — and I see it through: from a fintech gateway moving hundreds of millions of euros to a recruitment platform I ran as its only engineer.',
  /** The only place on the site that speaks in the first person, and it stays
   *  a gist: the roles, degrees and projects below are the detail, so saying
   *  it twice only made people skim. Set in giant quote marks (AboutSection). */
  about:
    'I’m a full-stack engineer based in Helsinki, with two years of production work experience: a PCI DSS Level 1 payment gateway, a recruitment platform, and core database internals.',
  /** Short answers for the at-a-glance panel beside the About copy. What I
   *  want next leads, and "open to" carries the same green dot as the hero. */
  glance: [
    { label: 'Open to', value: 'Discussing opportunities', led: true },
    { label: 'Aspiring', value: 'Forward Deployed Engineer · Software Architect' },
    { label: 'Based in', value: 'Helsinki, Finland' },
    { label: 'Thesis', value: 'Deep learning in healthcare' },
    { label: 'Focus', value: 'Full-stack · payments · DevOps · AI' },
    { label: 'Shipped in', value: 'Fintech · startups · open source' },
  ],
  location: 'Helsinki, Finland',
  email: 'kamlesh.kumar@helsinki.fi',
  phone: '+358 44 939 3428',
  links: {
    linkedin: 'https://linkedin.com/in/kamlesh-kumar-389847224',
    github: 'https://github.com/KamleshKumar427',
    stackoverflow: 'https://stackoverflow.com/users/15808441/kamlesh-kumar',
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
