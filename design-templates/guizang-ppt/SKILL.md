---
name: magazine-web-ppt
description: Generate 'Digital Magazine × E-Ink' style horizontal swipe web presentations (single HTML file), complete with WebGL fluid backgrounds, serif headings + sans-serif body copy, chapter divider covers, large-stat callouts, and image grids. Use when the user needs to create slide sharing, community talks, or launch presentations, or when they mention 'magazine-style deck', 'horizontal swipe deck', 'editorial magazine', or 'e-ink presentation'.
triggers:
  - "ppt"
  - "deck"
  - "slides"
  - "presentation"
  - "magazine"
  - "Magazine"
  - "Magazine-style PPT"
  - "horizontal swipe"
  - "horizontal swipe deck"
  - "editorial magazine"
  - "e-ink presentation"
  - "Web-based PPT"
  - "Launch keynote"
  - "Shared PPT"
od:
  mode: deck
  scenario: marketing
  default_for: deck
  upstream: "https://github.com/op7418/guizang-ppt-skill"
  preview:
    type: html
    entry: index.html
  design_system:
    requires: false
  example_prompt: >-
    Create a magazine-style slide deck for me — topic: 'One-Person Company: Organizations Folded by AI', a 25-minute talk aimed at designers and founders. First suggest a design direction (Monocle, WIRED, Kinfolk, Domus, or Lab) for me to choose from.
---

# Magazine Web Ppt

## What This Skill Does

Generate a **single-file HTML** landscape presentation slide deck, with a visual tone of:

- **Digital Magazine + E-Ink** hybrid style
- **WebGL fluid / contour line / chromatic dispersion background** (visible on hero slides)
- **Serif Title (Noto Serif SC + Playfair Display) + Sans-serif Body (Noto Sans SC + Inter) + Monospace Metadata (IBM Plex Mono)**
- **Lucide linear icons** (avoid emojis)
- **Horizontal side-scrolling navigation** (keyboard ← →, scroll wheel, touch swipe, bottom dots, ESC index)
- **Theme smooth interpolation**: colors and shader transition smoothly when scrolling to a hero page

The aesthetics of this skill is not "business PPT", nor "consumer internet UI" — it resembles *Monocle* magazine with code applied.

## When to Use

**Suitable Scenarios**:
- Offline sharing / industry internal keynote / private seminar
- AI new product launch / demo day
- Presentations with strong personal style
- Needs web-based slides that "render in one go without a paging control"

**Unsuitable Scenarios**:
- Large table data, chart overlays (use traditional PPT)
- Training courseware (insufficient information density)
- Requires multi-person collaborative editing (this is a static HTML)

## Workflow

### Step 0 · Choose Direction (Direction · Mandatory First Step)

**Before asking 6 clarifying questions, let the user pick one of the 5 magazine directions**. Each direction packages the "theme color / recommended layout / chrome style / recommended slide count", and choosing a direction answers half of the clarifying questions.

Open `references/styles.md`, **copy the entire section** to show the user the 5 directions' 1-line summaries, then let them choose:

```
1. Monocle Editorial · International Magazine Style ✦ Default
2. WIRED Tech · Data + Engineering
3. Kinfolk Slow · Slow Living / Humanities
4. Domus Architectural · Architecture / Spatial Feel
5. Lab / Reference · Academic + Craftsmanship Manual
```

If the user says "I don't know, please recommend" — **recommend Monocle Editorial by default**, because it has the lowest failure probability. If the user mentions "AI / benchmark / tech release" — recommend WIRED; "reading / private sharing / moments" — recommend Kinfolk; "design / architecture / portfolio" — recommend Domus; "research / academic / methodology" — recommend Lab.

After picking a direction, create or update `Project Records.md` (project-records.md) in the project directory; write the direction + theme color + audience + duration on the first line (see end of `styles.md` for template). **Do not change directions midway** — changing halfway means starting all over again.

### Step 1 · Requirements Clarification (Mandatory Before Starting)

**If the user has already provided a complete outline + images**, you can skip directly to Step 2.

**If the user only provides a topic or a vague idea**, align with them using these 6 questions one by one before proceeding. Do not start writing slides based on guesses — once the structure is defined incorrectly, the cost of later revision is extremely high:

#### 6-Question Clarification Checklist

> Question 5 has been answered during the Step 0 direction selection (direction → theme color). Among the 5 questions below, Question 5 can be left blank.

| # | Question | Why ask |
|---|------|-----------|
| 1 | **Who is the audience? Sharing context?** (Internal industry / commercial launch / demo day / private session) | Determines language style and depth |
| 2 | **Presentation duration?** | 15 minutes ≈ 10 pages, 30 minutes ≈ 20 pages, 45 minutes ≈ 25-30 pages (recommended range for each direction is in `styles.md`) |
| 3 | **Is there any raw material?** (Document / data / old PPT / article link) | If raw material is present, build based on it; otherwise, assist in constructing |
| 4 | **Are there images? Where are they?** | See "Image Conventions" below for details |
| 5 | ~~**Which theme color palette do you want?**~~ | ✓ Already determined in Step 0 by direction selection |
| 6 | **Are there hard constraints?** (must include XX data / must not show YY) | Avoid rework |

#### Outline Assistance (if the user does not have an outline)

Build the skeleton using the "Narrative Arc" template, then fill in the content:

```
Hook       → 1 page : present a contrast / question / hard data to captivate attention
Context    → 1-2 pages : explain background / who you are / why this talk matters
Body (Core)       → 3-5 pages : core content, interleaved with Layouts 4/5/6/9/10
Shift      → 1 page : disrupt expectations / present a fresh perspective
Takeaway   → 1-2 pages : golden quote / open question / call to action
```

Narrative arc + page planning + theme rhythm table (see `layouts.md`), **align these three tables** before proceeding to Step 2.

It is recommended to save the outline as `Project-Record.md` or `Outline-v1.md` for subsequent iterations.

#### Image Conventions (inform the user)

Clarify to the user before starting:

- **Folder location**: under `Project/XXX/ppt/images/` (in the same directory as `index.html`)
- **Naming Convention**: `{page_number}-{semantics}.{ext}`, e.g., `01-cover.jpg` / `03-figma.jpg` / `05-dashboard.png`
  - Pad page numbers with zero for easy sorting
  - Semantics in English; short, concrete, and aligned with content
- **Specification Suggestions**:
  - Single image ≥ 1600px wide (avoids blurriness on large screens)
  - JPG for photos/screenshots, PNG for transparent UI/charts
  - Control total size under 10MB (affects slide transition smoothness)
- **How to replace**: keeping the **same name overwrite** is most stable (no need to change paths in HTML); if filename changed, remember to globally search and replace `images/old_name` with new name
- **What if there are no images**: Align with the user; you can first use placeholder color blocks to generate structure and fill in actual images later; but inform them that text-image mixed layout pages like layout 4/5/10 cannot verify visual effects without images

### Step 2 · Copy Template

Copy one from `assets/template.html` to the target location (usually `project/XXX/ppt/index.html`), and create an `images/` folder in the same directory to receive images.

```bash
mkdir -p "Project/XXX/ppt/images"
cp "<SKILL_ROOT>/assets/template.html" "project/XXX/ppt/index.html"
```

`template.html` is a **fully functional, runnable** file — CSS, WebGL shader, page flipping JS, and font/icon CDNs are all preset, and only inside `<main id="deck">` are 3 example slides (cover, section divider, blank fill page).

#### 2.1 · Mandatory Placeholders to Modify (**Easy to Miss**)

Immediately replace the following placeholders after copying; otherwise, the browser tab will display awkward text like "[Required] Replace with PPT Title":

| Location | Original | To be changed to |
|------|------|--------|
| `<title>` | `[Required] Replace with PPT title · Deck Title` | Actual deck title (e.g. `A New Way of Working · Luke Wroblewski`) |

First task after copying template.html: grep for "[Required]" to confirm all are replaced.

#### 2.2 · Select Theme Color Palette (5 presets · customization not permitted)

This skill **only allows selecting one from 5 carefully curated presets**, and does not accept user-defined hex values — wrong color combinations instantly make the layout ugly; protecting aesthetics is more important than offering freedom.

| # | Theme | Best suited for |
|---|------|------|
| 1 | 🖋 Classic Ink | General use / commercial launches / default when undecided |
| 2 | 🌊 Indigo Porcelain | Tech / research / data / technical conferences |
| 3 | 🌿 Forest Ink | Nature / sustainability / culture / non-fiction |
| 4 | 🍂 Kraft Paper | Nostalgia / humanities / literature / indie magazines |
| 5 | 🌙 Dune | Art / design / creative / gallery |

**Actions**:
1. Recommend a theme based on content context, or ask the user to select one directly
2. Open `references/themes.md` and locate the corresponding theme's `:root` block
3. **Globally replace** the few lines marked with the "theme color" comments in the `:root{` block at the beginning of `assets/template.html` (copied version) (`--ink` / `--ink-rgb` / `--paper` / `--paper-rgb` / `--paper-tint` / `--ink-tint`)
4. Other CSS utilize `var(--...)`, no other changes required

**Hard Rules**:
- Use only one theme per deck, do not change colors midway
- Do not accept arbitrary hex values from the user — politely decline and showcase the 5 presets for selection
- Do not mix and match styles (e.g., taking ink from Classic Ink and paper from Dune) — it will create severe visual discord

### Step 3 · Populate Content

#### 3.0 · Pre-flight: classes must be defined in template.html (**Most Important**)

**This is the root cause of all generation issues**. The layouts.md skeleton uses many class names (`h-hero` / `h-xl` / `stat-card` / `pipeline` / `grid-2-7-5` etc.). If there are no corresponding definitions in the `<style>` of `assets/template.html`, the browser will fallback to default styles—Large Title becomes sans-serif, data cards are squeezed together, pipeline is muddled into a single line, and images pile up at the page Bottom.

**Before writing any slide code:**

1. **Read `assets/template.html` first** (read at least up to the end of the `<style>` block)
2. **Check against the Pre-flight list in layouts.md**, making sure every class you want to use exists in `<style>`
3. If a class is missing: **add it in the `<style>` of template.html**, do not rewrite inline in each slide
4. **template.html is the only source of class names** — do not invent new class names, if customization is needed use `style="..."` inline

Common easily omitted classes (must pre-verify existence):
`h-hero` / `h-xl` / `h-sub` / `h-md` / `lead` / `kicker` / `meta-row` / `stat-card` / `stat-label` / `stat-nb` / `stat-unit` / `stat-note` / `pipeline-section` / `pipeline-label` / `pipeline` / `step` / `step-nb` / `step-title` / `step-desc` / `grid-2-7-5` / `grid-2-6-6` / `grid-2-8-4` / `grid-3-3` / `grid-6` / `grid-3` / `grid-4` / `frame` / `frame-img` / `img-cap` / `callout` / `callout-src` / `chrome` / `foot`

#### 3.0.5 · Plan Theme Rhythm (**Equally Important as Class Pre-flight**)

**Before selecting a layout**, you must first list the theme class of each page (`hero dark` / `hero light` / `light` / `dark`) and align them in the document or draft. Detailed rules are in the section "Theme Rhythm Planning" at the beginning of `references/layouts.md`.

**Mandatory Rules**:

- Each page section must include one of `light` / `dark` / `hero light` / `hero dark`, do not just write `hero`
- Same theme for 3+ consecutive pages = visual fatigue, not permitted
- Decks with 8+ pages must contain ≥1 `hero dark` + ≥1 `hero light`
- The entire deck cannot consist solely of `light` body slides; there must be `dark` body slides to establish visual pacing
- Insert 1 hero page (cover / section divider / question / big quote) every 3-4 slides

**Self-check after generation**: `grep 'class="slide' index.html` to list all themes, manually confirming that the rhythm is reasonable before delivery.

#### 3.1 · Select Layout

**Do not write slides from scratch**. Open `references/layouts.md`; there are 10 ready-made layout skeletons inside, and each of them is a fully pastable `<section>` code block:

| Layout | Intended use |
|---|---|
| 1. Opening Cover | Page 1 |
| 2. Section Divider | Opening of each section |
| 3. Data Billboard | Present Hard Data |
| 4. Left Text Right Image (Quote + Image) | Identity contrast / storytelling |
| 5. Image Grid | Multi-image comparison / screenshot evidence |
| 6. Two-Column Pipeline (Pipeline) | Workflow |
| 7. Cliffhanger / Question Page | End of Section / Outro |
| 8. Big Quote Page (Big Quote) | Serif golden quote / takeaway |
| 9. Side-by-Side Comparison (Before / After) | Old paradigm vs new paradigm |
| 10. Mixed Image & Text (Lead Image + Side Text) | Information-dense layout |

Select the corresponding layout, paste it, and modify the copy and image paths. **Be sure to complete the 3.0 pre-flight first**.

#### 3.2 · Image Aspect Ratio Guidelines

Always use **standard aspect ratios**; do not use irregular proportions from the source image (such as `2592/1798`):

| Scenario | Recommended Ratio |
|------|---------|
| Left Text Right Image Primary Image | 16:10 or 4:3 + `max-height:56vh` |
| Image Grid (multi-image comparison) | **Fixed `height:26vh`**, no aspect-ratio |
| Left Small Image + Right Text | 1:1 or 3:2 |
| Fullscreen Main Visual | 16:9 + `max-height:64vh` |
| Text-Image Layout Miniature Illustration | 3:2 or 3:4 |

**Never use `align-self:end` on images** — they will slide to the cell bottom and be blocked by the browser toolbar. Use grid container + `align-items:start` (preset in templates) to align the image to the top; if you want the left column to align to the bottom, use flex column + `justify-content:space-between`.

Component details (fonts, colors, grids, icons, callout, stat-card etc.) are in `references/components.md`.

### Step 4 · Self-check against checklist

After generation, make sure to open `references/checklist.md` and verify item by item. It summarizes **all the pitfalls encountered during actual iterations**; P0 level issues (emojis, images blowing out, title wrapping, font delegation) must all be successfully passed.

A few rules to note in particular:

1. **Large Title must be a serif font** — if displayed as sans-serif, 99% probability is that the Step 3.0 pre-check was not done and the `h-hero` class is missing in template.html
2. **Only use `height:Nvh` in image grids, do not use `aspect-ratio`** (it will overflow)
3. **Images cannot be piled up at the page Bottom** — do not use `align-self:end`, use grid + `align-items:start` (see Step 3.2)
4. **Images must use standard aspect ratios** (16:10 / 4:3 / 3:2 / 1:1 / 16:9); do not copy irregular proportions from the source image.
5. **Chinese Large Title ≤ 5 characters and `nowrap`** (avoid 1 character per line)
6. **Use Lucide, do not use emoji**
7. **Serif for headings, sans-serif for body, monospace for metadata**

### Step 5 · Local Preview

Simply open `index.html` in the browser. On macOS:

```bash
open "Project/XXX/ppt/index.html"
```

No local server required. Images use relative paths `images/xxx.png`.

### Step 6 · Iteration

Modify based on user feedback — the template CSS is highly parameterized; 90% of adjustments are simply modifying inline styles (font size `font-size:Xvw` / height `height:Yvh` / spacing `gap:Zvh`).

---

## Resource Directory Guide

```
magazine-web-ppt/
├── SKILL.md              ← You are reading this
├── assets/
│   ├── template.html     ← complete, runnable template (seed file)
│   └── example-slides.html ← 9-page sample deck (used for Examples preview)
└── references/
    ├── styles.md         ← 5 magazine directions (Monocle / WIRED / Kinfolk / Domus / Lab)
    ├── components.md     ← Component Manual (fonts, colors, grids, icons, callout, stat, pipeline...)
    ├── layouts.md        ← 10 page layout skeletons (can be pasted directly)
    ├── themes.md         ← 5 theme color presets (selection only, no customization)
    └── checklist.md      ← Quality Assurance Checklist (P0/P1/P2/P3 grading)
```

**Recommended Loading Order**:
1. Read through `SKILL.md` (this file) first to grasp the overview
2. **When choosing a direction in Step 0, read `styles.md`** — each of the 5 directions packages the theme color + recommended layout + chrome style
3. After Step 1 requirements clarification is complete, if direction needs validation, read `themes.md` for color palette details
4. **Before starting, read the `<style>` block of `assets/template.html`** — this is the sole source of class names; missing classes will crash the entire page's styling
5. Read `layouts.md` to select a layout (featuring the Pre-flight class name checklist and theme rhythm planning at the top)
6. Refer to `components.md` to inspect components during detailed adjustments
7. After generation, read `checklist.md` for self-inspection (P0-0 rule at the top enforces pre-flight)

## Core Design Principles (Philosophy)

> These principles were distilled from 5 iterations of the "solopreneur" presentation deck. Violating any of these will ruin the overall aesthetic.

1. **Restraint over flashiness** — WebGL backgrounds show through only on hero slides, remaining virtually invisible on standard pages
2. **Structure over decoration** — do not use shadows, floating cards, or padding boxes; all information relies on **large font sizes + font contrast + grid negative space**
3. **Content hierarchy is co-defined by font size and typeface** — largest serif = main title, medium serif = subtitle, large sans-serif = lead, small sans-serif = body, monospace = metadata
4. **Images are First-Class Citizens** — crop only the bottom of the image, keeping the top, left, and right intact; use fixed `height:Nvh` for the grid, do not use `aspect-ratio` to stretch
5. **Establish rhythm via hero slides** — alternating between hero and non-hero slides keeps the audience's eyes fresh
6. **Terminology consistency** — Keep "Skills" as "Skills", do not mix Chinese and English translations

## Reference Masterpieces

The visual tone of this skill references:

- Guizang presentation "Solopreneur: Organizations Folded by AI" (2026-04-22, 27 pages)
- *Monocle* magazine layout
- Demo from YC President Garry Tan's blog post "Thin Harness, Fat Skills"

These can be treated as style anchors.
