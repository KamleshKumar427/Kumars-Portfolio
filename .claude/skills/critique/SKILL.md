---
name: critique
description: A fresh-eyes review of Kamlesh's portfolio site, or of one page or section. Use it when Kamlesh asks to give the site a final look, review it, check it before pushing, or find what could be better. It takes screenshots, has the site-visitor agent read them cold as a recruiter, a hiring manager and a design lead, has the site-fact-checker check every claim, adds its own pass, and returns one ranked list. It changes nothing until Kamlesh picks what to do.
---

# Critique: one ranked list of what to fix

## Step 1: Scope
- Default: the home page and /startups.
- A page or section, if Kamlesh names one.
- Before a push: what changed (`git status`, `git diff --stat`), plus a quick pass over the whole page, because a change in one section can break the rhythm of the next.

## Step 2: Screenshots
- Home: `npm run shots -- --text`. /startups: `npm run shots -- --page /startups --text`. Add section ids to narrow it.
- Note any warnings the run prints.

## Step 3: Two reviews in parallel
Launch both in one message:
- **site-visitor** with only the screenshot folders and the text files.
- **site-fact-checker** with the scope ("the whole site", or the files), plus any facts Kamlesh confirmed in chat.

If an agent type isn't available, use a general-purpose agent with the agent file's body as its instructions.

## Step 4: Your own pass while they run
With `.claude/brain/playbook.md`, `audience.md` and `design-system.md` open, check:
- the three tests from audience.md (5 seconds, 30 seconds, 3 minutes);
- consistency between sections, and the plain and tinted alternation;
- the two-layer debt in design-system.md;
- the phone layout and both themes;
- motion, and the reduced-motion path;
- speed (anything heavy loading before it's needed);
- the SEO text agreeing with the page;
- the downloadable CV agreeing with the site.

## Step 5: One list
Merge the three reviews into one list and combine duplicates.
- **Must fix:** wrong or inconsistent facts, broken things, anything that would make a recruiter or a hiring manager say no.
- **Should fix:** clarity, hierarchy, consistency, problems on the phone, copy that sounds templated.
- **Ideas:** bigger moves, three at most, each with the visitor it serves and what it costs.

For every item give what, where (the section and file:line), why (which visitor, and what they would think), and the size of the fix (S, M or L).

## Step 6: Stop
Show the list and ask which items to do. Do the chosen ones with the site-change skill. When Kamlesh rejects an item, add it to "Things Kamlesh has turned down" in playbook.md so it isn't suggested again.
