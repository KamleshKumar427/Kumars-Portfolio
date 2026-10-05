// Recognition & volunteering. These used to be one 14-word line in education.ts;
// the detail below is all from Curriculum_Vitae_Md.md and was simply never shown.
export type Honour = {
  title: string
  org: string
  period: string
  /** kicker above the title */
  kind: string
  summary: string
  /** labelled figures shown as chips — the numbers are the point here */
  stats: { value: string; label: string }[]
  points: string[]
  /** proof — same shape as education's links, rendered the same way */
  links?: { label: string; href: string }[]
}

export const honours: Honour[] = [
  {
    kind: 'United Nations',
    title: 'Millennium Fellow, then Campus Director',
    org: 'UN Academic Impact · MCN',
    period: '2023',
    summary:
      'Selected as a Millennium Fellow from 44,000 applicants across 119 nations, then appointed Campus Director — a role given to the top 1% of the cohort.',
    stats: [
      { value: 'Top 9%', label: 'of 44,000 applicants' },
      { value: 'Top 1%', label: 'appointed campus director' },
      { value: '17', label: 'fellows led' },
    ],
    points: [
      'Led 17 fellows across 5 social-impact projects as Campus Director.',
      'Designed and delivered 6 training sessions for the cohort.',
      'Chosen from applicants across 119 nations; 119 campuses were selected worldwide.',
    ],
    links: [
      {
        label: 'Credentials',
        href: 'https://drive.google.com/drive/u/0/folders/1g2FoR_6SYC1bY6Og4j09LgebYkWnFTrw',
      },
    ],
  },
  {
    kind: 'Slush 2025',
    title: 'Founder Days volunteer',
    org: 'Slush · Helsinki',
    period: '2025',
    summary:
      'On-site crew for Founder Days at Slush, Europe’s largest startup event, helping run a gathering of more than 1,500 founders.',
    stats: [
      { value: '1,500+', label: 'founders hosted' },
      { value: "Europe's largest", label: 'startup event' },
    ],
    points: [
      'Supported Founder Days operations and attendee guidance on the ground.',
      'Helped coordinate a 1,500+ founder gathering across the event schedule.',
    ],
  },
]
