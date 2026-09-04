# alexjoaquimpereira.github.io

Personal website of Alex Joaquim Pereira — a plain static site (HTML + CSS + a
little vanilla JS). No framework, no build step, no dependencies.

**Live at:** https://alexjoaquimpereira.github.io/

## Project structure

```
├── index.html              Home page (About, Projects, Writing, Skills, Contact)
├── 404.html                Custom not-found page (served by GitHub Pages)
├── articles/
│   ├── index.html          All-articles listing
│   ├── _template.html      Copy-paste skeleton for new articles (do not link to it)
│   └── learning-in-small-projects.html   Sample article — replace with real writing
├── css/style.css           Entire design system (light + dark theme)
├── js/main.js              Progressive enhancements (theme toggle, scrollspy, form)
├── assets/favicon.svg      "AP" monogram favicon
└── .github/workflows/deploy.yaml   Deploys to GitHub Pages on push to master
```

## Editing content

All content lives directly in the HTML — open the file, find the section, edit
the text. Search for `[PLACEHOLDER` to find everything meant to be replaced:

- **Projects** — `index.html`, `#projects` section. Copy the sample
  `<article class="card project-card">` block and edit it.
- **Résumé** — the "View résumé" button in `#about` currently points to a
  Canva link. To use a PDF instead: put it at `assets/resume.pdf` and change
  the link's `href` to `assets/resume.pdf`.
- **Email** — the contact form goes through Formspree. To publish your email
  address too, add a row to the "Elsewhere" list in `#contact` (an example is
  in the HTML comment above the form).
- **Social preview image** — add `assets/og-image.png` (1200×630) and
  uncomment the `og:image` meta tag in `index.html`.

## Adding a new article

1. Copy `articles/_template.html` to `articles/your-slug.html`
   (lowercase-with-hyphens). Fill in the title, description, canonical URL,
   date, and body. Delete the how-to comment at the top.
2. In `articles/index.html`, copy the existing `<article class="article-item">`
   block to the top of the list and update it (title, date, summary, tags,
   link).
3. Do the same in the Writing section of `index.html` if you want it featured
   on the homepage.
4. Commit and push. That's it — there is no build step.

Estimated reading time: word count ÷ 200, rounded up.

## Deploying

`git push` to `master` is all it takes. The GitHub Action
(`.github/workflows/deploy.yaml`) publishes the tracked files to the
`gh-pages` branch, which GitHub Pages serves. You can also trigger it
manually from the repository's *Actions* tab (*Deploy to GitHub Pages →
Run workflow*).

To preview locally before pushing:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Theme

Light and dark mode both ship by default. The site follows the system
preference until the visitor uses the toggle; the choice is saved in
`localStorage`. Colors are defined once at the top of `css/style.css`.
