# Meniscus — Open-source developer portfolio

A personal portfolio built with **React**, **TypeScript**, and **Vite** — fluid hero, scroll-driven sections, a koi pond WebGL scene, and a separate startups chapter. Designed to be forked, customized, and deployed.

**Live demo:** [kamleshkumar.eu](https://kamleshkumar.eu)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- Single-page dossier layout (experience, education, lab, contact) + `/startups` route
- Ink-fluid hero, Lenis smooth scroll, GSAP scroll reveals
- Three.js koi pond with graceful degradation
- Dark / light theme
- GitHub Pages deploy workflow included
- Content driven from `src/data/*` (easy to swap in your own CV)

## Quick start

**Requirements:** Node.js 20+ (22 recommended)

```bash
git clone https://github.com/KamleshKumar427/Kumars-Portfolio.git
cd Kumars-Portfolio
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Customize for yourself

Replace personal content — do not commit secrets.

| What | Where |
|------|--------|
| Name, email, links, CV path | `src/data/profile.ts` |
| Work experience | `src/data/experience.ts` |
| Education & skills | `src/data/education.ts`, `src/data/skills.ts` |
| Projects (Lab) | `src/data/projects.ts` |
| CV PDF | `public/downloads/Kamlesh_Kumar_CV.pdf` |
| Project / startup photos | `public/images/projects/`, `public/images/startups/` |
| Custom domain (GitHub Pages) | `public/CNAME` |
| Page title & meta | `index.html` |

CV source of truth for copy: `Curriculum_Vitae_Md.md` (replace with your own).

## Scripts

```bash
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview production build
npm run lint     # ESLint
```

## Deploy to GitHub Pages

Push to `main`. The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys `dist/` automatically.

1. Enable **GitHub Pages** for the repo: Settings → Pages → Source: **GitHub Actions**
2. Push to `main`, or run the workflow manually
3. Optional: set your domain in `public/CNAME`

## Project structure

```
src/
  data/           # Content (profile, experience, projects, …)
  sections/       # Landing page sections
  StartupsPage.tsx
  pond/           # Koi pond (React Three Fiber)
  hero/fluid/     # Hero fluid simulation
public/           # Static assets (favicon, images, CV, CNAME)
```

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Framer Motion · GSAP · Lenis · Three.js · React Three Fiber

## License

This project is licensed under the [MIT License](LICENSE).

You are free to use, copy, modify, and distribute this code for personal or commercial projects. A link back or credit is appreciated but not required.

## Author

**Kamlesh Kumar** — [kamleshkumar.eu](https://kamleshkumar.eu) · [GitHub](https://github.com/KamleshKumar427) · [LinkedIn](https://linkedin.com/in/kamlesh-kumar-389847224)
