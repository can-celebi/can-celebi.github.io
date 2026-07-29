---
name: personal-site
description: Maintain Can Çelebi's academic website (can-celebi.github.io) — adding or updating papers, publication status changes (working paper → R&R → forthcoming → published), project cards, teaching entries, PDFs, and site styling. Use whenever editing index.html, projects.html, or teaching.html in this repo.
---

# Maintaining can-celebi.github.io

Academic personal site for Can Çelebi (postdoc, Vienna Center for Experimental
Economics). Three hand-written HTML pages, no build step.

## Ground rules

- **No build tooling, no frameworks, no dependencies.** Every page is a single
  self-contained `.html` file: CSS in one `<style>` block in `<head>`, JS in a
  `<script>` block before `</body>`. Do not introduce npm, a bundler, Tailwind,
  a static site generator, or external JS libraries. The only external requests
  are the Google Fonts `@import` (Lora + Open Sans) and `bg-particles.js`.
- **Pushing to `main` publishes.** GitHub Pages serves `main` at
  <https://can-celebi.github.io/>. There is no staging environment and no CI, so
  a broken tag is live within a minute. Read the surrounding block before editing
  and re-read your edit afterwards.
- **Ask before inventing bibliographic facts.** Journal names, dates, volume
  numbers, and co-author lists are part of an academic record. Look them up
  (see *Getting publication dates*) or ask — never guess a plausible-looking month.
- **Duplicated CSS.** `index.html`, `projects.html`, and `teaching.html` each
  carry their own copy of the shared styles (header, nav, cards, fractal divider,
  mobile media queries). A visual change meant to be site-wide must be applied to
  all three files.

## Repo layout

```
index.html       Home: hero, About, Research (the main content), Contact
projects.html    Project cards, split Research / Personal
teaching.html    Teaching cards
bg-particles.js  Canvas background animation, shared by all pages
*.pdf            Papers and slides, served from the repo root
can2-removebg-preview.png   Hero portrait
google3b34459898b9650e.html Google Search Console verification — do not touch
```

PDFs live at the repo root and are linked absolutely, e.g.
`https://can-celebi.github.io/llmClassification.pdf`. To add one, drop the file
in the root and link it the same way.

**Linked subsites are separate repos.** `/prompting/`, `/games/`,
`/clarifying-without-bias/`, `/LLM-Classifier-Tool/`, `/skepticism-instructions/`,
`/causality/`, `/hidirellez/` are published from their own repositories under the
same GitHub Pages domain. Their source is *not* in this repo — don't go looking
for it here, and don't try to edit those pages from this working copy.

## The Research section (`index.html`)

Three groups, in this fixed document order, each introduced by an `<h3>`:

| Heading | Class | Entry class | Meaning |
|---|---|---|---|
| Working Papers | `research-heading rh-wp` | `publication` | Circulating, under review or R&R |
| Publications | `research-heading rh-pub` | `publication pub-pub` | Accepted or published |
| Work in Progress | `research-heading rh-wip` | `publication pub-wip` | Early-stage, title + coauthors only |

The entry class drives the idle shimmer colour (purple / blue / grey), so it must
match the group the entry sits in. Moving a paper between groups means moving the
`<div>` **and** fixing its class.

### Ordering

- **Working Papers** — newest / most active first, by the author's preference.
- **Publications** — forthcoming entries first, then published ones newest-first.
- **Work in Progress** — author's preference; no dates shown.

### Entry template

Working paper or publication (Work in Progress omits `publication-meta`,
`publication-date`, and usually the summary):

```html
<div class="publication pub-pub">
    <div class="accordion-trigger">
        <p class="publication-title">Title of the Paper</p>
        <span class="accordion-arrow"></span>
    </div>
    <p class="publication-meta"><em>Journal Name</em>, 2025</p>

    <div class="accordion-content">
        <p class="publication-date">Published online 17 January 2025</p>
        <p class="publication-meta jointWith">joint with Co Author, Another Author</p>
        <p class="publication-summary">Abstract…</p>
        <p style="text-align:right;"><a href="URL" target="_blank" rel="noopener noreferrer">Paper</a> &nbsp;|&nbsp; <a href="URL" target="_blank" rel="noopener noreferrer">Companion</a></p>
    </div>
</div>
```

Inside `accordion-content` the order is: date → coauthors → summary → links.
Link labels in use: `Paper`, `Companion`, `GitHub`, `Presentation`, `Stage 1 Results`.
Separate them with `&nbsp;|&nbsp;`. All external links get
`target="_blank" rel="noopener noreferrer"`.

### Status vocabulary (`publication-meta`, the always-visible line)

| Stage | Markup |
|---|---|
| Under review | `Under peer review` |
| Revise & resubmit | `R&amp;R in <em>JEBO</em>` |
| Accepted, not yet issued | `<em>PLOS ONE</em>, forthcoming` |
| Published | `<em>Journal of Organizational Behavior</em>, 2025` |
| Book chapter | `<em>Encyclopedia Title</em>, Edward Elgar, forthcoming` |

Use the journal's own capitalisation (`PLOS ONE`, not `PLOS One`) and the
publisher's exact volume title — Edward Elgar, for instance, brands some volumes
`Elgar Encyclopedia of X` but titles others plainly, so check the product page
rather than assuming the series prefix.

### `publication-date` — the month, revealed on click

The visible meta line carries the year; the precise date lives inside the
accordion and fades in when it opens (`.accordion-trigger.active ~
.accordion-content .publication-date`, opacity + 4px slide, 0.12s delay).
Add it as the first child of `accordion-content`. Forms in use:

- `Published online 17 January 2025`
- `Published online 14 April 2025 &middot; Issue: August 2025, vol. 104, art. 104172`

Separate the online date from the issue date with `&middot;` when they differ.
Omit the element entirely for forthcoming or unpublished work.

### Accordion mechanics

Click handler at the bottom of `index.html` toggles `.active` on
`.accordion-trigger` and sets `content.style.maxHeight = content.scrollHeight + "px"`.
Two consequences worth knowing:

- **Height is measured at click time**, so content added by JS after load, or
  images without fixed dimensions, can be clipped. Plain HTML is safe.
- **Work in Progress entries are hover-only.** `isInsideWip()` skips them in the
  click handler, and CSS reveals them with a hard `max-height: 140px` on hover.
  Content taller than 140px gets silently cut off — this has bitten before. If a
  WIP entry needs a summary plus a link, raise that cap rather than trusting it.

Both mechanisms find content via `this.parentElement.querySelector('.accordion-content')`,
so `accordion-trigger` and `accordion-content` must stay siblings inside the same
`.publication`.

## Project cards (`projects.html`)

Two subsections, `subsection-heading sh-research` and `sh-personal`, each holding
a `.card-grid`. A live card is an `<a class="project-card">`; a placeholder is a
`<div class="project-card coming-soon">` whose CTA reads `Coming soon` instead of
`Open project →`.

```html
<a class="project-card" href="https://can-celebi.github.io/slug/" target="_blank" rel="noopener noreferrer">
    <h3>Project Name</h3>
    <p class="card-meta">domain · what it is</p>
    <p>One or two sentences on what the project does.</p>
    <span class="card-cta">Open project →</span>
</a>
```

`card-meta` is two or three lowercase tags joined by ` · ` (middle dot, not a
hyphen). Keep the CTA arrow `→` exactly as written.

`teaching.html` follows the same pattern with `teaching-card` and a CTA of
`Open course →`.

## Style tokens

| Token | Value | Used for |
|---|---|---|
| Ink | `#2c3e50` | Headings, header background |
| Body | `#333` | Text |
| Muted | `#7f8c8d` | `publication-meta` |
| Date grey | `#8e9aa6` | `publication-date` |
| Link blue | `#3498db` | Links, `rh-pub`, `pub-pub` shimmer |
| Accent purple | `#8348f2` | `rh-wp`, header sweep, icon hover |
| WIP grey | `#95a5a6` | `rh-wip` |
| Page | `#f9f9f9` / container `#fff` | Backgrounds |

Fonts: `Lora` (serif) for `h1`/display, `Open Sans` for body, `monospace` for
links and the affiliation line. Animations are deliberately slow and low-contrast
(32s shimmer, 40s header sweep) — keep new motion in that register.

## Getting publication dates

Crossref is authoritative and needs no key. Given a DOI:

```bash
curl -s "https://api.crossref.org/works/10.1016/j.irfa.2025.104172" | python3 -c "
import sys, json
m = json.load(sys.stdin)['message']
for k in ['title','container-title','published-online','published-print','volume','page']:
    print(k, '=', m.get(k))
"
```

`published-online` is the "first available" date, `published-print` the issue.
Report both when they differ. Publisher sites (e-elgar.com, elgaronline.com)
block automated fetches with a 403 — use web search results or ask the author.

## Before you commit

1. `grep -c '<div class="publication' index.html` and eyeball the section
   boundaries — moving entries between groups is where blocks get orphaned.
2. Confirm every moved entry's class matches its new group (`pub-pub` / `pub-wip` / none).
3. Open the page and click each accordion you touched; check nothing is clipped.
4. Check the mobile layout at ≤768px if you changed spacing.
5. Commit with a descriptive message and push to `main` — but only when the
   author has asked for it. Publishing is their call, not yours.
