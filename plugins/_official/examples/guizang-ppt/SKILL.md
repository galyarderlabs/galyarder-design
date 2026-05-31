---
name: magazine-web-ppt
description: Generates a horizontal swipe deck in editorial-magazine × e-ink style as a single HTML file. Includes a WebGL fluid background, serif headlines + sans body + mono metadata, act-divider hero pages, big-number pages, image grids, and more. Use when the user wants a talk-style web deck, mentions "magazine PPT," "horizontal swipe deck," "editorial magazine," or "e-ink presentation."
triggers:
  - "ppt"
  - "deck"
  - "slides"
  - "presentation"
  - "magazine"
  - "magazine deck"
  - "editorial deck"
  - "horizontal swipe"
  - "horizontal swipe deck"
  - "editorial magazine"
  - "e-ink presentation"
  - "web ppt"
  - "talk slides"
  - "demo day deck"
od:
  mode: deck
  scenario: marketing
  featured: 9
  default_for: deck
  upstream: "https://github.com/op7418/guizang-ppt-skill"
  preview:
    type: html
    entry: index.html
  design_system:
    requires: false
  example_prompt: "Make me a magazine-style deck — topic is 'Solo Company · An organization folded by AI.' 25-minute talk, audience is designers + founders. Recommend a direction first (Monocle / WIRED / Kinfolk / Domus / Lab) and let me pick."
---

# Magazine Web Ppt

## What this skill does

Generates a **single-file HTML** horizontal-swipe deck. The visual register is:

- **Editorial magazine + e-ink** hybrid.
- **WebGL fluid / contour / dispersion background** (visible on hero pages).
- **Serif headlines (Noto Serif SC + Playfair Display) + sans body (Noto Sans SC + Inter) + mono metadata (IBM Plex Mono)**.
- **Lucide line icons** (no emoji).
- **Horizontal navigation** via keyboard arrows, wheel, touch swipe, bottom dots, and ESC for the index view.
- **Smooth theme interpolation**: arriving on a hero page eases color and shader transitions.

The aesthetic isn't "business PPT" or "consumer web UI." It's closer to *Monocle* with a build step.

## When to use it

**Good fits**:
- In-person talks, internal industry briefings, intimate gatherings.
- AI product launches, demo days.
- Talks with strong personal voice.
- Web slides you want to ship as a single file with no pagination tooling.

**Bad fits**:
- Long tables, layered charts (use a regular slide tool).
- Training material (information density is too low).
- Multi-author collaborative editing (this is static HTML).

## Workflow

### Step 0 · Pick a direction (mandatory first step)

**Before asking the six clarification questions, have the user pick one of five magazine directions.** Each direction packages a theme color, recommended layouts, chrome tone, and target slide count. Picking one answers half of the clarification questions for free.

Open `references/styles.md` and **paste the one-line summaries** of all five directions for the user to choose from:

```
1. Monocle Editorial — international magazine ✦ default
2. WIRED Tech — data + engineering
3. Kinfolk Slow — slow living / humanities
4. Domus Architectural — architecture / spatial
5. Lab / Reference — academic + craft
```

If the user says "I don't know, recommend one," **default to Monocle Editorial** — it has the lowest failure rate. If the user mentions "AI / benchmark / tech launch" → recommend WIRED. "Book talk / intimate gathering / friends" → Kinfolk. "Design / architecture / portfolio" → Domus. "Research / academic / methodology" → Lab.

After picking, create or update `project-log.md` in the project directory and write the direction, theme color, audience, and length on the first line (template at the bottom of `styles.md`). **Don't change directions mid-deck** — switching halfway means redoing everything before the switch.

### Step 1 · Clarification (do this before generating)

**If the user already provided a complete outline + images,** you can skip ahead to Step 2.

**If the user gave only a topic or a vague idea,** align on the six questions below before generating. Don't start writing slides on guesses — once the structure is wrong, reworking is expensive.

#### Six-question clarification list

> Question 5 is already answered when Step 0 picks a direction (direction → theme color). Leave question 5 blank below.

| # | Question | Why it matters |
|---|------|-----------|
| 1 | **Who's the audience? What's the format?** (industry internal / commercial launch / demo day / intimate gathering) | Drives tone and depth. |
| 2 | **How long is the talk?** | 15 min ≈ 10 pages, 30 min ≈ 20 pages, 45 min ≈ 25–30 pages (per-direction recommended ranges in `styles.md`). |
| 3 | **Source material?** (docs / data / old deck / article links) | Ground the deck in source material if any exists; if not, build from scratch with them. |
| 4 | **Images? Where do they live?** | See "Image conventions" below. |
| 5 | ~~**Theme color?**~~ | ✓ Resolved by direction in Step 0. |
| 6 | **Hard constraints?** (must include X data / cannot mention Y) | Avoid rework. |

#### Outline assist (if the user has no outline)

Use a "narrative arc" template to scaffold, then fill content:

```
Hook        → 1 page    : a contrast / question / hard data that makes them stop.
Context     → 1–2 pages : background / who you are / why you're here.
Core        → 3–5 pages : core content using Layouts 4 / 5 / 6 / 9 / 10.
Shift       → 1 page    : break expectations / propose a new view.
Takeaway    → 1–2 pages : memorable line / open question / call to action.
```

Align on the narrative arc + page allocation + theme rhythm table (see `layouts.md`) — **all three** — before moving to Step 2.

Save the outline as `project-log.md` or `outline-v1.md` for easier iteration later.

#### Image conventions (tell the user up front)

Before generating, confirm with the user:

- **Folder location**: `project/XXX/ppt/images/` (next to `index.html`).
- **Naming convention**: `{page-number}-{semantic}.{ext}`, e.g., `01-cover.jpg` / `03-figma.jpg` / `05-dashboard.png`.
  - Pad the page number for sortability.
  - Use English for the semantic part — short, specific, mapped to content.
- **Spec recommendations**:
  - At least 1600px wide (to avoid blur on large displays).
  - JPG for photos / screenshots, PNG for transparent UI / charts.
  - Total under 10MB (otherwise navigation gets sluggish).
- **How to swap**: same-name overwrite is safest (no path edits in HTML). If a filename changes, search-and-replace `images/old-name` to the new one.
- **No images yet?** Align with the user — you can generate the structure with placeholder color blocks and fill images later. But warn them that Layouts 4 / 5 / 10 (mixed image + text pages) can't be visually verified without images.

### Step 2 · Copy the template

Copy `assets/template.html` to the target location (typically `project/XXX/ppt/index.html`) and create a sibling `images/` folder for the visuals.

```bash
mkdir -p "project/XXX/ppt/images"
cp "<SKILL_ROOT>/assets/template.html" "project/XXX/ppt/index.html"
```

`template.html` is **a complete, runnable file** — CSS, WebGL shaders, navigation JS, font / icon CDNs are all preset; only the three example slides inside `<main id="deck">` (cover, act divider, blank filler) need to be replaced.

#### 2.1 · Mandatory placeholders (easy to miss)

Right after copying, replace these placeholders or the browser tab will show awkward "[required] replace with deck title" text:

| Position | Original | Replace with |
|------|------|--------|
| `<title>` | `[required] replace with deck title · Deck Title` | The actual deck title (e.g., `A New Way of Working · Luke Wroblewski`) |

Every time you copy template.html, the first thing to do is `grep "[required]"` and confirm everything is replaced.

#### 2.2 · Pick a theme color (5 presets · no custom hex)

This skill **only allows one of five carefully tuned presets** — no custom hex values from the user. A wrong palette breaks the look instantly, and protecting the aesthetic matters more than maximum freedom here.

| # | Theme | Best for |
|---|------|------|
| 1 | Ink Classic | General / business launches / the safe default |
| 2 | Indigo Porcelain | Tech / research / data / tech announcements |
| 3 | Forest Ink | Nature / sustainability / culture / non-fiction |
| 4 | Kraft Paper | Nostalgia / humanities / literary / indie magazines |
| 5 | Dune | Art / design / creative / gallery |

**Steps**:
1. Recommend one based on the topic, or ask the user to pick.
2. Open `references/themes.md` and find the matching `:root` block.
3. **Replace** the lines marked "theme color" in the `:root{` block of `assets/template.html` (the copied version): `--ink` / `--ink-rgb` / `--paper` / `--paper-rgb` / `--paper-tint` / `--ink-tint`.
4. Everything else uses `var(--...)`, so no other edits are needed.

**Hard rules**:
- One theme per deck — no swapping mid-way.
- Don't accept arbitrary hex values from the user — politely decline and present the five.
- Don't mix presets (e.g., `ink` from Ink Classic + `paper` from Dune) — the result is jarring.

### Step 3 · Fill content

#### 3.0 · Pre-flight: every class name must exist in template.html (most important)

**This is the source of every generation issue.** Skeletons in layouts.md use a lot of class names (`h-hero` / `h-xl` / `stat-card` / `pipeline` / `grid-2-7-5` and so on). If `assets/template.html`'s `<style>` doesn't define them, the browser falls back to default styling — the big title becomes sans-serif, the big-number cards shrink onto themselves, the pipeline collapses onto one line, and images pile up at the bottom of the page.

**Before writing any slide code:**

1. **Read `assets/template.html` first** (at least through the end of the `<style>` block).
2. **Cross-check against the layouts.md preflight list** — confirm every class you plan to use is defined.
3. If a class is missing, **add it inside `<style>`**, not inline on every slide.
4. **template.html is the only source of class names** — don't invent new classes; for one-offs, use `style="..."` inline.

Classes most often missed (confirm they exist beforehand):
`h-hero` / `h-xl` / `h-sub` / `h-md` / `lead` / `kicker` / `meta-row` / `stat-card` / `stat-label` / `stat-nb` / `stat-unit` / `stat-note` / `pipeline-section` / `pipeline-label` / `pipeline` / `step` / `step-nb` / `step-title` / `step-desc` / `grid-2-7-5` / `grid-2-6-6` / `grid-2-8-4` / `grid-3-3` / `grid-6` / `grid-3` / `grid-4` / `frame` / `frame-img` / `img-cap` / `callout` / `callout-src` / `chrome` / `foot`.

#### 3.0.5 · Plan theme rhythm (as important as the class preflight)

**Before picking layouts**, list the theme class for each page (`hero dark` / `hero light` / `light` / `dark`) and write it out in the doc or draft. Full rules at the top of `references/layouts.md` under "Theme rhythm planning."

**Hard rules**:

- Every section must carry one of `light` / `dark` / `hero light` / `hero dark`. Don't write `hero` alone.
- Three or more pages in a row on the same theme = visual fatigue, not allowed.
- Decks of 8+ pages need at least one `hero dark` + one `hero light`.
- Don't make a deck of only `light` body pages — there must be at least one `dark` body page for breath.
- Insert a hero (cover / divider / question / big quote) every 3–4 pages.

**Self-check after generating**: `grep 'class="slide' index.html` to list every theme; visually confirm the rhythm before delivering.

#### 3.1 · Pick a layout

**Don't write slides from scratch.** Open `references/layouts.md` — it has 10 ready-to-paste layout skeletons, each a complete `<section>`:

| Layout | Use |
|---|---|
| 1. Hero cover | Page 1 |
| 2. Act divider | Each act opener |
| 3. Big numbers | Drop hard data |
| 4. Quote + image | Identity contrast / story |
| 5. Image grid | Multi-image comparison / screenshot proof |
| 6. Pipeline (two rows) | Workflow |
| 7. Hero question | Act close / wrap |
| 8. Big quote | Serif headline / takeaway |
| 9. Before / after | Old vs new |
| 10. Lead image + side text | Information-dense mixed layout |

Pick the right layout, paste it in, swap copy and image paths. **Always do the 3.0 preflight first.**

#### 3.2 · Image aspect-ratio rules

Always use **standard ratios**, never odd source ratios like `2592/1798`:

| Use case | Ratio |
|------|---------|
| Quote + image hero | 16:10 or 4:3 + `max-height:56vh` |
| Image grid (multi-image) | **Fixed `height:26vh`**, no aspect-ratio |
| Side image + body text | 1:1 or 3:2 |
| Full-bleed hero visual | 16:9 + `max-height:64vh` |
| Inline figure in mixed layout | 3:2 or 3:4 |

**Never use `align-self:end` on an image** — it slips to the bottom of the cell and gets covered by the browser chrome. Use a grid container + `align-items:start` (already set in the template) so the image sticks to the top; if the left column needs to anchor to the bottom, use flex column + `justify-content:space-between`.

Component details (typography, color, grid, icons, callouts, stat cards, etc.) live in `references/components.md`.

### Step 4 · Run through the checklist

Always open `references/checklist.md` after generation and walk through it. It collects **every pitfall the iteration history has surfaced**. P0 items (emoji, image overflow, title wrapping, type roles) must all pass.

A few callouts:

1. **Big titles must be serif** — if they render in sans, 99% of the time the Step 3.0 preflight was skipped and `h-hero` is missing from template.html.
2. **Image grids use `height:Nvh` only — never `aspect-ratio`** (it blows out the parent).
3. **Images can't pile up at the bottom** — don't use `align-self:end`; use grid + `align-items:start` (see Step 3.2).
4. **Images use only standard ratios** (16:10 / 4:3 / 3:2 / 1:1 / 16:9), never odd source ratios.
5. **CJK big titles ≤ 5 characters and `nowrap`** (otherwise you get one character per line).
6. **Use Lucide, no emoji.**
7. **Titles serif, body sans, metadata mono.**

### Step 5 · Local preview

Open `index.html` in a browser. On macOS:

```bash
open "project/XXX/ppt/index.html"
```

No local server needed. Images use relative paths like `images/xxx.png`.

### Step 6 · Iterate

Adjust per user feedback. The template's CSS is heavily parameterized; 90% of changes are inline tweaks (font size `font-size:Xvw` / height `height:Yvh` / spacing `gap:Zvh`).

---

## File map

```
magazine-web-ppt/
├── SKILL.md              ← you're reading this
├── assets/
│   ├── template.html     ← complete runnable template (seed file)
│   └── example-slides.html ← 9-page sample deck (drives the Examples preview)
└── references/
    ├── styles.md         ← 5 magazine directions (Monocle / WIRED / Kinfolk / Domus / Lab)
    ├── components.md     ← component handbook (typography, color, grid, icons, callout, stat, pipeline...)
    ├── layouts.md        ← 10 page-layout skeletons (paste-ready)
    ├── themes.md         ← 5 theme-color presets (presets only, no custom)
    └── checklist.md      ← quality checklist (P0/P1/P2/P3 tiers)
```

**Recommended reading order**:
1. Read `SKILL.md` (this file) for the big picture.
2. **At Step 0, read `styles.md`** — every direction packages its theme color, recommended layouts, and chrome tone.
3. After Step 1 clarification, if the direction needs confirmation, open `themes.md` for palette details.
4. **Read `assets/template.html`'s `<style>` block before generating** — the only source of class names; missing classes will collapse a whole page.
5. Read `layouts.md` to pick layouts (top of the file has the preflight class list and theme rhythm planning).
6. Reach for `components.md` when tuning component details.
7. Run `checklist.md` after generating (P0-0 rule mandates the preflight).

## Core design principles (philosophy)

> These came out of five rounds of iteration on the "Solo Company" deck. Break any of them and the visual feel cracks.

1. **Restraint over flash** — the WebGL background only shows on hero pages; you barely see it elsewhere.
2. **Structure over decoration** — no shadows, no floating cards, no padding boxes; hierarchy comes from **scale + type contrast + grid whitespace**.
3. **Hierarchy is defined by scale and type** — the largest serif = title, mid serif = subhead, large sans = lead, small sans = body, mono = metadata.
4. **Images are first-class** — only the bottom is cropped; top, left, right stay intact. Pin grids with `height:Nvh`, never with `aspect-ratio`.
5. **Rhythm rides on hero pages** — alternating hero and non-hero pages keeps the eye fresh.
6. **Consistent terminology** — Skills means Skills; don't drift between English and translated alternatives.

## Reference works

The visual register draws from:

- guizang's "Solo Company: An organization folded by AI" talk (2026-04-22, 27 pages).
- *Monocle* magazine layouts.
- The demo for YC president Garry Tan's "Thin Harness, Fat Skills" post.

Use them as visual anchors.
