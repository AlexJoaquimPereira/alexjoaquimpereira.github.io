# alexjoaquimpereira.github.io

Personal website of Alex Joaquim Pereira — a Jekyll static site deployed on
GitHub Pages. Content lives in data files and Markdown; the templates render
everything.

**Live at:** https://alexjoaquimpereira.github.io/

## Architecture

```
├── _config.yml             Jekyll settings (URL, permalinks)
├── _data/profile.yml       ALL personal data: name, education, hero, about,
│                           skills, social links, résumé, contact, GitHub cards
├── _data/projects.yml      Project cards (one YAML entry per project)
├── _posts/                 Articles — one Markdown file per post
├── _layouts/               default (shell), post (article reading page)
├── _includes/              hero, about, projects, writing, skills, github,
│                           contact, article-card, reading-time, section-head
├── articles/index.html     All-articles listing (auto-generated from _posts)
├── index.html              Homepage (composes the includes)
├── 404.html                Custom not-found page
├── css/style.css           Design system (light + dark, motion, responsive)
├── js/main.js              Theme, reveals, parallax, stats fallback, form
└── assets/
    ├── favicon.svg
    └── images/
        ├── profile.jpg     ← drop your photo here (4:5 portrait works best)
        ├── og-image.png    ← social preview (1200×630, then uncomment in head)
        ├── projects/       ← project screenshots
        └── articles/       ← article cover images
```

## Common tasks

**Edit personal info** → `_data/profile.yml` (name, education, skills, links,
hero copy, about paragraphs). Every section of the site updates from it.

**Add a project** → append an entry to `_data/projects.yml`:

```yaml
- title: "My project"
  description: "What it does, in one or two sentences."
  technologies: ["Python", "JavaScript"]
  github: "https://github.com/you/repo"
  live: "https://example.com"          # optional
  image: "/assets/images/projects/my-project.jpg"  # optional
```

**Add an article** → create `_posts/YYYY-MM-DD-my-title.md`:

```markdown
---
layout: post
title: "My article title"
description: "One-sentence summary."
date: YYYY-MM-DD
tags:
  - Learning
cover: "/assets/images/articles/my-cover.jpg"   # optional
---

Your article in **Markdown**.
```

Push, and it appears in the Writing section and `/articles/` automatically
(URL: `/articles/my-title/`). Reading time is estimated automatically.
Do not fabricate content — an honest empty state beats a fake entry.

**Profile photo** → add `assets/images/profile.jpg`. The hero picks it up
automatically (placeholder shows until the file exists).

**Résumé** → currently a Canva link in `_data/profile.yml`. To use a PDF:
set `resume.url: "/assets/resume.pdf"` and `resume.external: false`, then
add the file.

## Design notes

- Light/dark theme: follows the system until the visitor toggles; saved in
  `localStorage`; palette lives at the top of `css/style.css`.
- Motion: CSS keyframes + IntersectionObserver, all gated behind
  `prefers-reduced-motion: reduce` and a `js` class (content is never hidden
  when JS is off).
- GitHub stat cards are third-party images (github-readme-stats). If the
  service fails, a clean fallback with a profile link replaces them.

## Local preview

```sh
bundle install
bundle exec jekyll serve     # http://localhost:4000
```

## Deploying

Push to `master`. The GitHub Action (`.github/workflows/deploy.yaml`) builds
the Jekyll site and publishes the output to the `gh-pages` branch, which
GitHub Pages serves. Trigger manually anytime from the repo's *Actions* tab.
