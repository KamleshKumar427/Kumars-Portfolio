# Playbook: how the site should look, read and feel

Kamlesh's taste and the quality bar, written down so no session has to guess. When Kamlesh corrects a design or wording choice, add one dated line here, under "Taste" or "Turned down".

## The bar

Build it as well as the best sites on the web, as judged by the people who make them:

- **Apple product pages.** One idea per screen, large confident type, a lot of space, motion that explains instead of decorating, and nothing on the page that doesn't need to be there.
- **The best design-engineer portfolios** (Emil Kowalski's or Rauno Freiberg's, for example). One signature interaction, quiet everywhere else, small details that reward a closer look, and speed.
- **A professional record.** A recruiter can scan it like a good CV, and a hiring manager can check every claim.

When these pull in different directions, the visitor wins: clarity first, then craft, then delight.

## Taste (from what Kamlesh has chosen and asked for)

- Minimal and calm. Typography, spacing and alignment carry the emphasis. No boxes around prose, and no decoration for its own sake.
- Big typographic moments are welcome when they carry meaning, like the About statement inside giant quote marks.
- The sumi-e identity: ink on water, washi paper in light mode, sumi ink in dark mode, one vermilion seal accent, kanji kickers. Keep it, extend it with care, and never bring in a second visual language.
- Apple-level finish on controls: the system font (SF Pro on Apple devices), glass materials, feedback on press, clear focus rings.
- Light mode is the default, and dark mode must be just as good.
- Writing that is simple, human and brief. When Kamlesh gives exact wording, use it, fix only the grammar, and say what you fixed.
- Figures go in stat tiles, not inside sentences. Proof sits next to the claim it supports: transcripts, certificates, repos.

## Scope: improvise without overreaching

1. **Always:** do exactly what was asked, to the bar above, in both themes and at phone width.
2. **Do it and mention it:** small fixes inside what you touched, such as a typo, a bad wrap on mobile, a number that disagrees with another section, or a missing alt text.
3. **Suggest, don't do:** anything that changes the design direction, adds or removes a section, rewrites copy nobody asked to rewrite, or shifts the positioning. Put these at the end of the reply: three at most, ranked, one line each with the reason.
4. **Ask:** when two facts conflict, or a fact is missing. Never pick one, and never invent one.

A request about text changes the text, not the layout. A request about one section doesn't restyle the page.

## Design principles

- One idea per section, with a heading that states the takeaway when it can. "Owned in production" says something; "Personal projects" only labels.
- Every fact appears once, in the place it belongs. A tile, a bullet and a date range that all say the same thing are noise.
- The same kind of thing looks the same everywhere: figures are stat tiles, proof links end in ↗, technologies are pills, kickers are a kanji and one English word.
- Hierarchy visible from across the room: one h1 (the name), then section titles, then role titles. At most two font weights in one block.
- Reading comfort: body text at 16 to 17px, lines no longer than about 70 characters (`--measure`), nothing under 12px, and contrast of at least 4.5:1 in both themes.
- Motion serves meaning: the ink bloom reveals content, and the hero ink answers the pointer. No motion that hides content, delays reading or traps the scroll, and always a reduced-motion path.
- Phone first for anything a recruiter needs. The name, the role, the CV and the email must work at 390px wide.
- Speed is part of the design. Heavy 3D loads lazily, the first screen paints fast, and images have sizes.

## Writing for the site

- Plain words, short sentences, active voice. Say the specific thing: a number, a name, a link.
- First person only in About. Elsewhere, let the facts speak.
- Headings in sentence case. Kickers are a kanji, then one English word.
- No em dashes or en dashes inside new sentences. Separators in titles and kickers, like "選 — Experience", are fine.
- The same claim uses the same words everywhere it appears: the sections, /startups, the `index.html` meta tags and JSON-LD, the `useSeo` calls, and the CV PDF.
- Words that make copy sound templated: passionate, innovative, cutting-edge, leverage, seamless, synergy, robust (as praise), delve, showcase, testament, world-class. Say what happened instead.
- Bullets that each start with a bold mini-heading ("Server layer: ...") scan well in a CV but read as machine-written when every bullet has one. Use them only where they truly help a skim.
- Run the humanizer checklist on every new paragraph.

## Things Kamlesh has turned down

Don't bring these back without asking first.

- 2026-09: Boxed cards around the About text ("looks rubbish"). The ask was minimal design, with the effort going into clearer text rather than a new layout.
- 2026-09: A long, multi-paragraph About. It is now one short statement in giant quote marks; the sections below are the evidence.
- 2026-09: The About line "I take the work most people would rather not touch, and I see it through."
- 2026-09: About side-table rows "Open to: Software developer · full-stack" (now "Discussing opportunities") and "Available: remote, hybrid or on-site" (removed).
- 2026-09: "What I've actually built" as the About heading (now "About").
- 2026-09: The split-flap highlights board under the hero name. Parked, not deleted: `src/components/FlapBoard.tsx`, commented out in `src/sections/Hero.tsx`.
- 2026-09: Webfonts (Newsreader, IBM Plex). The site uses the system font now.
- 2026-07: Dark mode as the default. Light is the default.
- 2026-06: A multi-page "dossier" with one route per chapter, and the "Meniscus" glass-and-water look. The site went back to one page plus /startups. The old plan is kept for reference in `.claude/brain/archive/`.
