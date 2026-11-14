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
  featured: true                       # optional — one big showcase card
```

One project may be marked `featured: true` (renders as the large showcase
card, and is the only entry that displays an image). Everything else renders
as a supporting row — image-less by design, no placeholder art needed.

**Add an open-source contribution** → the Open-source Contributions subsection
renders entirely from `_data/contributions.yml` via
`_includes/open-source-contributions.html`, so maintaining it means editing
that one file. It appears only when `repositories:` is non-empty, so it never
renders as an empty section.

1. **Adding an upstream repository** — append an entry under `repositories:`
   with `name`, `full_name` (the `owner/repo` identifier), `description`
   (quoted from the upstream repository — do not write your own), `url`,
   `license`, `merged_pr_count`, `prs_url` and `verified_at`. Add
   `featured: true` to at most one repository with substantial contributions;
   it renders as a card, the rest render as compact rows.
2. **Adding a newly merged PR** — append to that repository's
   `pull_requests:` list with `number`, `title` (the real PR title), `url`,
   `merged_at` and an optional one-sentence `summary`. Omit `summary` when the
   PR's purpose isn't clear — the title is then used on its own.
3. **Updating the merged count** — `merged_pr_count` is the total number of
   merged PRs by this account in that repository, **not** the number of
   entries listed beneath it. Read it from
   `https://api.github.com/search/issues?q=repo:OWNER/REPO+author:AlexJoaquimPereira+is:pr+is:merged&per_page=1`
   (`total_count`) and bump `verified_at` in the same edit.
4. **Checking the licence** — open the repository's `LICENSE` / `COPYING`
   file (or its GitHub licence badge) and record the SPDX identifier (`MIT`,
   `Apache-2.0`, `BSD-3-Clause`, …). A repository with neither a licence file
   nor licence metadata is not open source: leave it out, or list it
   deliberately without a `license:` key so no licence chip is rendered (as
   with `afriemann/opencode-redact`).
5. **Selecting PRs for the homepage** — 3–4 representative entries for a large
   repository (pick a range of areas rather than several fixes in one file)
   and 1–2 for a small one. Every listed PR must be authored by this account
   and genuinely merged upstream.

**Activate the Substack integration** (when it exists) → in
`_data/profile.yml`, uncomment the `substack:` block, set `enabled: true`
and your real URL. Posts tagged with `shared_tag` (default `tech`) then show
a small "Also on Substack" link on the homepage cards and article pages.
While `enabled` is false or commented out, nothing Substack-related renders.

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
automatically; until then an empty framed slot renders (no placeholder text
is ever shown to visitors).

**Résumé** → currently a Canva link in `_data/profile.yml`. To use a PDF:
set `resume.url: "/assets/resume.pdf"` and `resume.external: false`, then
add the file.

## Design notes

- **Palette**: warm parchment neutrals with a Tyrian-purple/plum accent
  (`--accent`), amaranth (`--accent-alt`) for hover states, and rare gold
  (`--gold`) / botanical (`--earth`) details. All tokens live at the top of
  `css/style.css`; both themes are hand-tuned, not inverted.
- Light/dark theme: follows the system until the visitor toggles; saved in
  `localStorage`; palette lives at the top of `css/style.css`.
- Motion: CSS keyframes + IntersectionObserver. Reveals **replay** — they
  play when an element enters the viewport and reset once it leaves, so
  scrolling back re-animates them. All gated behind
  `prefers-reduced-motion: reduce` and a `js` class (content is never hidden
  when JS is off).
- GitHub stat cards are third-party images (github-readme-stats). If the
  service fails, a clean fallback with a profile link replaces them.

## Local preview

```sh
gem install jekyll -v 4.4.1 --no-document
jekyll serve               # http://localhost:4000
```

## Deploying

Push to `master`. The GitHub Action (`.github/workflows/deploy.yaml`) builds
the Jekyll site and publishes the output to the `gh-pages` branch, which
GitHub Pages serves. Trigger manually anytime from the repo's *Actions* tab.
