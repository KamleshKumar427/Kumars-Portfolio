export type Testimonial = {
  /** The person who gave the recommendation. */
  name: string
  /** Their professional title / headline. */
  title: string
  /** The recommendation text. */
  quote: string
  /** Optional relationship line, e.g. "Managed Kamlesh directly". */
  relationship?: string
  /** Optional date, e.g. "July 2025". */
  date?: string
  /**
   * Optional headshot under public/images/testimonials/.
   * If omitted, the card falls back to the person's initials.
   */
  avatar?: string
  /** Optional link to their profile. */
  href?: string
}

export const testimonials: Testimonial[] = [



  
  {
    name: 'Shalini Sharma',
    title: 'CEO @ XSTRYV',
    quote:
      'I worked closely with Kamlesh at XSTRYV, where he joined as our only engineer and quickly became a core team member, owning our recruitment platform end-to-end while it served real users. He never behaved like just a developer. He joined every product discussion, pushed back when something didn\'t make sense, and understood the business behind the code. He was dependable, fast, and took ownership without being asked. Any team would be lucky to have him, and I recommend him without hesitation.',
    relationship: 'Managed Kamlesh directly',
    date: 'July 2025',
    avatar: '/images/testimonials/Shalini-Sharma.jpeg',
  },
{
    name: 'Asfa Jamil',
    title: 'AI Engineer @ AMAZON · CEO @ Data Pulse Technologies',
    quote:
      'I had the pleasure of working with Kamlesh on multiple projects, and I was consistently impressed by his technical skills and professional attitude. He is dependable, takes ownership of his work, and consistently delivers results. Kamlesh is a proficient full-stack developer with strong expertise in React, Java, and PostgreSQL. His eagerness to learn and contribute makes him a valuable asset to any team.',
    relationship: 'Managed Kamlesh directly',
    date: 'July 2025',
    avatar: '/images/testimonials/asfa-jamil.png',
  },
  {
    name: 'Nandhini Jayakumar',
    title: 'Operations Manager @ Bitnine',
    quote:
      'I had the pleasure of managing Kamlesh during his internship, and his performance exceeded expectations. He consistently demonstrated exceptional dedication and a keen ability to grasp complex concepts swiftly. His proactive approach to challenges and effective collaboration showcased admirable professional maturity. He is a valuable asset, and I confidently recommend him for his outstanding contributions.',
    relationship: 'Managed Kamlesh directly',
    date: 'January 2024',
    avatar: '/images/testimonials/nandhini-jayakumar.jpeg',
  },
  {
    name: 'Labiba Rifah Nanjeeba',
    title: 'Program Coordinator @ UN-MCN',
    quote:
      'I would highly recommend Kamlesh Kumar — he showed tremendous dedication and hard work managing his cohort for the Millennium Fellowship, Class of 2023. He led a cohort of 26 fellows at his campus. I believe he possesses great potential in leadership and social impact.',
    relationship: 'Was Kamlesh’s mentor',
    date: 'January 2024',
    avatar: '/images/testimonials/labiba-nanjeeba.jpeg',
  },
]
