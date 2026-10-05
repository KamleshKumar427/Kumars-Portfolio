---
name: site-change
description: Kamlesh's workflow for any change to the portfolio site kamleshkumar.eu, however small, such as copy, a section, layout, styling, motion, images, SEO text, a new section or a new page. It sizes the job, works out who the change is for before building, mocks up big changes on a Claude Design canvas first, then builds, looks at the result in screenshots, gets fresh-eyes reviews for big changes, and reports with ranked next steps.
---

# Site change: think, build, then look

Most of the quality comes from the thinking before the code and the looking after it. Don't skip either for anything a visitor will see.

## Step 0: Load what you need
- Always: `.claude/brain/playbook.md` (taste, scope, writing rules, what's been turned down). `.claude/profile/facts.md` loads through CLAUDE.md; if it isn't in context, read it.
- Beyond an XS fix: `.claude/brain/audience.md`.
- Anything visual: `.claude/brain/design-system.md`, and load the `frontend-design` skill (plus `apple-design` for interaction and motion).
- When copy or claims change: `.claude/profile/stories.md` and `.claude/profile/myData.md`.
- Before writing any sentence a visitor will read: load the humanizer skill (anthropic-skills:humanizer).

## Step 1: Size the job
- **XS:** a word, a link, a number, a typo, swapping two items. Do it, then go to step 6. Still check two things. Does the same fact appear anywhere else (Grep `src/` and `index.html`), and does it still agree everywhere? Does the move break a rule, such as the plain and tinted alternation?
- **S/M:** rewriting one section's copy, restyling a component, tuning motion, adding an item. Think (step 2). If the request is open-ended ("make it better", "improve X"), start your reply with a plan of three to five lines (who it's for, what changes, what stays the same), then carry on unless a choice is really Kamlesh's to make.
- **L:** a new section or page, a redesign, a new interaction, a change to the positioning or the title. Think (step 2), write the brief (step 3), and stop. No code until Kamlesh has picked a direction.

When a job sits between two sizes, treat it as the larger.

## Step 2: Think
Answer these before touching code. Keep the answers short; they go into the brief or the plan.
1. **The real goal.** What is Kamlesh after? A short request ("swap these", "make it upright") usually has a reason behind it. Name it.
2. **The visitor.** Which visitor does this serve (audience.md), on which device, and what must they get from it in 5 seconds, 30 seconds and 3 minutes?
3. **The story.** What is this section's job on the page? Does the change repeat or contradict another section? Does the heading state a takeaway?
4. **The proof.** Is every claim specific, backed by facts.md or stories.md, and worded the same way everywhere it appears (the sections, /startups, `index.html`, the `useSeo` calls, the CV PDF)?
5. **The craft.** Hierarchy, spacing rhythm, tokens, both themes, phone width, motion with a reduced-motion path, accessibility, speed.
6. **The taste.** Would Kamlesh call it minimal and calm? Did a box, a badge or a gradient sneak in? Does it look templated? Take one thing away.
7. **The scope.** What exactly was asked, and in which dimension (text, layout, motion)? List the small fixes you'll make alongside, and the bigger ideas you'll only suggest.

## Step 3: Brief (L only)
Save it to `.claude/briefs/<YYYY-MM-DD>-<slug>.md` (gitignored), show a short version in chat, and stop.
1. The ask in plain words, and the goal behind it.
2. Who it's for, and what they should take away at 5 seconds, 30 seconds and 3 minutes.
3. The content: draft copy with the source of every claim, and what gets cut.
4. Two or three layout directions. Each gets an ASCII wireframe for desktop and for phone, one line on what it does well, and one on what it costs. Recommend one and say why.
5. How it fits: the tokens and patterns it reuses, where it sits in the page order, the motion, the background alternation.
6. Questions for Kamlesh: only ones whose answers change the result, five at most.

If Kamlesh says to go ahead without answering, use the safest assumption for each question and list the assumptions in the final report.

## Step 4: Mock it up in Claude Design (L, once a direction is picked, or whenever Kamlesh asks to see it first)
- Make a Design canvas with the Artifact tool (the "Design" type; its full instructions come back when you create it). Title it "Portfolio: <what it is>".
- Design system: if Kamlesh has a "Design System" artifact for this portfolio (Artifact `list` with type "Design System"), use it. Otherwise match the site exactly from design-system.md: palette values, the system font stack, type sizes, radii, the vermilion accent, kanji kickers. Never invent a new look on the canvas.
- Artboards: the chosen direction at desktop width (1440) and phone width (390), plus the runner-up at desktop width. Real copy from `src/data` and the brief, never placeholder text. Show both themes only when the change is about colour.
- Send Kamlesh the link with one line on what's on the canvas, and wait. Kamlesh can comment or edit on the canvas. Before building, read the canvas back (Artifact `read`) and its comments (ArtifactComments), and build what is there now.

## Step 5: Build
- Copy and figures go in `src/data/*.ts`; structure in `src/sections/` or `src/components/`; styles in `src/index.css`, next to the related block, using tokens. Reuse the patterns in design-system.md before inventing new ones.
- Both themes, phone and desktop, a reduced-motion path, keyboard focus, alt text.
- A new token or pattern gets a line in design-system.md.

## Step 6: Look
- Run `npm run shots -- <section ids>` (add `--page /startups` for that page). Read at least desktop-light, phone-light and desktop-dark for every section you changed, plus the sections just above and below it, to check the seams.
- Compare with the rest of the page: does the same kind of thing look the same? Fix what you see, and shoot again.
- The run reports console errors, failed requests, broken images, sideways scroll and tiny text. Fix anything new.

## Step 7: Fresh eyes (L always; M when the copy changed a lot)
Launch both agents in one message so they run in parallel:
- **site-visitor:** give it only the screenshot folder (`.claude/shots/<page>/`) and the text file from `npm run shots -- --text`. No summary, no intent, no facts: it has to see what a stranger sees.
- **site-fact-checker:** give it the files you changed, plus any facts Kamlesh confirmed in this chat that aren't in the profile files yet.

If an agent type isn't available in this session, spawn a general-purpose agent with the body of `.claude/agents/site-visitor.md` or `.claude/agents/site-fact-checker.md` as its instructions, followed by the paths.

Then fix every fact problem, fix the visitor findings that are right and possible with true facts, ignore anything that would need invented content, and shoot again.

## Step 8: Checks
- `npm run lint` and `npm run build` pass.
- The content check runs by itself after every edit (a hook). Fix its [fact] items; treat [style] items as judgment calls.
- `npm run shots` reports nothing new.

## Step 9: Report
Short, and in the visitor's terms:
- What changed and why, in two to four lines. Send the most telling screenshots with SendUserFile, before and after when that helps.
- The small fixes you made alongside.
- Up to three suggestions for what to do next, ranked, one line of why each. Things you noticed but didn't touch go here, not into the code.
- Any assumptions. Don't commit unless asked; if Kamlesh is about to push, draft the commit message.

## Step 10: Learn
When Kamlesh corrects something, save it before moving on, and say in one line what you saved:
- A fact about Kamlesh: `.claude/profile/facts.md` or `stories.md`. These are the CV project's files, so the CV pipeline learns it too. A new "never" rule also goes into `scripts/check-content.mjs`.
- A taste or wording preference, or a rejected idea: a dated line in `.claude/brain/playbook.md`.
- A new token or pattern: `.claude/brain/design-system.md`.
