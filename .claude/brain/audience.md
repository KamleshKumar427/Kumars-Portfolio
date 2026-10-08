# Who visits, and what they need

The site has one job: get the right people to contact Kamlesh, or to keep Kamlesh's CV in the yes pile. Every section, line and animation is judged by one question: does it help a real visitor decide that faster, and with more confidence?

## Where visitors come from

- **The CV and cover letters.** Every application links to kamleshkumar.eu, so most visitors already have the CV open. They come to check it, go deeper, and get a feel for the person. The site must agree with the CV, and add what a PDF can't: proof (code, papers, photos, recommendations), personality, and craft.
- **LinkedIn and direct messages.** Often opened on a phone, between other things.
- **People Kamlesh meets** at Slush, in Helsinki's startup scene and at the university, who want a quick look.
- **A search for the name.**

## The visitors

### Recruiter or talent partner (the most common visitor)
- 30 to 60 seconds, often on a phone, often not an engineer.
- Wants to write down: role, level, location, availability, main stack, companies, and whether to pass the candidate on.
- Must find all of that without reading a paragraph: the title, "Helsinki, open to roles", the three jobs with dates, one proof per job, the degree, the CV, an email address.
- Loses trust when dates or numbers don't match the CV, the title changes from one section to the next, the first screen says little, or the CV is hard to find.

### Hiring manager or tech lead
- 2 to 5 minutes on a laptop. An engineer, and skeptical of buzzwords.
- Wants to know what the candidate personally did, how hard it was, how big, what they owned, and how they think. Clicks GitHub links and opens a project or a paper.
- Needs specific bullets (what, how, result), honest scope (a team of two, a part-time internship), links to code, and some sign of judgment: a trade-off, a hard bug found and fixed.
- Loses trust when claims are inflated or vague, the skills list is longer than the evidence, or a number that sounds big turns out small ("67 commits" is about four a week). Also when the design gets in the way of reading.

### Engineer peer or interviewer
- Preparing an interview, or curious. Reads the projects, the papers and the Bitnine work, looking for things to ask about.
- Needs what was hard, what would be done differently, and repos that run.

### Founder or startup CTO (mostly /startups)
- Wants someone who can be the only engineer: ships alone, talks to users, keeps production up.
- Needs the XSTRYV story with honest scope: the platform already existed; Kamlesh was its sole full-stack engineer, managed and extended it across three panels, and later onboarded two developers. Pathways and Slush show a real part in the startup world. Nothing may suggest that Kamlesh founded XSTRYV.

### Design-literate visitor (the site as a work sample)
- Notices type, spacing, motion, speed, accessibility and consistency.
- The ink hero and the koi pond are for this visitor. They must never slow down or block the recruiter's path.

## The three tests

Run these against anything a visitor will see.

1. **5 seconds, first screen, on a phone.** Without scrolling or tapping: who is this, what do they do, where, are they available, and is there a reason to keep going? Nothing decorative may compete with those answers.
2. **30 seconds, skimming like a recruiter.** Reading only headings, kickers, figures, job titles and dates: role and level, the three jobs, one proof each, the degree, and where the CV and the email are.
3. **3 minutes, reading like a hiring manager.** Every claim specific and checkable, with a link behind it where possible, and nothing a skeptical engineer would discount.

## What a visitor should leave with

The site, the CV and LinkedIn tell one story:

- Kamlesh builds software where being wrong is expensive, and owns it end to end.
- That has happened in three places: a PCI DSS Level 1 payment gateway (Datapulse), a live recruitment platform run as its sole full-stack engineer (XSTRYV), and open-source tooling for Apache AGE, close to PostgreSQL internals (Bitnine, part-time).
- Around that: an MSc at the University of Helsinki (4.9/5), AI projects, and managers who vouch for the work.

The hero has no tagline any more (removed 2026-10-06): name, title, location. About carries the summary.

**Open question for Kamlesh, not for Claude to settle:** the title. The hero says "AI Full-Stack Software Engineer" (set 2026-10-06). The CV says "Full-Stack Software Engineer, AI Agents & DevOps". About lists "Forward Deployed Engineer · Software Architect" as aspirations (set 2026-10-05). A recruiter writes down one title. Raise this whenever a change touches the hero, About, the page title or the SEO text.

## The page, section by section

What each section is for. When you change a section, keep it doing its job. If it no longer does one, say so.

| # | Section (id) | Its job | Main visitor |
|---|---|---|---|
| 1 | Hero (`hero`) | Who, what, where, available; sets the tone (ink on water) | everyone |
| 2 | About (`about`) | The one first-person gist, plus quick facts | recruiter |
| 3 | Experience (`experience`) | The evidence: three roles, figures, what was done | hiring manager, recruiter |
| 4 | Koi pond (no id; class `koi-section`) | A playful breather and a craft moment. Must never trap the scroll | design-literate |
| 5 | Education (`education`) | Degrees, grade, scholarship, thesis, transcripts | recruiter |
| 6 | Skills (`skills`) | Keywords, grouped, for a quick scan | recruiter |
| 7 | Certifications (`certifications`) | Courses, with certificates | recruiter |
| 8 | Projects (`lab`) | Range and code: AI, software, writing | engineer, hiring manager |
| 9 | Recognition (`recognition`) | Leadership: UN Millennium Fellowship, Slush | recruiter, hiring manager |
| 10 | Testimonials (`testimonials`) | Managers and mentors vouching for the work | everyone |
| 11 | Contact (`contact`) | One clear next step | everyone |
| /startups | `startup-hero`, `xstryv`, `pathways`, `slush`, `contact` | The startup side: XSTRYV, the Pathways pre-incubator, Slush | founders |

After the pond, sections alternate between plain and tinted (`section--alt`): Education plain, Skills tinted, Certifications plain, Projects tinted, Recognition plain, Testimonials tinted, Contact plain. Moving or adding a section means re-checking that order.
