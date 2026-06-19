/** The dossier's chapters — single source of truth for the table of contents,
 *  the chapter pager, and the header nav. The site is a book; these are its pages. */
export type Chapter = {
  /** two-digit chapter number, e.g. "01" */
  n: string
  /** short slug / nav label */
  slug: string
  /** chapter title (serif) */
  title: string
  /** route path */
  route: string
  /** who this chapter answers */
  audience: string
  /** one-line descriptor for the table of contents */
  summary: string
}

export const chapters: Chapter[] = [
  {
    n: '00',
    slug: 'index',
    title: 'Index',
    route: '/',
    audience: 'the thesis',
    summary: 'The cover — what this is, and where to go next.',
  },
  {
    n: '01',
    slug: 'production',
    title: 'Production',
    route: '/experience',
    audience: 'for CTOs',
    summary:
      'A PCI-DSS Level 1 payment gateway at hundreds of millions of euros, and open-source database internals.',
  },
  {
    n: '02',
    slug: 'venture',
    title: 'Venture',
    route: '/startup',
    audience: 'on ownership',
    summary: 'XSTRYV — a recruitment platform built and run solo — plus founder community.',
  },
  {
    n: '03',
    slug: 'lab',
    title: 'Lab',
    route: '/projects',
    audience: 'for engineers',
    summary: 'Personal builds and technical range, from search engines to x86 assembly.',
  },
  {
    n: '04',
    slug: 'profile',
    title: 'Profile',
    route: '/about',
    audience: 'for hiring',
    summary: 'Education, the skills matrix, certifications, and how to reach me.',
  },
]

/** Chapters shown in the cover table of contents and the header (everything past the cover). */
export const tocChapters = chapters.filter((c) => c.route !== '/')

/** The chapter that follows `route` in book order (for the ChapterPager). */
export function nextChapter(route: string): Chapter | undefined {
  const i = chapters.findIndex((c) => c.route === route)
  if (i < 0 || i >= chapters.length - 1) return undefined
  return chapters[i + 1]
}
