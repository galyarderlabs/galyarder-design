# Components reference

Component handbook for the `magazine-web-ppt` skill. `template.html` already defines every style; this file just describes "what a component looks like and how to use it."

## Contents

- [Slide shell basics](#slide-shell-basics)
- [Typography](#typography)
- [Chrome & Foot](#chrome--foot)
- [Callout (quote frame)](#callout-quote-frame)
- [Stat (numeric grid)](#stat-numeric-grid)
- [Platform card](#platform-card)
- [Rowline (table row)](#rowline-table-row)
- [Pillar card](#pillar-card)
- [Tag & Kicker](#tag--kicker)
- [Figure (image frame)](#figure-image-frame)
- [Icons](#icons)
- [Ghost (giant background type)](#ghost-giant-background-type)
- [Highlight (marker)](#highlight-marker)

---

## Slide shell basics

Every page is a `<section class="slide ...">`. It must include the `data-theme` attribute (`light` or `dark`); the paging JS uses it to switch backgrounds.

```html
<section class="slide light" data-theme="light">   <!-- Light page -->
<section class="slide dark" data-theme="dark">     <!-- Dark page -->
<section class="slide light hero" data-theme="light">  <!-- Hero light: thin scrim, WebGL bleeds through -->
<section class="slide dark hero" data-theme="dark">    <!-- Hero dark: thin scrim -->
```

**Light vs dark — alternate them.** Switch theme every two or three pages and never run more than three pages of the same theme in a row. The WebGL background fades between the two shaders automatically.

**Use of the `hero` class**: only on visually dominant pages (cover, quote pages, act dividers, closer). With `hero` the scrim drops to 12–16% and the WebGL backdrop bleeds through aggressively, so don't pile too much text onto a hero page.

---

## Typography

Font roles are the most important rule in this template. No mixing.

| Class | Use | Font |
|---|---|---|
| `.display` | Mega-size English (hero pages) | Playfair Display 700, 11vw |
| `.display-zh` | Mega-size CJK headline | Noto Serif SC 700, 7.8vw |
| `.h1-zh` | Page main heading | Noto Serif SC 700, 4.6vw |
| `.h2-zh` | Sub-heading | Noto Serif SC 600, 3.2vw |
| `.h3-zh` | Pipeline step heading | Noto Serif SC 500, 1.9vw |
| `.lead` | Lead paragraph (larger than body) | Noto Serif SC 400, 1.9vw |
| `.body-zh` | **Body / description (sans-serif)** | Noto Sans SC 400, 1.22vw |
| `.body-serif` | Body (serif) | Noto Serif SC 400, 1.3vw |
| `.kicker` | Section hint (above heading) | IBM Plex Mono, 12px uppercase |
| `.meta` | Meta-info label | IBM Plex Mono, 0.88vw uppercase |
| `.big-num` | Giant numeric | Playfair Display 800, 10vw |
| `.mid-num` | Mid-size numeric | Playfair Display 700, 5.5vw |

**Core rule**:
- **Serif** (`serif-zh` / `serif-en`): headlines, key quotes, numerals — for "visual emphasis."
- **Sans-serif** (`sans-zh`): body description, longer reading content — for "information density."
- **Monospace** (`mono`): kicker, meta, English foot labels — for "rhythmic decoration."

**Emphasis tricks**:
- `<em class="en">English word</em>` — renders the English word as Playfair Display italic (looks sharp).
- `<em style="opacity:.65">phrase</em>` — fades the back half of a heading for tonal rhythm.

---

## Chrome & Foot

The metadata bars at the top and bottom of every page. Almost every slide should carry them.

```html
<div class="chrome">
  <div class="left">
    <span>Act I · Hard Data</span>
    <span class="sep"></span>
    <span>Act I</span>
  </div>
  <div class="right"><span>02 / 27</span></div>
</div>

<!-- ... main content ... -->

<div class="foot">
  <div class="title">Project · CodePilot　|　github.com/codepilot</div>
  <div>Act I · Dev Numbers</div>
</div>
```

**Rules**:
- `chrome.right` always shows page number `NN / TOTAL` (TOTAL = total slide count).
- `foot.title` is the descriptive label, `foot.right` is the English act marker.
- Together, chrome and foot create the "header / footer" magazine feel.

---

## Callout (quote frame)

Use it for key quotes, central observations, or someone else's words.

```html
<div class="callout" style="max-width:80vw">
  <div class="q-big">"Three years ago this would have taken<br>a team of ten an entire year."</div>
  <span class="cite">— An observer's verdict</span>
</div>
```

Variants:
- Without cite: drop `<span class="cite">`.
- English quote: `<em class="en">"Thin Harness, Fat Skills."</em>`
- On a hero page: wrap with `style="position:relative;z-index:2"` (so the background scrim doesn't cover it).

---

## Stat (numeric grid)

Display data metrics, usually in tandem with `.grid-6` / `.grid-4`.

```html
<div class="grid-6">
  <div class="stat">
    <span class="m">Duration</span>
    <span class="n">64<em style="font-size:.4em;opacity:.5;font-style:normal"> days</em></span>
    <span class="l">From zero to today</span>
  </div>
  <!-- ... more stats ... -->
</div>
```

Three-part shape: `.m` monospace label → `.n` giant number → `.l` description note. Units after the number wrap in `<em>` reduced to 0.4em, opacity 0.5.

**Common containers**:
- `.grid-6` — 3×2 grid (most common, six stats).
- `.grid-4` — 2×2 grid (four stats).
- `.grid-3` — three columns in one row (three stats / pillars).

---

## Platform card

Display a social platform / channel + follower count.

```html
<div class="plat">
  <div class="sub">Weibo</div>
  <div class="name">Weibo</div>
  <div class="nb">289K</div>
</div>
```

Optional fourth row (extra note):
```html
<div class="body-zh" style="font-size:max(11px,.8vw);opacity:.5;margin-top:.6vh">
  Includes RedNote sync
</div>
```

**"Also On" variant** (additional platforms):
```html
<div class="plat" style="border-top-style:dashed;opacity:.72">
  <div class="sub">Also On</div>
  <div class="body-zh" style="font-weight:600;margin-top:.8vh">
    Bilibili　·　Zhihu
  </div>
</div>
```

---

## Rowline (table row)

List-style content, one item per row.

```html
<div class="rowline">
  <div class="k">CLAUDE.md</div>
  <div class="v">How you should operate — behavior rules + work preferences + things to avoid</div>
  <div class="m">EMPLOYEE · HANDBOOK</div>
</div>
```

Three-column shape: `.k` serif keyword · `.v` body description · `.m` monospace tag (right-aligned). The first and last `.rowline` automatically pick up top/bottom borders.

**Two-column variant**: `style="grid-template-columns:1fr 3fr"` and drop the `.m` column.

---

## Pillar card

A three-pillar structure, common for "concepts in parallel" pages.

```html
<div class="grid-3">
  <div class="pillar">
    <div class="ic">01</div>
    <div class="t">Three-layer<br>doc system</div>
    <div class="d">CLAUDE.md<br>+ project knowledge base<br>+ guardrail files</div>
  </div>
  <!-- ... more pillars ... -->
</div>
```

**Pillar with icon (for emphasis pages)**:
```html
<div class="pillar" style="padding:4vh 2vw;border:1px solid currentColor;border-color:rgba(10,10,11,.2)">
  <div class="ic"><i data-lucide="compass" class="ico-lg"></i></div>
  <div class="t">Judgment</div>
  <div class="d">The authority on direction.<br>Tradeoffs, taste, sense of direction.</div>
</div>
```

`.ic` can be a number (`01 / 02 / 03` or `A. / B. / C.`) or a Lucide icon.

---

## Tag & Kicker

**Kicker** is the small hint above a heading (monospace, all caps, small):
```html
<div class="kicker">The last 64 days · Engineering</div>
<div class="h1-zh">One person — what got built.</div>
```

**Tag** is a standalone capsule label with a border:
```html
<div style="display:flex;gap:1.6vw;flex-wrap:wrap">
  <div class="tag">Wakes up at 10am</div>
  <div class="tag">Gym Tue / Thu afternoons</div>
  <div class="tag">Still watches shows · plays games at night</div>
</div>
```

---

## Figure (image frame)

**This is the easiest component to get wrong. Follow the rules below.**

### Basic structure

```html
<figure class="tile">
  <div class="frame-img" style="height:26vh">
    <img src="images/xxx.png" alt="Description">
  </div>
  <figcaption class="frame-cap">
    <span class="pf">Twitter</span>
    <span class="nb">137K</span>
  </figcaption>
</figure>
```

### Hard constraints (lessons learned the hard way)

1. **Always use a fixed `height:Nvh`**, not `aspect-ratio`.
   - Why: `aspect-ratio` inside a grid can break the parent and cause images to stack.
   - Recommended sizes: `height:18vh` (compact strip) / `22vh` (standard grid) / `26vh` (highlighted) / `28vh` (large).

2. **`object-position:top center` (already set in CSS)** — only the bottom may be cropped.
   - Never crop left, right, or top. That's the image's identity zone.

3. **For multiple images in a grid, use inline `display:grid` instead of `grid-3`**:
   ```html
   <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1vh 1.2vw">
     <figure class="tile">...</figure>
     <figure class="tile">...</figure>
     <figure class="tile">...</figure>
   </div>
   ```

4. **Aligning the image with the rest of the layout**: add `align-self:end` directly on the figure to pin the image to the bottom of its cell.

### Frame caption variants

```html
<!-- Standard: figure name on the left, number on the right -->
<figcaption class="frame-cap">
  <span class="pf">Twitter</span>
  <span class="nb">137K</span>
</figcaption>

<!-- With index -->
<figcaption class="frame-cap">
  <span class="idx">01</span>
  <span class="pf">AI Polish</span>
  <span>Polish</span>
</figcaption>
```

### Image placeholder (during design)

When the image isn't ready, use a dashed placeholder:
```html
<div class="img-slot r-4x3">  <!-- r-4x3 / r-16x9(default) / r-3x2 / r-1x1 -->
  <span class="plus">+</span>
  <span class="label">GitHub screenshot goes here</span>
</div>
```

---

## Icons

**No emoji.** Use Lucide via CDN (already wired up in `template.html`).

```html
<i data-lucide="compass" class="ico-lg"></i>     <!-- Large icon (used on pillars) -->
<i data-lucide="target" class="ico-md"></i>      <!-- Medium icon (used inline in lists) -->
<i data-lucide="check-circle" class="ico-sm"></i>  <!-- Small icon (inline use) -->
```

**Common Lucide icon names** (grouped by meaning):

- Judgment: `compass`, `target`, `crosshair`, `search-check`
- Relations: `share-2`, `users`, `network`, `link`, `handshake`
- Brand: `crown`, `gem`, `award`, `star`, `badge-check`
- Workflow: `workflow`, `route`, `arrow-right-left`, `repeat`
- Data: `grid-2x2`, `bar-chart-3`, `trending-up`, `activity`
- Aesthetics: `palette`, `brush`, `eye`, `sparkles`
- Yes/no: `check-circle`, `x-circle`, `check`, `x`
- Direction: `arrow-right`, `arrow-up-right`, `corner-down-right`

**Icon and text inline together**:
```html
<div class="h3-zh" style="display:flex;align-items:center;gap:.8em">
  <i data-lucide="target" class="ico-md"></i>
  Judgment — what's worth writing
</div>
```

---

## Ghost (giant background type)

A "decorative background word" with very low opacity — adds magazine flair.

```html
<div class="ghost" style="right:-6vw;top:-8vh">BUT</div>
<div class="ghost" style="left:-8vw;bottom:-18vh;font-style:italic">Harness</div>
```

- 34vw font-size, 0.06 opacity.
- Common positions: `right:-6vw;top:-8vh` (overflow upper-right) / `left:-8vw;bottom:-18vh` (overflow lower-left).
- Content: an English word or number (chapter index 01/02/03, keywords like BUT/NOW/HERE).

**Note**: when ghost is on a page, give other content `position:relative;z-index:2` so it sits above.

---

## Highlight (marker)

A "highlighter" effect on inline phrases:

```html
<span class="hi">not</span>
<span class="hi">a one-shot burst</span>
```

It draws a translucent strip under the text. Dark theme uses a light strip; light theme uses a dark one (handled by CSS).

**When to use**: only one to three keywords per page — don't smear it across full sentences.
