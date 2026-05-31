# Quality Checklist

This list comes from the iteration history of a real "solo company" deck. Each item is a real lesson learned, sorted by importance.

Skim it before generating a deck; tick it off after.

---

## P0 — never skip

### 0. Class-name preflight before generation (most important)

**Symptom**: pasting layouts.md skeletons into a fresh HTML file and watching the styling fall apart — big titles render in sans-serif, big-number cards shrink down to body size, multi-row pipelines collapse onto one line, and images drift to the bottom of the browser.

**Root cause**: if `template.html`'s `<style>` block doesn't define those classes, the browser falls back to default styling.

**What to do**:
- **Before generating any deck, `Read` `assets/template.html`** and confirm every class used by layouts.md is defined.
- The classes most commonly missed: `h-hero / h-xl / h-sub / h-md / lead / meta-row / stat-card / stat-label / stat-nb / stat-unit / stat-note / pipeline-section / pipeline-label / pipeline / step / step-nb / step-title / step-desc / grid-2-7-5 / grid-2-6-6 / grid-2-8-4 / grid-3-3 / frame / img-cap / callout-src`.
- If a class is genuinely missing, **add it inside template.html's `<style>`** rather than re-defining it inline on every slide.
- After generating, open the deck in a browser. Symptoms like "big title rendered in sans-serif" or "pipeline steps crammed onto one line" almost always point back to this issue.

### 1. No emoji as icons

**Symptom**: dropping emoji (🎯 💡 ✅) into an editorial-styled deck breaks the tone instantly.

**Fix**: use the Lucide icon set via CDN:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
...
<i data-lucide="target" class="ico-md"></i>
...
<script>lucide.createIcons();</script>
```

Common icon names: `target / palette / search-check / compass / share-2 / crown / check-circle / x-circle / plus / arrow-right / grid-2x2 / network`.

### 2. Crop only the bottom of an image — never the top, left, or right

**Symptom**: using `aspect-ratio` on grid images blows out the parent or trims the top of the image (e.g., the title bar of a screenshot).

**Fix**: container uses **fixed height + overflow hidden**, and the image relies on `object-fit:cover + object-position:top`:

```html
<figure class="frame-img" style="height:26vh">
  <img src="screenshot.png">
</figure>
```

`.frame-img img` already has `object-position:top` set, so the bottom is the only crop edge.

**Anti-pattern** (blows out the container in a grid):

```html
<!-- bad -->
<figure class="frame-img" style="aspect-ratio: 16/9">...</figure>
```

**Exception**: a single hero image (not in a grid) can use `aspect-ratio + max-height` because the parent contains the overflow.

### 2b. A light page over a dark WebGL canvas reads as a gray haze (theme switch failed)

**Symptom**: every light page looks veiled in gray — even hero light.

**Root cause**: the JS swaps the two canvases by switching their opacity based on the slide's theme. If the deck opens with `hero dark` and nothing later flips the body to light, the body never gets `light-bg`, so `canvas#bg-dark` stays on top.

**Fix**:
- The template's `go()` function infers theme from `classList` (`light` / `dark`), so **every slide must carry an explicit `light` or `dark` class**. Don't omit it. Don't invent a custom theme name.
- Hero pages use `hero light` / `hero dark`; body pages use `light` / `dark`. Writing `hero` alone (without a theme) is broken.
- Every deck must include at least one **non-hero light page** so the body has a chance to add `light-bg`.

### 2b-2. The whole deck is light — no rhythm

**Symptom**: aside from a `hero dark` cover, every page reads as `light` — visually flat, no breath, all white.

**Root cause**: layouts.md skeletons default to `light`. If you paste them in without adjusting themes, everything stays light.

**Fix**:
- **Draw the "theme rhythm table" before generating**: per page, mark `hero dark` / `hero light` / `light` / `dark`, align on it, then write code.
- **Hard rules**: never more than 3 pages in a row on the same theme; decks of 8+ pages must include at least one `hero dark` and one `hero light`; never an all-light deck — there must be at least one `dark` body page.
- **Pick themes by layout** (see the "Theme rhythm planning" section in layouts.md):
  - Quote + image (Layout 4), big quote (Layout 8), lead image + side text (Layout 10) → **alternate `light` / `dark`**.
  - Big numbers, image grid, pipeline, comparison → `light` (screenshots / numbers / process want a bright base).
  - Cover, hero question → `hero dark`.
  - Act dividers → alternate `hero dark` and `hero light`.
- **Self-check after generating**: `grep 'class="slide' index.html` and confirm visually that the rhythm alternates.

### 2c. Don't put the same line in chrome and kicker

**Symptom**: the top-left chrome reads "Design First · Design First" and the kicker on the same page reads "Phase 01 · Design Phase" — same content paraphrased, reads as AI-generated.

**Fix**:
- **chrome = masthead / nav label**: stable across pages (e.g., "Act II · Workflow", "Data · Result", "lukew.com · 2026.04").
- **kicker = a one-page hook**: short, with a hook, the small phrase above the headline (e.g., "BUT", "What one person built.", "The Question").
- One labels the section; the other labels the page. They never paraphrase each other.

### 3. A big title can't outgrow the page width / character count

**Symptom**: setting a CJK title at, say, 13vw produces one character per line — forced wrapping looks awful.

**Fix**:
- `h-hero` (largest): 10vw, **and the title is ≤ 5 characters**.
- `h-xl` (next): 6vw–7vw.
- For long titles, break manually with `<br>` rather than relying on automatic wrapping.
- Add `white-space:nowrap` if needed.

**Example**: "I'm not a programmer." (use `h-xl` at 7.2vw + nowrap to fit in one line).

### 4. Type roles: serif for titles, sans for body

**Fix**:
- Big titles, hero quotes, hero numbers → **serif** (Noto Serif SC + Playfair Display + Source Serif).
- Body, descriptions, pipeline step titles → **sans** (Noto Sans SC + Inter).
- Meta, code, labels → **mono** (IBM Plex Mono + JetBrains Mono).

All fonts come from Google Fonts via CDN; the template already sets them up.

### 4b. Don't use `align-self:end` to anchor an image to the bottom

**Symptom**: in a quote + image layout, you set `align-self:end` on the right column's `<figure>` to bottom-align it with the left column's callout. Result:
- If the parent isn't a grid (e.g., the class wasn't defined), `align-self` does nothing and the image falls to the end of the document, hidden under the browser chrome.
- Even inside a grid, the image lands at the bottom of the cell and on low-res screens it's covered by `.foot` and the `#nav` dots.

**Fix**:
- Mixed image + text layouts **must** use `.frame.grid-2-7-5` (or `.grid-2-6-6` / `.grid-2-8-4`).
- Right column `<figure class="frame-img">` uses **a standard 16/10 or 4/3 ratio + `max-height:56vh`** and naturally sits at the top of its cell.
- To make the left-column callout look like it's "at the bottom," apply flex column + `justify-content:space-between` on the **left column**. Don't touch the right column.

### 4c. Don't reuse odd source aspect ratios

**Symptom**: copying `aspect-ratio: 2592/1798` from the original image leaves awkward whitespace or overflow on different screens.

**Fix**: regardless of the source ratio, use a standard ratio for the frame — **16/10 / 4/3 / 3/2 / 1/1 / 16/9**. The image automatically uses `object-fit:cover + object-position:top`; the top is preserved and a sliver of the bottom is cropped, which is fine.

### 5. No heavy borders or shadows on images

**Symptom**: adding strong shadows or a black frame to "look premium" instantly turns the deck into a corporate slide.

**Fix**: at most a 1–4px micro-radius + the **subtle base noise** the template already provides. Don't add `box-shadow`, don't add `border` (except a 1px very-light gray).

---

## P1 — typesetting rhythm

### 6. Alternate hero and non-hero pages

**Recommended rhythm** (25–30 pages):
```
Hero cover → Act divider (hero) → 3–4 non-hero pages → Act divider (hero)
→ 4–5 non-hero pages → Hero question → ... → Hero close
```

Two hero pages in a row is tiring; four non-hero pages in a row kills the rhythm.

### 7. Alternate big-number pages with dense pages

Big-number pages (hero numbers / hero questions) should alternate with dense pages (pipelines / image grids) so the eye gets a break.

### 8. Use one consistent term for each concept

**Symptom**: "Skills" once, "skill set" the next time, "fat skills" a third time. The deck reads as inconsistent.

**Fix**:
- Prefer the **English term** for industry vocabulary (Skills / Harness / Pipeline / Workflow) — these are familiar inside the field.
- Don't force a translation; forced translations read as awkward.
- Pick one spelling per term and use it everywhere.

### 9. Page numbers in the bottom chrome should be consistent

Use the format `XX / TOTAL` (e.g., `05 / 27`). **Don't add a separate dynamic page number top-right** — it duplicates `.chrome`.

---

## P2 — visual polish

### 10. WebGL background overlay opacity

**Dark hero**: 12–15% overlay (WebGL is clearly visible).
**Light hero**: 16–20% overlay (WebGL is faintly visible, doesn't fight the type).
**Standard light / dark pages**: 92–95% overlay (almost opaque).

If the page has very little text (a hero question), the overlay can go thinner; for dense body, thicken the overlay to keep readability.

### 11. The shader on a light hero must not have a strong center

**Symptom**: spiral vortex or radial ripples on a light theme look like a Windows 98 screensaver.

**Fix**: light hero uses an FBM domain-warp flow with no center; base color stays silver / paper (close to `#F0F0F0` / `#FBF8F3`); rainbow tint is subtle (under 0.05).

### 12. Dark hero can carry more visual punch

Dark hero can use shaders like Holographic Dispersion (titanium dispersion) with a center structure — a black background absorbs more visual information.

### 13. Quote + image alignment

- Left column body group uses `justify-content:space-between`: title pinned to the top, callout drops to the bottom.
- Right column image uses `align-self:end` to bottom-align with the left column. (See P0 #4b for when this fails.)
- Grid as a whole uses `align-items:start` (not `center` / `end`).

### 14. Subtle radius on images

Every `.frame-img` and `.frame-img img` gets `border-radius:4px` — soft but not soft-looking. **Never go above 8px**, or it starts to feel like a consumer app UI.

---

## P3 — operational details

### 15. Use relative paths for images

Put images under `images/` and reference them with relative paths like `images/xxx.png`. No absolute paths.

### 16. Page numbers are hard-coded in `.chrome`

The JS computes the total page count and expands the bottom dot navigation, but the `XX / N` in `.chrome` is hard-coded. Edit `N` by hand when you add or remove pages.

### 17. Keep the navigation in place

The template supports ← → / wheel / touch / dot navigation / Home·End by default. Don't remove the navigation logic from the JS.

### 18. Don't pin sections at `height:100vh`; use `min-height:80vh`

`height:100vh` fits content exactly to the viewport, but the browser chrome eats some of that height and the content overflows. `min-height:80vh + align-content:center` is more robust.

---

## Final self-check

After generating the deck, walk through this list and tick each item:

```
Pre-generation
  □ Read template.html's <style>; every required class is defined.
  □ Decided which Layout (1–10) each page uses.
  □ Drew the theme rhythm table — every page tagged with hero dark / hero light / light / dark.
  □ The rhythm satisfies the hard rules: no 3 in a row on the same theme; for 8+ pages, at least one hero dark + one hero light; at least one dark body page.
  □ The `<title>` is the actual deck title (grep "[required]" finds nothing).

Content
  □ The page distribution per act is balanced.
  □ No emoji icons.
  □ Terminology like Skills / Harness is consistent.
  □ Per-page kicker / title / body has clear three-tier hierarchy.

Layout
  □ No big title forced into one character per line.
  □ Image grids use height:Nvh, not aspect-ratio.
  □ Images crop only at the bottom; top, left, and right are intact.
  □ Serif / sans usage matches the template.
  □ Pipeline sections have visible separators.

Visuals
  □ Hero and non-hero pages alternate.
  □ WebGL background visible on hero pages.
  □ Images have a subtle radius.
  □ No heavy shadows or borders.

Interaction
  □ ← → navigation works.
  □ Bottom dot count matches total page count.
  □ Page number in chrome matches the actual page number.
  □ ESC opens the index view (if retained).
```

A deck is shippable only when every item is ticked.
