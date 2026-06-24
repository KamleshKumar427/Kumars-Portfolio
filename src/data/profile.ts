export const profile = {
  name: 'Kamlesh Kumar',
  title: 'Full-Stack Software Engineer',
  headline: 'Payment systems at scale, a solo-built startup, and database internals.',
  tagline:
    'Sole engineer on a live recruitment platform (1,600+ users, 250+ companies) and full-stack engineer on a PCI DSS Level 1 payment gateway handling hundreds of millions of euros. MSc Computer Science at the University of Helsinki — grade 5/5.',
  summary:
    'Full-Stack Software Engineer and MSc Computer Science student at the University of Helsinki, with 2+ years building production systems end-to-end. Sole engineer on a live startup recruitment platform (1,600+ users, 250+ companies) and full-stack engineer on a PCI DSS Level 1 payment gateway handling hundreds of millions of euros. I tend toward problems where being wrong is expensive: payment routing, PCI-compliant APIs, and graph database internals.',
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
    { value: '5/5', label: 'msc · helsinki' },
  ],
} as const
