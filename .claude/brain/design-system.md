# The design system, as built

What the site looks like in code today. Read this before styling anything, and keep it true: when you add a token or a pattern, add a line here.

## The idea

Sumi-e: ink and water. A sheet of paper over water, ink that blooms as the pointer moves, a vermilion seal. Light mode is near-white "washi" paper with a fine grain and halftone; dark mode is cool "sumi" charcoal. One accent, vermilion (`--seal`). A kanji labels each section. The hero is a live ink-in-water simulation, and mid-page there is a 3D koi pond to feed.

## Where things are

- **Styles:** all in `src/index.css` (about 3,600 lines). Tokens at the top, then one banner comment per area. Find a block by its banner: SHARED ATOMS, NAV, CV MENU, THEME SWITCH, HERO, INK PICKER, SECTION PRIMITIVES, WORK, TESTIMONIALS, LAB, PATH (education and skills), CONTACT + FOOTER, KOI POND, STARTUPS PAGE, IMAGE SLOT, LIGHTBOX, MOTION & TRANSPARENCY PREFERENCES, ABOUT · STATS · RECOGNITION · CERTIFICATIONS.
- **Copy and figures:** `src/data/*.ts`. Components don't hold copy that changes.
- **Motion:** constants in `src/lib/motion.ts`, the reveal wrapper in `src/components/ui/Reveal.tsx`, smooth scroll in `src/providers/SmoothScrollProvider.tsx`.
- **Hero ink:** `src/hero/fluid/`, tuned in `inkConfig.ts`. **Koi pond:** `src/pond/`, tuned in `koiConfig.ts`.
- **Theme:** `src/lib/theme.ts` plus the inline script in `index.html`. `data-theme` sits on `<html>`, is stored in localStorage, and defaults to light.

## Tokens

Use tokens, never raw values. Palette tokens are defined per theme in `:root, [data-theme='light']` and `[data-theme='dark']`, with a copy under `prefers-color-scheme: dark` for the moment before JS runs. A new colour goes into all three.

**Palette** (light / dark)
- `--paper` page #f9fcf7 / #141519 · `--paper-2` #f4faf1 / #1b1c20 · `--paper-3` #f7fbf5 / #0f1013 · `--card` #ffffff / #1d1e23
- `--ink` text #161a17 / #ecebe6 · `--ink2` secondary #566150 / #9b9ca3 · `--line` hairline #dfecd9 / rgba(235,236,240,.12)
- `--seal` vermilion #b23a2e / #e2573f · `--seal-ink` text on the seal
- `--alt-fill` tint for alternating sections · `--glass-*` glass controls · `--stat-*` stat tiles · `--grain`, `--halftone` paper texture (light only)

**Semantic aliases** (prefer these in new code): `--bg`, `--bg-2`, `--surface`, `--surface-2`, `--surface-sunken`, `--text`, `--text-2`, `--text-body` (long paragraphs), `--separator`, `--accent`, `--accent-hover`, `--accent-text`, `--accent-wash`.

**Type**
- One family everywhere: `--font-sans`, the system font (SF Pro on Apple devices; Japanese falls back to Hiragino, Yu Gothic or Noto). `--font-serif` and `--font-mono` are aliases of it, left over from an older design.
- Body: 17px, line-height 1.5, letter-spacing -0.011em.
- Reading scale: `--fs-label` 12px (the floor, nothing smaller), `--fs-tag` about 12.5px, `--fs-meta` 13px, `--fs-read` 16px, `--fs-read-lg` 17px. `--track-label` 0.08em for uppercase labels. `--measure` 33em, about 70 characters a line.
- Display sizes: hero name clamp(3rem, 10vw, 6.5rem), weight 700, -0.04em · section title clamp(2rem, 4.4vw, 3.1rem), 700 · role title clamp(1.45rem, 2.9vw, 2.1rem), 600 · contact title clamp(2.1rem, 6vw, 4rem), 700.

**Layout:** `--maxw` 1180px, `--gutter` clamp(20px, 5vw, 64px). Sections have clamp(72px, 11vh, 140px) of padding top and bottom, with a hairline on top.
**Radii:** `--r-sm` 10px, `--r-md` 14px, `--r-lg` 20px, `--r-xl` 28px, `--r-pill` 980px.
**Motion:** `--ease` cubic-bezier(0.22, 1, 0.36, 1), `--t-fast` 180ms, `--t-base` 320ms, `--t-slow` 480ms.
**Shadows:** `--shadow-1`, `--shadow-2`, `--shadow-3`: tight, and green-tinted in light mode.

## Patterns to reuse

- **Section scaffold:** `<section id="…" className="section">` (add `section--alt` for the tinted band), then `.section-inner`, then `<Reveal>` around a `.section-head` holding `.section-kicker` (kanji and a word, vermilion, 12px uppercase) and `h2.section-title`. An optional `.section-lead` sits beside the title.
- **Role and honour rows:** two columns, a 108px left rail (a big vermilion number, or kind and period) and the body. Experience uses `.work-row`; Recognition uses `.honour`.
- **Stat tiles:** `.stat-row > .stat > .stat-value + .stat-label`. For figures only: a number and a short label, never a sentence.
- **Points:** `.work-points > .work-point`, with a ◇ marker.
- **Pills:** `.tag` (outlined, for technologies) and `.chip` (filled, for skills and courses). Both turn vermilion on hover.
- **Proof links:** `.proof-links > a.proof-link`, ending in ↗ (transcripts, certificates).
- **Buttons:** `.btn.btn--seal` (primary, vermilion) and `.btn.btn--ghost`. Pills 44px tall that scale to 0.96 on press.
- **Glass controls:** the ink dock, the nav sheet, the CV menu and the theme switch use `--glass-fill`, `--glass-edge` and `--glass-lift`.
- **Media:** `ImageSlot` (a photo, or a PDF with a poster image for phones) and `Lightbox` for the full view.

## Two layers (known debt)

The header of `index.css` says it plainly. The nav, hero, testimonials, contact, footer, and the /startups hero, XSTRYV and Slush blocks use an "Apple-style" layer. Experience, Education, Lab, Pathways, the koi overlay and the lightbox keep the original sumi-e layout. They share tokens, so the page still reads as one, but section heads and title sizes differ between the two (compare `.tm-section .section-title` with `.section-title`). Don't add a third style. When you work on a section, move it toward one shared set of rules, and say so in the reply.

## Motion

- **Rule:** scroll position goes through GSAP ScrollTrigger; interaction and state use CSS transitions or React state. (framer-motion is installed but not imported anywhere.)
- **Reveal:** `<Reveal>` fades content in once as it enters the viewport, the "ink bloom": opacity 0 to 1, y 24px to 0, blur 8px to 0, scale 1.01 to 1, over 1.05s with power3.out. `<Reveal stagger>` cascades its direct children 0.1s apart.
- **Smooth scroll:** Lenis (lerp 0.08) drives ScrollTrigger. In-page anchor links glide, offset by 64px for the fixed nav.
- **Reduced motion:** Lenis off, reveals show at once, a still hero instead of the fluid, no pond pin. Every new animation needs this path too.
- **Koi pond:** pins for half a screen of scroll and releases on the first feed or after 6 seconds. It must never trap the scroll (an earlier bug, fixed in commit f30bdeb).

## Breakpoints

1080px (the nav collapses into a sheet), 900px (the main mobile layout), 820px, 680px, 640px and 560px. Also `(hover: hover)` and `(hover: none)`, `(pointer: coarse)` for 44px tap targets, `prefers-reduced-motion` and `prefers-reduced-transparency`.

## Quality floor for every change

- Checked in both themes, at phone (390px) and desktop (1440px) width, with `npm run shots`.
- Visible focus (a 2px vermilion outline), everything reachable by keyboard, alt text on images, headings in order.
- No sideways scroll, no text under 12px, contrast of at least 4.5:1.
- Heavy code loaded lazily (`React.lazy`), no layout shift, 60fps.
