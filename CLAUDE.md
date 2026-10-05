# Kamlesh Kumar: portfolio site (kamleshkumar.eu)

This repo is Kamlesh's personal site: React, Vite and TypeScript, one long page at `/` plus a `/startups` page, deployed to GitHub Pages on every push to `main`. Recruiters, hiring managers, engineers and founders use it to judge Kamlesh, usually with the CV open beside it. The site is also a work sample: how it reads, looks and moves is part of the evidence. The repo is public.

## How to work here
- Treat every request as a design and content decision, not just an edit. Before changing anything, work out what Kamlesh is really after and which visitor it serves (`.claude/brain/audience.md`). Then do it as well as the best sites on the web do it, and make it fit everything around it.
- For any change to the site (copy, a section, layout, style, motion, images, SEO text, a new section or page), use the `site-change` skill and follow it. It sizes the job first: a one-word fix stays quick, while a new section or page gets a brief and a Claude Design mockup before any code.
- For "give it a final look", "review it", "what can be improved" or a check before pushing, use the `critique` skill.
- Do exactly what was asked, in the dimension it was asked: a request about text changes text, not the layout. Fix small things inside what you touched. Offer bigger ideas at the end of the reply, three at most, one line each with the reason. The details are in `.claude/brain/playbook.md`.
- Requests are often short. Read them for intent. If a choice really matters and the intent is unclear, ask one question; otherwise take the sensible reading and say which one you took.

## Facts about Kamlesh
- Facts come from the CV project, linked into `.claude/profile/`: `facts.md` (hard rules, loaded at the end of this file), `stories.md` (each job and project, with evidence levels), `myData.md` (education, certificates, projects), and `cv-baseline.tex` / `cv-baseline.pdf` (approved titles, dates and wording). If the links are missing, run `bash scripts/link-profile.sh`.
- Never contradict those files. Never invent or round up a number, a user count, an outcome, a tool or a title.
- `Curriculum_Vitae_Md.md` in this repo is an old copy from June 2026 and is out of date. Don't use it as a source, even where code comments call it the source of truth.
- The site must agree with the CV that visitors download from it, `public/downloads/Kamlesh_Kumar_CV.pdf`. When they disagree, say so.
- Not everything in the profile files belongs on a public page. Publish only what the site already shows or what Kamlesh approves.

## Files
- `src/data/*.ts`: all copy and figures. Change words here, not in components.
- `src/Portfolio.tsx` (section order and SEO for `/`), `src/sections/`, `src/StartupsPage.tsx`, `src/components/`.
- `src/index.css`: the whole visual system. Tokens at the top, then one banner comment per area.
- `index.html` and the `useSeo` calls: page titles, meta descriptions, Open Graph, JSON-LD. A copy change often needs a matching change here.
- `.claude/brain/`: `audience.md` (who visits and what they need), `playbook.md` (taste, scope, writing rules, things turned down), `design-system.md` (tokens and patterns as built), `archive/` (retired plans; don't follow them).
- `.claude/skills/`: `site-change` and `critique`, plus `frontend-design` and `apple-design` for craft.
- `.claude/agents/`: `site-visitor` (a cold read of the screenshots as a recruiter, a hiring manager and a design lead) and `site-fact-checker` (every claim against the profile files and the CV).
- `scripts/shots.mjs` (`npm run shots`): section-by-section screenshots on desktop and phone, in light and dark, saved to `.claude/shots/` (gitignored). Run `npm run shots -- --help` for options.
- `scripts/check-content.mjs` (`npm run check:content`): claims and wording the site must never publish. It also runs after every edit through a hook.
- `FirstPageDesignInspiration/` and `startupPage/`: old Claude Design handoffs, for reference only.

## Before you say done
- `npm run lint` and `npm run build` pass.
- For anything visible: `npm run shots -- <section ids>`, then Read the images, at least desktop-light, phone-light and desktop-dark. Never report a visual change you haven't looked at.
- For copy: the humanizer checklist, and every claim checked against `.claude/profile/`.

## Writing for the site
- Plain, short, human sentences. First person only in About.
- No em or en dashes inside new sentences. Separators in titles and kickers are fine.
- Specific beats clever: a number, a name, a link.
- One claim, one wording, everywhere it appears.

## When Kamlesh corrects something
- A fact: update `.claude/profile/facts.md` or `stories.md`. They are the CV project's files, so the CV pipeline learns it too. A new "never" rule also goes into `scripts/check-content.mjs`.
- A preference about how the site looks or reads, or a rejected idea: add a dated line to `.claude/brain/playbook.md`.
- Say in one line what you saved.

## Sessions
- One session per feature or fix. Everything Claude needs lives in these files, so a fresh session loses nothing and works better than a very long one.
- Don't let two sessions edit this folder at the same time. Use a git worktree for parallel work.
- Commit only when Kamlesh asks.

@.claude/profile/facts.md
