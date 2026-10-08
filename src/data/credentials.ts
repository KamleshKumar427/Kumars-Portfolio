// Certifications, from Curriculum_Vitae_Md.md, with links to the certificates.
export type Credential = {
  title: string
  issuer: string
  year: string
  detail: string
  /** mark shown on the card — a skill name SkillIcon knows */
  icon?: string
  /** link to the certificate, when there is one */
  href?: string
  /** link text; defaults to "Certificate" */
  linkLabel?: string
}

export const credentials: Credential[] = [
  {
    title: 'DevOps with Docker',
    issuer: 'University of Helsinki · MOOC',
    year: '2026',
    detail: 'Docker, Compose, networking, volumes and multi-stage builds.',
    icon: 'Docker',
    href: 'https://drive.google.com/file/d/1faaH0bdAFqiBw7d8yrfIfLqqFx2LOqpG/view?usp=sharing',
  },
  {
    title: 'DevOps with Kubernetes',
    issuer: 'University of Helsinki · MOOC',
    year: '2026 · ongoing',
    detail:
      'Learning to run Kubernetes clusters and deploy to them (deployments, services, ingress and gateways), with GitOps pipelines, auto-scaling, and monitoring through Prometheus and Grafana.',
    icon: 'Kubernetes',
    href: 'https://courses.mooc.fi/org/uh-cs/courses/devops-with-kubernetes-2026',
    linkLabel: 'Course',
  },
  {
    title: 'Java Spring Framework 6 with Spring Boot 3',
    issuer: 'Udemy',
    year: '2024',
    detail: 'Spring 6, Spring Boot 3, JDBC, JPA, Security, Docker and microservices.',
    icon: 'Spring Boot',
    href: 'https://www.udemy.com/course/spring-5-with-spring-boot-2/?srsltid=AU7gw4VtBu3BpeljexkspDR_McvFTv41ux7NzDsBMVKRFjTbd7YL2DXR&couponCode=PMNVD3025',
    linkLabel: 'Course',
  },
  {
    title: 'PostgreSQL Indexes',
    issuer: 'Percona University',
    year: '2023',
    detail: 'A deep dive into index internals and query planning in PostgreSQL.',
    icon: 'PostgreSQL',
    href: 'https://drive.google.com/file/d/1P5wYMxwIZHJF5cpFJzTe8Iv74rvYfmr1/view?usp=sharing',
  },
  {
    title: 'Deep Learning Specialization',
    issuer: 'Coursera · Andrew Ng',
    year: '2023',
    detail: 'Neural networks and deep learning, end to end.',
    icon: 'Deep Learning',
    href: 'https://drive.google.com/drive/u/0/folders/1ztH8GpjmlI6L7TDmhIhygf5X9geOaRjf',
    // a folder: the specialization issues one certificate per course
    linkLabel: 'Certificates',
  },
]
