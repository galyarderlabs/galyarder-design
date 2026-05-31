# Layouts Library

Ten of the most useful page layouts, each as a complete `<section class="slide ...">...</section>` you can paste in and edit copy / images for.

---

## Pre-flight (read before generating)

### A. Class names must come from template.html

Every class used in the layouts below (`h-hero` / `h-xl` / `h-sub` / `h-md` / `lead` / `meta-row` / `stat-card` / `stat-label` / `stat-nb` / `stat-unit` / `stat-note` / `pipeline-section` / `pipeline-label` / `pipeline` / `step` / `step-nb` / `step-title` / `step-desc` / `grid-2-7-5` / `grid-2-6-6` / `grid-2-8-4` / `grid-3-3` / `grid-6` / `grid-3` / `grid-4` / `frame` / `frame-img` / `img-cap` / `callout` / `callout-src` / `kicker`) is predefined in the `<style>` block of `assets/template.html`.

**Do not invent new class names.** If something needs custom styling, write it inline with `style="..."`. If you're unsure whether a class exists, grep `template.html` to confirm before generating.

### B. Image aspect ratios (very important)

**Always use standard ratios.** Never copy odd values like `aspect-ratio: 2592/1798` from the original asset:

| Use case | Ratio | How to write it |
|---|---|---|
| Quote + image hero | 16:10 or 4:3 | `aspect-ratio:16/10; max-height:54vh` |
| Image grid (multi-image comparison) | Uniform | **Use a fixed `height:26vh`, not `aspect-ratio`** |
| Side image + body text | 1:1 or 3:2 | `aspect-ratio:1/1; max-width:40vw` |
| Full-bleed hero visual | 16:9 | `aspect-ratio:16/9; max-height:64vh` |
| Inline figure in mixed layout | 3:2 | `aspect-ratio:3/2; max-width:30vw` |

Wrap images in `<figure class="frame-img">`. The `<img>` inside automatically uses `object-fit:cover + object-position:top center`, so only the bottom can be cropped — never the top, left, or right.

### C. Image placement rules (avoid images sliding to the bottom of the page or being covered by the browser chrome)

**Anti-patterns** (we've already hit each of these):
- Using `align-self:end` outside a flex / grid container — `align-self` does nothing in normal flow, and the image falls to the bottom of the document and gets covered by the browser chrome.
- Pinning images with `position:absolute + bottom:0` — they end up underneath the `.foot` and `#nav` dots.
- Setting only `height:N vh` on a single image without a `max-height` — it overflows the viewport on low-resolution screens.

**Right way**:
- Mixed image + text layouts **must** use `.frame.grid-2-7-5` (or `.grid-2-6-6` / `.grid-2-8-4`).
- Grid containers default to `align-items:start` (set in the template), so images naturally sit at the top of their cell.
- To get "image bottom-aligns with left-column callout": **make the left column flex column with `justify-content:space-between`** (so the callout drops to the bottom on its own); **don't add `align-self:end` to the right column**.
- Add `style="padding-top:6vh"` inline on grid wrappers to give the title block room to breathe.

### D. Theme color and theme rhythm

- Theme colors come from the five presets in `references/themes.md`. Custom hex values are not allowed.
- Theme rhythm (which of `light` / `dark` / `hero light` / `hero dark` each page uses) follows the hard rules in "Theme rhythm planning" below — read it before generating.
- Both decisions must happen before you pick layouts; otherwise you'll have to rework slides.

---

## 0. Base structure (every slide shares this)

```html
<section class="slide [light|dark|hero light|hero dark]">
  <div class="chrome">
    <div>Context tag · Sub-tag</div>
    <div>ACT · Page number / Total</div>
  </div>
  <!-- Main content -->
  <div class="foot">
    <div>Page note · Page Description</div>
    <div>— · —</div>
  </div>
</section>
```

- Non-hero pages should carry `light` or `dark`; hero pages use `hero light` or `hero dark` (those drive WebGL theme interpolation).
- `chrome` and `foot` are optional but strongly recommended — they form the "magazine masthead and folio" anchors.
- **Use hero pages for chapter covers, openings, closes, and transitions.** Body content goes on non-hero pages.

### Don't repeat the same line in chrome and kicker

This is the most common content-duplication mistake. The two slots speak to entirely different dimensions:

| Position | Role | Content character | Examples |
|---|---|---|---|
| `.chrome` top-left | **Masthead / nav metadata** | Stable "section name" or chapter category, repeats across pages | "Act II · Workflow" / "Data · Result" / "lukew.com · 2026.04" |
| `.chrome` top-right | **Page + act number** | Fixed format | "Act II · 15 / 25" |
| `.kicker` | **A line that exists only on this page** | A short hook above the headline, like a subhead in a magazine, unique per page | "BUT" / "What one person built." / "Phase 01 · Design" |

**Anti-pattern** (we've already hit this): the chrome reads "Design First · Design First", and the kicker reads "Phase 01 · Design Phase" — same meaning, twice. Reads as AI-generated immediately.

**Right way**: chrome is the **section label** (stable, reusable across pages); kicker is the **page-specific hook** (short, dramatic). They complement each other instead of paraphrasing each other.

### Theme rhythm planning (mandatory before generating)

**Mechanism**: every `<section>` must carry exactly one of `light` / `dark` / `hero light` / `hero dark`. The navigation JS reads this class to decide whether the body gets `light-bg`, which controls which of the two WebGL canvases sits on top. No theme class — or a custom name — falls back incorrectly.

#### Theme defaults by layout

| Layout | Default theme | Reason |
|---|---|---|
| 1. Hero cover | `hero dark` | Opening ceremony — dark backdrops hit harder. |
| 2. Act divider | **Alternate `hero dark` and `hero light`** | Breathing rhythm. |
| 3. Big numbers | `light` | Numbers want a paper-white background; insert a `dark` between bursts. |
| 4. Quote + image | **Alternate `light` and `dark`** | Workhorse for body rhythm. |
| 5. Image grid | `light` | Screenshots want a bright base. |
| 6. Pipeline | `light` | Process diagrams need clarity. |
| 7. Hero question | `hero dark` | Strong visual punch by default. |
| 8. Big quote | **Prefer `dark`**, occasional `light` | Quote ceremony needs a dark backdrop. |
| 9. Comparison | `light` | Two columns need clarity. |
| 10. Lead image + side text | **Alternate `light` and `dark`** | Rhythm. |

#### Hard rhythm rules (grep after generating to self-check)

- ❌ **No more than 3 pages in a row** with the same theme (light or dark).
- ❌ Decks of 8+ pages **must contain** at least one `hero dark` and one `hero light`.
- ❌ A deck made entirely of `light` body pages with no `dark` body pages reads as flat — there's no breath.
- ✅ Insert one hero (cover / divider / question / big quote) every 3–4 pages.

#### 8-page rhythm template (drop-in)

| Page | Theme | Layout | Note |
|---|---|---|---|
| 1 | `hero dark` | Cover | Opener |
| 2 | `light` | Big numbers | Drop the data |
| 3 | `dark` | Quote + image | Contrast / story |
| 4 | `light` | Pipeline | Process |
| 5 | `hero light` | Act divider | Breath |
| 6 | `dark` | Quote + image or big quote | |
| 7 | `hero dark` | Hero question | Tension |
| 8 | `light` | Big quote / close | Wrap |

**Plan this table first; only then start writing slides.** Skipping the planning step and pasting raw layouts gives you a deck that's all `light`.

---

## Layout 1: Hero cover

```html
<section class="slide hero dark">
  <div class="chrome">
    <div>A Talk · 2026.04.22</div>
    <div>Vol.01</div>
  </div>
  <div class="frame" style="display:grid; gap:4vh; align-content:center; min-height:80vh">
    <div class="kicker">Private gathering · Li Jigang</div>
    <h1 class="h-hero">Solo Company</h1>
    <h2 class="h-sub">An organization folded by AI</h2>
    <p class="lead" style="max-width:60vw">
      An AI creator — 110,000 lines of code in 64 days, sustained output across 9 platforms, with daily routine almost untouched.
    </p>
    <div class="meta-row">
      <span>guizang</span><span>·</span><span>Independent creator / author of CodePilot</span>
    </div>
  </div>
  <div class="foot">
    <div>A talk on AI · organization · the individual</div>
    <div>— 2026 —</div>
  </div>
</section>
```

**Notes**:
- Use `hero dark` so most of the canvas shows the WebGL background.
- `h-hero` is the largest scale (10vw); use it for the main visual title.
- `min-height:80vh + align-content:center` vertically centers the content block.
- The `.chrome` doesn't need a page number on the cover — it stands alone.

---

## Layout 2: Act divider

```html
<section class="slide hero light">
  <div class="chrome">
    <div>Act One · The Hard Numbers</div>
    <div>Act I · 01 / 25</div>
  </div>
  <div class="frame" style="display:grid; gap:6vh; align-content:center; min-height:80vh">
    <div class="kicker">Act I</div>
    <h1 class="h-hero" style="font-size:8.5vw">Hard Numbers</h1>
    <p class="lead" style="max-width:55vw">
      Data first, methodology after.
    </p>
  </div>
  <div class="foot">
    <div>Act One opening</div>
    <div>— · —</div>
  </div>
</section>
```

**Notes**:
- Minimal — just kicker + big title + a one-line tagline.
- Alternate `hero light` and `hero dark` between act dividers to keep the rhythm.
- Tune `h-hero` (10vw → 8.5vw) to fit longer titles.

---

## Layout 3: Big numbers (data)

```html
<section class="slide light">
  <div class="chrome">
    <div>Past 64 days · Dev edition</div>
    <div>Act I / Dev · 02 / 25</div>
  </div>
  <div class="frame" style="padding-top:6vh">
    <div class="kicker">What one person built.</div>
    <h2 class="h-xl">Past 64 Days</h2>
    <p class="lead" style="margin-bottom:5vh">From zero to open-sourcing CodePilot.</p>

    <div class="grid-6" style="margin-top:6vh">
      <div class="stat-card">
        <div class="stat-label">Duration</div>
        <div class="stat-nb">64 <span class="stat-unit">days</span></div>
        <div class="stat-note">From zero to today</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Lines of Code</div>
        <div class="stat-nb">110K+</div>
        <div class="stat-note">Hand-written, line by line, to 110K+</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">GitHub Stars</div>
        <div class="stat-nb">5,166</div>
        <div class="stat-note">A single open-source repo</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Downloads</div>
        <div class="stat-nb">41K+</div>
        <div class="stat-note">Installed on tens of thousands of machines</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">AI Providers</div>
        <div class="stat-nb">19</div>
        <div class="stat-note">Cross-platform integrations</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Commits</div>
        <div class="stat-nb">608+</div>
        <div class="stat-note">No collaborators</div>
      </div>
    </div>
  </div>
  <div class="foot">
    <div>Project · CodePilot　|　github.com/codepilot</div>
    <div>Act I · Dev Numbers</div>
  </div>
</section>
```

**Notes**:
- 3×2 or 4×2 grids hold up best (see `.grid-6`).
- Each `stat-card` follows the same shape: label (small mono) → nb (huge number) → note (caption).
- Aim for 2–3 character numbers (longer overflows); use `K` / `M` shorthand.
- Leave 5vh+ above the grid so the title block claims attention first.

---

## Layout 4: Quote + image

```html
<section class="slide light">
  <div class="chrome">
    <div>Identity contrast · The Twist</div>
    <div>03 / 25</div>
  </div>
  <div class="frame grid-2-7-5" style="padding-top:6vh">
    <!-- Left column: title + body + callout. flex column makes the callout sit at the bottom. -->
    <div style="display:flex; flex-direction:column; justify-content:space-between; gap:3vh">
      <div>
        <div class="kicker">BUT</div>
        <h2 class="h-xl" style="white-space:nowrap; font-size:7.2vw">
          I'm not a programmer.
        </h2>
        <p class="lead" style="margin-top:3vh">
          Haven't written a line of code since college. The last decade was UI design and AI-driven visual effects.
        </p>
      </div>
      <div class="callout">
        "Three years ago,<br>
        this would have taken a ten-person team a year."
        <div class="callout-src">— an observer</div>
      </div>
    </div>
    <!-- Right column: image with a standard 16/10 ratio + max-height. Don't add align-self:end. -->
    <figure class="frame-img" style="aspect-ratio:16/10; max-height:56vh">
      <img src="images/codepilot.png" alt="CodePilot product screenshot">
      <figcaption class="img-cap">CodePilot · Product screenshot</figcaption>
    </figure>
  </div>
  <div class="foot">
    <div>Page 03 · I'm not a programmer</div>
    <div>— · —</div>
  </div>
</section>
```

**Notes**:
- Use `grid-2-7-5` (left 7, right 5). `align-items:start` is already set on the template.
- The **left column** is a flex column with `justify-content:space-between`: title pinned to the top, callout drops to the bottom.
- The **right column** image **does not get `align-self:end`** — that drops it to the bottom of the cell, where the browser chrome covers it on low-res screens.
- Image must use a **standard 16/10 or 4/3 ratio + `max-height:56vh`**, never odd source ratios like `2592/1798`.

---

## Layout 5: Image grid (multi-image comparison)

```html
<section class="slide light">
  <div class="chrome">
    <div>Audience proof</div>
    <div>Act I / Ops · 05 / 27</div>
  </div>
  <div class="frame" style="padding-top:5vh">
    <div class="kicker">Proof · Audience evidence</div>
    <h2 class="h-xl">10 platforms · 6 screenshots</h2>

    <div class="grid-3-3" style="margin-top:4vh">
      <figure class="frame-img" style="height:26vh">
        <img src="images/weibo.png" alt="Weibo 289K">
        <figcaption class="img-cap">Weibo · 289K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh">
        <img src="images/twitter.png" alt="Twitter 137K">
        <figcaption class="img-cap">Twitter · 137K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh">
        <img src="images/wechat.png" alt="WeChat Channel 96K">
        <figcaption class="img-cap">WeChat · 96K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh">
        <img src="images/jike.png" alt="Jike 26K">
        <figcaption class="img-cap">Jike · 26K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh">
        <img src="images/xhs.png" alt="Xiaohongshu 19K">
        <figcaption class="img-cap">Xiaohongshu · 19K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh">
        <img src="images/douyin.png" alt="Douyin 10K">
        <figcaption class="img-cap">Douyin · 10K</figcaption>
      </figure>
    </div>
  </div>
  <div class="foot">
    <div>Snapshot date · 2026.04</div>
    <div>Page 05 · Audience proof</div>
  </div>
</section>
```

**Notes**:
- Critical: every `frame-img` must pin a `height:NNvh` (no `aspect-ratio`), or the grid blows out.
- Images use `object-fit:cover + object-position:top` automatically, so only the bottom is cropped.
- Wrap them in `.grid-3-3` (3×2) or `.grid-3` (3×1).

---

## Layout 6: Pipeline (two-row workflow)

```html
<section class="slide light">
  <div class="chrome">
    <div>My workflow</div>
    <div>Act II · 15 / 27</div>
  </div>
  <div class="frame">
    <div class="kicker">Pipeline</div>
    <h2 class="h-xl">Two pipelines</h2>

    <!-- Section 1: text pipeline -->
    <div class="pipeline-section">
      <div class="pipeline-label">Text Pipeline</div>
      <div class="pipeline">
        <div class="step">
          <div class="step-nb">01</div>
          <div class="step-title">Draft</div>
          <div class="step-desc">AI drafts the first cut</div>
        </div>
        <div class="step">
          <div class="step-nb">02</div>
          <div class="step-title">Polish</div>
          <div class="step-desc">AI removes the AI smell</div>
        </div>
        <div class="step">
          <div class="step-nb">03</div>
          <div class="step-title">Morph</div>
          <div class="step-desc">AI reshapes for Twitter / Xiaohongshu</div>
        </div>
        <div class="step">
          <div class="step-nb">04</div>
          <div class="step-title">Illustrate</div>
          <div class="step-desc">AI generates infographics</div>
        </div>
        <div class="step">
          <div class="step-nb">05</div>
          <div class="step-title">Distribute</div>
          <div class="step-desc">One-click distribution to 9 platforms</div>
        </div>
      </div>
    </div>

    <!-- Section 2: video pipeline -->
    <div class="pipeline-section">
      <div class="pipeline-label">Visual · Video Pipeline</div>
      <div class="pipeline">
        <div class="step">
          <div class="step-nb">06</div>
          <div class="step-title">Cut</div>
          <div class="step-desc">AI handles the edit</div>
        </div>
        <div class="step">
          <div class="step-nb">07</div>
          <div class="step-title">Wrap</div>
          <div class="step-desc">AI handles the package</div>
        </div>
        <div class="step">
          <div class="step-nb">08</div>
          <div class="step-title">Cover</div>
          <div class="step-desc">AI generates the cover</div>
        </div>
      </div>
    </div>
  </div>
  <div class="foot">
    <div>Page 15 · My content factory</div>
    <div>Workflow</div>
  </div>
</section>
```

**Notes**:
- Group with `.pipeline-section` and label each section with `.pipeline-label`.
- Sections are separated by 3.6vh of gap and a thin top divider (set in CSS).
- Each step is a fixed `nb → title → desc` block.
- Step count is flexible, but cap a row at five steps; extras go in a second pipeline section.

---

## Layout 7: Hero question

```html
<section class="slide hero dark">
  <div class="chrome">
    <div>A question for you</div>
    <div>24 / 27</div>
  </div>
  <div class="frame" style="display:grid; gap:8vh; align-content:center; min-height:80vh">
    <div class="kicker">The Question</div>
    <h1 class="h-hero" style="font-size:7vw; line-height:1.15">
      In your company,<br>
      which roles were never<br>
      meant to be done by humans?
    </h1>
    <p class="lead" style="max-width:50vw">
      This is not a tech question. It's an architecture question.
    </p>
  </div>
  <div class="foot">
    <div>Page 24 · The Question</div>
    <div>— · —</div>
  </div>
</section>
```

**Notes**:
- Hero pages benefit from whitespace; carry only one question.
- Tune `h-hero` font size to length (7vw works for three lines, 10vw for one).
- Use `<br>` to break by meaning, not at random.
- Optional: end with a single line of `lead` to crystallize the idea.

---

## Layout 8: Big quote (serif headline)

```html
<section class="slide light">
  <div class="chrome">
    <div>The Takeaway · Headline quote</div>
    <div>18 / 25</div>
  </div>
  <div class="frame" style="display:grid; gap:5vh; align-content:center; min-height:80vh">
    <div class="kicker">Quote</div>
    <blockquote style="font-family:var(--serif-zh); font-weight:700; font-size:5.8vw; line-height:1.2; letter-spacing:-.01em; max-width:72vw">
      "Without the handoff,<br>everyone builds."
    </blockquote>
    <p class="lead" style="max-width:55vw; opacity:.65">
      Without the handoff, everyone builds.<br>
      And that makes all the difference.
    </p>
    <div class="meta-row">
      <span>— Luke Wroblewski</span><span>·</span><span>2026.04.16</span>
    </div>
  </div>
  <div class="foot">
    <div>Page 18 · Headline quote</div>
    <div>— · —</div>
  </div>
</section>
```

**Notes**:
- Whitespace-heavy: just one big quote and an attribution.
- Style the `<blockquote>` inline at 5–6vw — don't reuse `h-hero` (that name is for page titles).
- Follow with the source-language version at `lead` opacity .65 to create hierarchy.
- Add `meta-row` with author · date.

---

## Layout 9: Before / after comparison

```html
<section class="slide light">
  <div class="chrome">
    <div>Old vs New · The Shift</div>
    <div>12 / 25</div>
  </div>
  <div class="frame" style="padding-top:5vh">
    <div class="kicker">Before / After · Paradigm shift</div>
    <h2 class="h-xl" style="margin-bottom:4vh">From handoff to co-build</h2>

    <div class="grid-2-6-6" style="gap:5vw 4vh">
      <!-- Left column: old -->
      <div style="padding:3vh 2vw; border-left:3px solid currentColor; opacity:.55">
        <div class="kicker" style="opacity:.9">Before · Old model</div>
        <h3 class="h-md" style="margin-top:2vh">Design → Build → Handoff</h3>
        <ul style="margin-top:3vh; padding-left:1.2em; display:flex; flex-direction:column; gap:1.4vh; font-family:var(--sans-zh); font-size:max(14px,1.1vw); line-height:1.55">
          <li>Designer mocks up in Figma</li>
          <li>Engineer reads files and translates pixels</li>
          <li>Repeated PR rounds for alignment</li>
          <li>Non-technical staff can't touch code</li>
        </ul>
      </div>
      <!-- Right column: new -->
      <div style="padding:3vh 2vw; border-left:3px solid currentColor">
        <div class="kicker" style="opacity:.9">After · New model</div>
        <h3 class="h-md" style="margin-top:2vh">Same tool · Parallel · Co-build</h3>
        <ul style="margin-top:3vh; padding-left:1.2em; display:flex; flex-direction:column; gap:1.4vh; font-family:var(--sans-zh); font-size:max(14px,1.1vw); line-height:1.55">
          <li>Three roles working on the same Intent</li>
          <li>agents.md as shared context</li>
          <li>Agents handle alignment, conflicts, motion</li>
          <li>Anyone can contribute code safely</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="foot">
    <div>Page 12 · Paradigm shift</div>
    <div>Before / After</div>
  </div>
</section>
```

**Notes**:
- Use `.grid-2-6-6` (1:1) to split left and right.
- Drop the left column to `opacity:.55` to fade out "the old"; keep the right column at full brightness for "the new."
- Both columns get `border-left:3px solid` + `padding-left` for a quote-block feel.
- Same shape on both sides — `kicker` → `h-md` → `<ul>` — keeps the rhythm.

---

## Layout 10: Lead image + side text

```html
<section class="slide light">
  <div class="chrome">
    <div>Design First</div>
    <div>08 / 16</div>
  </div>
  <div class="frame grid-2-8-4" style="padding-top:6vh">
    <!-- Left column: long body + callout -->
    <div>
      <div class="kicker">Phase 01 · Design</div>
      <h2 class="h-xl" style="margin-top:1vh; margin-bottom:3vh">Design first · 2 weeks</h2>

      <p class="lead" style="margin-bottom:3vh">
        Visual exploration and design system in Figma — grids, typography, color tokens, reusable components, desktop and mobile mocks across rounds of feedback.
      </p>

      <p style="font-family:var(--sans-zh); font-size:max(14px,1.15vw); line-height:1.75; opacity:.78; margin-bottom:2.4vh">
        Within two weeks, the visual style, rough structure, and directional content all stabilize. A solid traditional design process — nothing new yet.
      </p>

      <div class="callout" style="margin-top:3vh">
        "This phase was pretty standard.<br>Just a solid Web design process."
        <div class="callout-src">— Luke Wroblewski</div>
      </div>
    </div>
    <!-- Right column: secondary image, vertical or square -->
    <figure class="frame-img" style="aspect-ratio:3/4; max-height:60vh">
      <img src="images/figma.png" alt="Figma design system">
      <figcaption class="img-cap">Figma · Design System</figcaption>
    </figure>
  </div>
  <div class="foot">
    <div>Page 08 · Design First</div>
    <div>~2 weeks</div>
  </div>
</section>
```

**Notes**:
- `.grid-2-8-4` (8:4) lets text dominate while keeping the image as a partner.
- The left column carries multiple layers: `kicker` → big title → lead → body paragraph → callout.
- Use a **vertical 3:4** or square 1:1 image so it doesn't compete with the text.
- Best fit for **information-dense pages** (unlike Layout 4, which carries one quote).

---

## Appendix: Common grid templates

| Class | Ratio | Use |
|---|---|---|
| `.grid-2-6-6` | 6:6 (1:1) | Even split |
| `.grid-2-7-5` | 7:5 | Text-led with a supporting image |
| `.grid-2-8-4` | 8:4 (2:1) | Long-form text + small image / data |
| `.grid-3` | 1:1:1 | Three parallel items (cases / screenshots) |
| `.grid-3-3` | 3×2 | Six-image matrix |
| `.grid-6` | 3×2 | Six stat cards |

Each grid reserves `gap: 3vw 4vh` (3vw horizontal, 4vh vertical) by default. Override per slide if needed.

---

## Pacing recommendations

A 25–30 page talk works well at this rhythm:

1. **Hero cover** (page 1)
2. **Act divider** (Act I opening, hero light or hero dark)
3. **Big numbers** (drop hard data for impact)
4. **Quote + image** (identity contrast / hook)
5. **Image grid** (evidence)
6. **Hero question** (close the act on tension)
7. ... Acts II and III follow the same rhythm ...
8. **Hero close** (final page — question or thanks)

Hero pages and non-hero pages should sit at roughly **1 : 2–3** — never more than three non-hero pages in a row, and never more than two hero pages in a row.
