# Quality checklist

This checklist comes from the real iteration loop on the "One-Person Company" deck. Every item is a lesson learned the hard way, ordered by importance.

Read it through before generating; after generating, walk it item by item.

---

## 🔴 P0 · Don't ship without these

### 0. Class-name preflight check (the single most important step)

**Symptom**: paste a `layouts.md` skeleton straight into a new HTML file and the styles vanish — big headlines render as sans-serif, big-number cards shrink to body size, multi-column pipelines collapse into one row, images stack at the bottom of the page.

**Root cause**: if `template.html`'s `<style>` doesn't define those classes, the browser falls back to defaults.

**Do this**:
- **Before generating, `Read` `assets/template.html` first** and confirm every class used in `layouts.md` is defined.
- The most commonly missing ones: `h-hero / h-xl / h-sub / h-md / lead / meta-row / stat-card / stat-label / stat-nb / stat-unit / stat-note / pipeline-section / pipeline-label / pipeline / step / step-nb / step-title / step-desc / grid-2-7-5 / grid-2-6-6 / grid-2-8-4 / grid-3-3 / frame / img-cap / callout-src`.
- If a class is genuinely missing, **add it to template.html's `<style>`** rather than redefining it inline on every page.
- Open in a browser after generating; if you see "headline is sans-serif" or "pipeline steps crammed into one row," it's almost certainly this issue.

### 1. No emoji as icons

**Symptom**: emoji (🎯 💡 ✅) inside an editorial magazine style instantly breaks the tone.

**Do this**: use the Lucide icon library, loaded via CDN:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
...
<i data-lucide="target" class="ico-md"></i>
...
<script>lucide.createIcons();</script>
```

Common icon names: `target / palette / search-check / compass / share-2 / crown / check-circle / x-circle / plus / arrow-right / grid-2x2 / network`.

### 2. Only the bottom of an image may be cropped — never the top, left, or right

**Symptom**: using `aspect-ratio` to fill the frame means the grid stacks or crops out the image's identity area (e.g. the title bar at the top of a screenshot) when the parent doesn't have enough room.

**Do this**: image containers use **fixed height + overflow hidden**, and the image itself uses `object-fit:cover + object-position:top`:

```html
<figure class="frame-img" style="height:26vh">
  <img src="screenshot.png">
</figure>
```

`.frame-img img` already presets `object-position:top`, so only the bottom is cropped.

**Never write this** (it overflows in a grid):

```html
<!-- bad -->
<figure class="frame-img" style="aspect-ratio: 16/9">...</figure>
```

**Exception**: a single hero image (not in a grid) can use `aspect-ratio + max-height` because the parent is the safety net.

### 2b. Light page + dark WebGL = washed-out gray (theme switch didn't fire)

**Symptom**: every light page looks like it has a gray haze on top, even hero light pages.

**Root cause**: the JS picks the canvas based on the slide's theme. If the deck opens with `hero dark` and there's no mechanism that flips the bg to light, the body never picks up the `light-bg` class — `canvas#bg-dark` stays on top forever.

**Do this**:
- The `go()` function in the template now infers the theme from the `classList` (`light` / `dark`), so **every slide must carry `light` or `dark` explicitly**. Don't leave it off, and don't invent custom theme names.
- Hero pages use `hero light` / `hero dark`; body pages use `light` / `dark`. Just `hero` without a theme is broken.
- A deck must contain at least one **non-hero light page** so the body has a chance to pick up `light-bg`.

### 2b-2. The whole deck is `light`, no rhythm

**Symptom**: aside from the cover (`hero dark`), every other page is `light` — visually flat, no breathing, all-white blur.

**Root cause**: the layouts.md skeletons default to `light`, so pasting them straight in without adjusting themes leaves everything bright.

**Do this**:
- **Sketch a "theme rhythm table" before generating**: every page lists exactly which of `hero dark` / `hero light` / `light` / `dark` it uses; reconcile, then write code.
- **Hard rules**: never run three or more pages of the same theme; for decks of eight pages or more, ship at least one `hero dark` + one `hero light`; never run a deck of only `light` body pages — at least one `dark` body page.
- **Pick theme by layout** (see "Theme rhythm planning" at the top of layouts.md):
  - Text + image (Layout 4), big quote (Layout 8), mixed media (Layout 10) → **alternate `light` / `dark`**.
  - Big numbers, image grid, pipeline, before/after → `light` (screenshots / numbers / flow want a bright background).
  - Cover, question pages → `hero dark`.
  - Act dividers → alternate `hero dark` and `hero light`.
- **Self-check after generating**: `grep 'class="slide' index.html` and confirm visually that the rhythm interleaves.

### 2c. Don't write the same thing in chrome and kicker

**Symptom**: top-left `.chrome` reads "Design First", and the same page's `.kicker` reads "Phase 01 · Design phase" — same idea twice, instantly reads as AI-generated.

**Do this**:
- **chrome = magazine page header / nav label**: can repeat across multiple pages (e.g. "Act II · Workflow", "Data · Result", "lukew.com · 2026.04").
- **kicker = a one-of-a-kind hook for this page**: short, hooky, the "small prefix" to the headline (e.g. "BUT", "One person — what got built.", "The Question").
- One describes the section, the other describes this specific page — they never paraphrase one another.

### 3. Big headline font sizes can't outgrow the screen / character count

**Symptom**: setting a CJK headline too big (say 13vw) leaves only one character per line, forcing ugly hard wraps.

**Do this**:
- `h-hero` (largest): 10vw, **and headline length ≤ 5 characters**.
- `h-xl` (next): 6vw–7vw.
- For long headlines, break manually with `<br>` rather than relying on auto-wrap.
- Add `white-space:nowrap` when needed.

**Example**: "I'm not a programmer." in `h-xl` 7.2vw + `nowrap` lays out cleanly on one line.

### 4. Type roles: serif for headlines, sans-serif for body

**Do this**:
- Big headlines, key quotes, large numerals → **serif** (Noto Serif SC + Playfair Display + Source Serif).
- Body, descriptions, pipeline step names → **sans-serif** (Noto Sans SC + Inter).
- Metadata, code, labels → **monospace** (IBM Plex Mono + JetBrains Mono).

All fonts come in via Google Fonts CDN, already preset in the template.

### 4b. Don't use `align-self:end` to pin images to the bottom

**Symptom**: in a text + image layout, you add `align-self:end` to a `<figure>` so the image visually aligns with the bottom of the left-column callout. The result:
- If the parent isn't a grid (e.g. the class is undefined), `align-self` does nothing and the image falls to the very end of the document flow, where the browser footer covers it.
- Even when it is a grid, the image sticks to the bottom of the cell and gets covered by `.foot` and the `#nav` dots on low-resolution screens.

**Do this**:
- Text + image **must use `.frame.grid-2-7-5`** (or `.grid-2-6-6` / `.grid-2-8-4`).
- The right column `<figure class="frame-img">` uses **standard 16/10 or 4/3 ratio + max-height:56vh** and snaps naturally to the top.
- To make the left-column callout look "anchored to the bottom," give the **left column** flex column + `justify-content:space-between` — leave the right column alone.

### 4c. Don't use the source image's odd aspect ratio

**Symptom**: `aspect-ratio: 2592/1798` — copied from the source — produces weird whitespace or overflow on different screens.

**Do this**: regardless of the source ratio, the placeholder always uses a standard ratio: **16/10 / 4/3 / 3/2 / 1/1 / 16/9**. The image gets `object-fit:cover + object-position:top` automatically — top stays intact, a sliver of bottom gets cropped, no harm done.

### 5. No heavy borders or shadows on images

**Symptom**: adding strong shadows or thick black frames "for sophistication" instantly turns the deck into a corporate slide.

**Do this**: at most a 1–4px gentle radius + **subtle background noise** (already in the template). No `box-shadow`, no `border` (except a 1px hairline gray when truly needed).

---

## 🟡 P1 · Layout rhythm

### 6. Alternate hero and non-hero pages

**Recommended rhythm** (25–30 pages):
```
Hero Cover → Act Divider (hero) → 3-4 non-hero pages → Act Divider (hero)
→ 4-5 non-hero pages → Hero Question → ... → Hero Close
```

Two or more hero pages in a row tire the audience; four or more non-hero pages in a row kill the rhythm.

### 7. Alternate big-statement pages and dense pages

Big statements (big numbers / hero question) interleaved with dense pages (pipeline / image grid) keep the audience's eyes fresh.

### 8. Use the same usage for the same English / CJK term throughout

**Symptom**: the deck switches between "Skills", "Capabilities", and "Skills (functions)" — never settles.

**Do this**:
- Prefer **English words** for terms (Skills / Harness / Pipeline / Workflow); they're familiar in the field.
- **Don't force-translate** — forced translations read awkwardly.
- Use one writing for the same term throughout the deck.

### 9. Page numbers in the bottom chrome must stay consistent

Use the `XX / total` format (e.g. `05 / 27`). **Don't add a dynamic page number in the top-right** (it duplicates `.chrome`).

---

## 🟢 P2 · Visual polish

### 10. WebGL background scrim opacity

**dark hero**: scrim 12–15% (WebGL clearly visible).
**light hero**: scrim 16–20% (WebGL faintly visible, doesn't fight the type).
**regular light/dark page**: scrim 92–95% (almost opaque).

If a page has very little text (a hero question), the scrim can go thinner; if body copy is dense, thicken the scrim to keep type readable.

### 11. Light-hero shaders shouldn't have a strong center point

**Symptom**: Spiral Vortex / radial ripple gets too prominent under the light theme — looks like a Windows 98 screensaver.

**Do this**: light hero uses FBM domain-warp flow with no center, base color stays silver / paper (close to #F0F0F0 / #FBF8F3), with subtle rainbow shifts (under 0.05).

### 12. Dark hero allows more visual punch

Dark hero can use Holographic Dispersion (titanium dispersion) and similar shaders with a center structure — black backgrounds carry more visual information.

### 13. Aligning text + image

- Left column text group `justify-content:space-between`: heading sticks to the top, callout drops to the bottom.
- Right column image `align-self:end`: aligns with the bottom of the left column.
- Whole grid `align-items:start` (not `center` / `end`).

### 14. Subtle radius on images

All `.frame-img` and `.frame-img img` get `border-radius:4px` — visually softens but not soft. **Don't go above 8px**, or it starts to look like a consumer app.

---

## 🔵 P3 · Operational details

### 15. Use relative paths for images

Images go in an `images/` folder; HTML uses relative paths like `images/xxx.png`, not absolute paths.

### 16. Hard-code the page number in `.chrome`

JS calculates total pages and expands the bottom dot navigation, but the `XX / N` in `.chrome` is hard-coded. When adding or removing pages, update N manually.

### 17. Keep the navigation

The template ships with: ← → / scroll wheel / touch swipe / footer dots / Home·End. Don't strip the nav logic from the JS.

### 18. Don't hard-set `height:100vh`; use `min-height:80vh`

`100vh` makes content fill the screen exactly, but the browser toolbar / tab bar steals some of it and content overflows. `min-height:80vh + align-content:center` is more robust.

---

## 🧪 Final self-check

After generating the deck, walk through this list (tick them off):

```
Preflight (before generating)
  □ Have read template.html's <style> and confirmed every required class exists
  □ Have decided on a Layout (1-10) for each page
  □ Have sketched a "theme rhythm table": every page tagged with hero dark / hero light / light / dark
  □ Rhythm table satisfies the hard rules: no 3+ consecutive pages of the same theme / ≥1 hero dark + ≥1 hero light (for decks of 8+ pages) / at least 1 dark body page
  □ `<title>` updated to the actual deck title (grep "[REQUIRED]" should return nothing)

Content
  □ Page count per act is balanced (no top-heavy structure)
  □ No emoji used as icons
  □ Terms like Skills / Harness used consistently
  □ Each page has clear three-tier hierarchy: kicker + headline + body

Layout
  □ No headline wraps with one character per line
  □ Image grids use height:Nvh, not aspect-ratio
  □ Images crop only the bottom; top, left, and right intact
  □ Serif / sans-serif roles match the template
  □ Multiple pipeline groups have visible separators

Visual
  □ Hero pages alternate with non-hero pages
  □ WebGL background visible on hero pages
  □ Images have a subtle radius
  □ No heavy shadows or borders

Interaction
  □ ← → navigation works
  □ Footer dot count matches total pages
  □ Page numbers in chrome match the actual page index
  □ ESC key triggers the overview view (if kept)
```

When everything is ticked, the deck is shippable.
