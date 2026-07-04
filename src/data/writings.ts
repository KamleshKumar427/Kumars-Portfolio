export type Writing = {
  title: string
  /** Venue / context line shown above the title. */
  meta: string
  description: string
  /** PDF under public/ */
  pdf: string
  /** Page aspect ratio (width / height) so the lightbox frame fits it exactly.
   *  A4 portrait ≈ 595 / 842. */
  aspect: number
}

export const writings: Writing[] = [
  {
    title: 'How LLM-Assisted Coding Affects Functional Correctness',
    meta: 'University of Helsinki · Literature review',
    description:
      'A focused review of the empirical evidence on whether LLM-generated and LLM-refactored code introduces subtle logic errors, wrong assumptions, and missed edge cases that slip past human review.',
    pdf: '/AcadmicWrittings/llm-assisted-coding-functional-correctness.pdf',
    aspect: 595 / 842,
  },
  {
    title: 'Where Should the LLM Live? Three Placements for Language Models in Analytical Data Systems',
    meta: 'University of Helsinki · Data Warehousing & BI',
    description:
      'Comparing three architectures for bringing Large Language Models into OLAP and data-warehousing systems — from keeping the model outside the analytical engine to embedding it deep inside the query path.',
    pdf: '/AcadmicWrittings/where-should-the-llm-live.pdf',
    aspect: 595 / 842,
  },
]
