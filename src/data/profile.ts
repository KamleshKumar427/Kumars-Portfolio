export const profile = {
  name: 'Kamlesh Kumar',
  title: 'Computer Scientist',
  headline: 'Payment systems, database internals, distributed backends.',
  tagline:
    'Full-stack engineer on PCI DSS Level 1 gateways and Apache AGE graph database work. MSc Computer Science at the University of Helsinki — grade 5/5.',
  summary:
    'I build and operate software where failure is expensive: payment gateways processing hundreds of millions of euros, graph database infrastructure, and high-volume transaction paths across remote teams in Ireland, Cyprus, and Pakistan.',
  location: 'Helsinki, Finland',
  email: 'kamlesh.kumar@helsinki.fi',
  phone: '+358 44 939 3428',
  links: {
    linkedin: 'https://linkedin.com/in/kamlesh-kumar-389847224',
    github: 'https://github.com/KamleshKumar427',
    stackoverflow: 'https://stackoverflow.com/users/15808441/kamlesh-kumar',
  },
  metrics: [
    { value: 'PCI DSS L1', label: 'payment gateway' },
    { value: '11%', label: 'throughput gain' },
    { value: '5/5', label: 'MSc GPA' },
  ],
} as const
