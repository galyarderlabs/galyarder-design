# Components Reference

The component handbook for the `magazine-web-ppt` skill. `template.html` already defines every style — this file is the "what does it look like, how do I use it" guide.

## Contents

- [Slide shell](#slide-shell)
- [Typography](#typography)
- [Chrome and foot](#chrome-and-foot)
- [Callout](#callout)
- [Stat — number matrix](#stat--number-matrix)
- [Platform card](#platform-card)
- [Rowline — table row](#rowline--table-row)
- [Pillar card](#pillar-card)
- [Tag and kicker](#tag-and-kicker)
- [Figure — image frame](#figure--image-frame)
- [Icons](#icons)
- [Ghost — oversize background type](#ghost--oversize-background-type)
- [Highlight — fluorescent marker](#highlight--fluorescent-marker)

---

## Slide shell

Every page is a `<section class="slide ...">`. It must include a `data-theme` attribute (`light` or `dark`); the navigation JS uses that attribute to swap backgrounds.

```html
<section class="slide light" data-theme="light">   <!-- light page -->
<section class="slide dark" data-theme="dark">     <!-- dark page -->
<section class="slide light hero" data-theme="light">  <!-- hero page: light + thin overlay so the WebGL shows through -->
<section class="slide dark hero" data-theme="dark">    <!-- hero page: dark + thin overlay -->
```

**Light vs dark — alternate them.** Switch theme every 2–3 pages and never go more than 3 pages on the same theme. The WebGL background cross-fades between the two shaders during navigation.

**Using `hero`**: only on visually dominant pages (covers, big quotes, act dividers, closes). Hero drops the overlay to 12–16%, so the WebGL pours through — keep text on hero pages minimal.

---

## Typography

The typography contract is the most important rule in the template. Don't mix roles.

| Class | Use | Font |
|---|---|---|
| `.display` | Oversize English (hero pages) | Playfair Display 700, 11vw |
| `.display-zh` | Oversize CJK title | Noto Serif SC 700, 7.8vw |
| `.h1-zh` | Page title | Noto Serif SC 700, 4.6vw |
| `.h2-zh` | Subhead | Noto Serif SC 600, 3.2vw |
| `.h3-zh` | Pipeline step title | Noto Serif SC 500, 1.9vw |
| `.lead` | Lead paragraph (larger than body) | Noto Serif SC 400, 1.9vw |
| `.body-zh` | **Body / description (sans)** | Noto Sans SC 400, 1.22vw |
| `.body-serif` | Body (serif) | Noto Serif SC 400, 1.3vw |
| `.kicker` | Section cue (above title) | IBM Plex Mono, 12px uppercase |
| `.meta` | Meta label | IBM Plex Mono, 0.88vw uppercase |
| `.big-num` | Hero number | Playfair Display 800, 10vw |
| `.mid-num` | Mid number | Playfair Display 700, 5.5vw |

**Core rule**:
- **Serif** (`serif-zh` / `serif-en`) — titles, hero quotes, numbers. Used for "visual emphasis."
- **Sans** (`sans-zh`) — body copy, long reading. Used for "information density."
- **Mono** (IBM Plex Mono) — kicker, meta, foot labels. Used as "decorative rhythm."

**Emphasis tricks**:
- `<em class="en">English word</em>` — renders the English word in Playfair Display italic (looks great).
- `<em style="opacity:.65">phrase</em>` — fades the back half of a title for rhythm.

---

## Chrome and foot

The metadata strip at the top and bottom of every page. Almost every page should have it.

```html
<div class="chrome">
  <div class="left">
    <span>Act One · The Hard Numbers</span>
    <span class="sep"></span>
    <span>Act I</span>
  </div>
  <div class="right"><span>02 / 27</span></div>
</div>

<!-- ... page body ... -->

<div class="foot">
  <div>Project · CodePilot　|　github.com/codepilot</div>
  <div>Act I · Dev Numbers</div>
</div>
```

**Rules**:
- `chrome.right` always carries the page number `NN / TOTAL`.
- `foot.title` carries a descriptive line; `foot.right` carries the English act marker.
- Together, chrome and foot form the "magazine masthead and folio."

---

## Callout

For featured quotes, key observations, and external citations.

```html
<div class="callout" style="max-width:80vw">
  <div class="q-big">"Three years ago this would have taken a ten-person team a year."</div>
  <span class="cite">— an observer</span>
</div>
```

Variants:
- No citation: drop `<span class="cite">`.
- English-language quote: `<em class="en">"Thin Harness, Fat Skills."</em>`.
- On a hero page: wrap with `style="position:relative;z-index:2"` so the background overlay doesn't cover it.

---

## Stat — number matrix

For metrics. Pairs naturally with `.grid-6` / `.grid-4`.

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

Three-part structure: `.m` mono mini-label → `.n` huge number → `.l` description. Render the unit after the number with `<em>` at 0.4em and 0.5 opacity.

**Common containers**:
- `.grid-6` — 3×2 grid (most common, six stats).
- `.grid-4` — 2×2 grid (four stats).
- `.grid-3` — three columns in a single row (three stats / pillars).

---

## Platform card

For social platforms / channels with follower counts.

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
  Includes the cross-posted Little Green Book mirror
</div>
```

**"Also On" variant** (secondary platforms):
```html
<div class="plat" style="border-top-style:dashed;opacity:.72">
  <div class="sub">Also On</div>
  <div class="body-zh" style="font-weight:600;margin-top:.8vh">
    Bilibili　·　Zhihu
  </div>
</div>
```

---

## Rowline — table row

List-style content, one item per row.

```html
<div class="rowline">
  <div class="k">CLAUDE.md</div>
  <div class="v">How you should work — behavior rules, working preferences, things to avoid.</div>
  <div class="m">EMPLOYEE · HANDBOOK</div>
</div>
```

Three columns: `.k` serif key, `.v` body description, `.m` mono label (right-aligned). The first and last rowlines pick up top/bottom borders automatically.

**Two-column variant**: `style="grid-template-columns:1fr 3fr"` and drop the `.m` column.

---

## Pillar card

A three-pillar structure, useful for "concepts in parallel" pages.

```html
<div class="grid-3">
  <div class="pillar">
    <div class="ic">01</div>
    <div class="t">Three-tier<br>document system</div>
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
  <div class="d">Authority over decisions and direction.<br>Trade-offs, taste, sense of direction.</div>
</div>
```

`.ic` can be a sequence number (`01 / 02 / 03` or `A. / B. / C.`) or a Lucide icon.

---

## Tag and kicker

**Kicker** is the small cue above a heading (mono, all caps, small):
```html
<div class="kicker">Past 64 days · Dev edition</div>
<div class="h1-zh">What one person built.</div>
```

**Tag** is a standalone capsule with a border:
```html
<div style="display:flex;gap:1.6vw;flex-wrap:wrap">
  <div class="tag">Up at 10 a.m.</div>
  <div class="tag">Gym Tue / Thu afternoons</div>
  <div class="tag">Still watching shows · still gaming at night</div>
</div>
```

---

## Figure — image frame

**This is the easiest component to get wrong, so the rules below are non-negotiable.**

### Base structure

```html
<figure class="tile">
  <div class="frame-img" style="height:26vh">
    <img src="images/xxx.png" alt="caption">
  </div>
  <figcaption class="frame-cap">
    <span class="pf">Twitter</span>
    <span class="nb">137K</span>
  </figcaption>
</figure>
```

### Hard constraints (learned the hard way)

1. **Always pin height with `height:Nvh`. Never use `aspect-ratio`.**
   - Reason: `aspect-ratio` inside a grid blows out the parent and stacks images.
   - Recommended values: `height:18vh` (compact strip), `22vh` (standard grid), `26vh` (feature), `28vh` (large image).

2. **`object-position:top center` is set in CSS**, so the bottom is the only side that can be cropped.
   - Cropping the top, left, or right is forbidden — those edges hold the screenshot's identity.

3. **For multiple images in a grid, write the grid inline rather than using `grid-3`**:
   ```html
   <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1vh 1.2vw">
     <figure class="tile">...</figure>
     <figure class="tile">...</figure>
     <figure class="tile">...</figure>
   </div>
   ```

4. **Aligning the image with the rest of the layout**: add `align-self:end` on the figure alone to anchor the image to the bottom of the cell.

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

While the real image is missing, drop in a dashed-frame placeholder:
```html
<div class="img-slot r-4x3">  <!-- r-4x3 / r-16x9 (default) / r-3x2 / r-1x1 -->
  <span class="plus">+</span>
  <span class="label">GitHub screenshot here</span>
</div>
```

---

## Icons

**Do not use emoji.** Use Lucide via CDN (already loaded by `template.html`).

```html
<i data-lucide="compass" class="ico-lg"></i>     <!-- large icon (pillar) -->
<i data-lucide="target" class="ico-md"></i>      <!-- medium icon (list item) -->
<i data-lucide="check-circle" class="ico-sm"></i>  <!-- small icon (inline) -->
```

**Common Lucide names** (grouped by intent):

- Judgment: `compass`, `target`, `crosshair`, `search-check`
- Relationships: `share-2`, `users`, `network`, `link`, `handshake`
- Branding: `crown`, `gem`, `award`, `star`, `badge-check`
- Process: `workflow`, `route`, `arrow-right-left`, `repeat`
- Data: `grid-2x2`, `bar-chart-3`, `trending-up`, `activity`
- Aesthetics: `palette`, `brush`, `eye`, `sparkles`
- Yes/no: `check-circle`, `x-circle`, `check`, `x`
- Direction: `arrow-right`, `arrow-up-right`, `corner-down-right`

**Inline icon + text combo**:
```html
<div class="h3-zh" style="display:flex;align-items:center;gap:.8em">
  <i data-lucide="target" class="ico-md"></i>
  Judgment — what's worth writing
</div>
```

---

## Ghost — oversize background type

Decorative oversize type at very low opacity, to add a magazine flourish.

```html
<div class="ghost" style="right:-6vw;top:-8vh">BUT</div>
<div class="ghost" style="left:-8vw;bottom:-18vh;font-style:italic">Harness</div>
```

- 34vw font size, 0.06 opacity.
- Common positions: `right:-6vw;top:-8vh` (overflow top-right) or `left:-8vw;bottom:-18vh` (overflow bottom-left).
- Content: an English word or number (chapter sequences 01/02/03, key words BUT/NOW/HERE).

**Note**: on pages that use `ghost`, give every other content node `position:relative;z-index:2` so they don't slide under the ghost.

---

## Highlight — fluorescent marker

A "highlighter" effect for short inline phrases:

```html
<span class="hi">not</span>
<span class="hi">a one-shot burst</span>
```

Renders a translucent bar behind the text. Dark themes get a light bar; light themes get a dark bar (handled in CSS).

**Use sparingly**: only on 1–3 key words, never across long stretches.
