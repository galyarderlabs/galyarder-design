# Page layout library

This document collects the ten most common page layout skeletons. Each one is a complete, paste-ready `<section class="slide ...">...</section>` block — drop your copy and images in.

---

## ⚠️ Pre-flight (read before generating)

### A. Class names must come from template.html

Every class used in `layouts.md` (`h-hero` / `h-xl` / `h-sub` / `h-md` / `lead` / `meta-row` / `stat-card` / `stat-label` / `stat-nb` / `stat-unit` / `stat-note` / `pipeline-section` / `pipeline-label` / `pipeline` / `step` / `step-nb` / `step-title` / `step-desc` / `grid-2-7-5` / `grid-2-6-6` / `grid-2-8-4` / `grid-3-3` / `grid-6` / `grid-3` / `grid-4` / `frame` / `frame-img` / `img-cap` / `callout` / `callout-src` / `kicker`) is predefined inside the `<style>` block of `assets/template.html`.

**Don't invent new class names.** If you must customize, write inline `style="..."`. If you're unsure whether a class exists before generating, grep `template.html` to confirm.

### B. Image aspect-ratio standards (very important)

**Always use standard ratios** — never copy oddities like `aspect-ratio: 2592/1798` from the source image:

| Scenario | Recommended ratio | Syntax |
|------|---------|------|
| Text + image hero shot | 16:10 or 4:3 | `aspect-ratio:16/10; max-height:54vh` |
| Image grid (multi-image compare) | uniform | **`height:26vh` fixed, no aspect-ratio** |
| Small image + text on the right | 1:1 or 3:2 | `aspect-ratio:1/1; max-width:40vw` |
| Full-screen hero visual | 16:9 | `aspect-ratio:16/9; max-height:64vh` |
| Mixed-media inline image | 3:2 | `aspect-ratio:3/2; max-width:30vw` |

Wrap every image in `<figure class="frame-img">`; the inner `<img>` automatically gets `object-fit:cover + object-position:top center`, which crops only the bottom and never the top, left, or right.

### C. Image positioning rules (avoid images dropping to the page bottom and being covered by the browser toolbar)

**Wrong patterns** (already burned, don't repeat):
- Using `align-self:end` outside a flex/grid container — it has no effect, so the image falls to the end of the document flow and stacks.
- Pinning the image with `position:absolute + bottom:0` — it gets covered by the bottom `.foot` and the `#nav` dots.
- Specifying only `height:N vh` on a single image without `max-height` — overflows the viewport on low-resolution screens.

**Right patterns**:
- Text + image layouts **must use `.frame.grid-2-7-5`** (or `.grid-2-6-6` / `.grid-2-8-4`) grid structures.
- Grid containers default to `align-items:start` (already set in the template), so the image naturally sticks to the top of the cell.
- To make the image visually align with the bottom of the left column callout: **give the left column flex column + `justify-content:space-between`** (so the callout itself drops to the bottom of the left column). **Leave the right column alone** — don't add `align-self:end`.
- Add inline `style="padding-top:6vh"` to every grid parent to give the heading area breathing room.

### D. Theme color and theme rhythm

- Pick one of the five theme presets in `references/themes.md`. No custom hex values.
- Theme rhythm (which of light / dark / hero light / hero dark each slide uses) follows hard rules in the "Theme rhythm planning" section below — read before generating.
- Decide both before picking layouts to avoid rework.

---

## 0. Common base structure (every slide shares this)

```html
<section class="slide [light|dark|hero light|hero dark]">
  <div class="chrome">
    <div>Context tag · sub-tag</div>
    <div>ACT · page / total</div>
  </div>
  <!-- main content -->
  <div class="foot">
    <div>Page caption · Page Description</div>
    <div>— · —</div>
  </div>
</section>
```

- Non-hero pages should add `light` or `dark` for theme; hero pages add `hero light` or `hero dark` (and join the WebGL theme blend).
- `chrome` and `foot` are optional but recommended four-corner metadata.
- **Hero pages are for chapter covers / openers / closers / transitions**; non-hero pages are for body content.

### ⚠️ Don't write the same thing in `chrome` and `kicker`

This is the most common copy-duplication issue. They live on totally different axes:

| Position | Role | Content character | Examples |
|------|------|---------|------|
| `.chrome` top-left | **Magazine page header / nav metadata** | Stable "section name" or "chapter" — can repeat across pages | "Act II · Workflow" / "Data · Result" / "lukew.com · 2026.04" |
| `.chrome` top-right | **Page number + act number** | Fixed format | "Act II · 15 / 25" |
| `.kicker` | **One-of-a-kind hook for this page** | A short prefix to the headline, like a magazine kicker — different on every page | "BUT" / "One person — what got built." / "Phase 01 · Design" |

**Bad example** (already burned): chrome reads "Design First", kicker reads "Phase 01 · Design phase" — same idea, instantly reads as AI-generated.

**Right approach**: chrome is a **section label** (stable, reusable across pages); kicker is **the page hook** (short, dramatic). They complement each other and never paraphrase one another.

### ⚠️ Theme rhythm planning (mandatory · do this before generating)

**Core mechanic**: every `<section>` must carry one of `light` / `dark` / `hero light` / `hero dark`. The JS infers theme from the class, decides whether to add `light-bg` to the body, and which of the two WebGL canvases sits on top. Missing the theme — or using a custom name — falls through to a broken default.

#### Default theme per layout

| Layout | Default theme | Why |
|---|---|---|
| 1. Cover | `hero dark` | Opening ceremony, dark = strong impact |
| 2. Act Divider | `hero dark` and `hero light` **must alternate** | Breathing rhythm |
| 3. Big Numbers | `light` | Numbers want a paper-white background; insert occasional `dark` if you have multiple acts |
| 4. Text + Image | **alternate `light` / `dark`** | Main rhythm of body copy |
| 5. Image Grid | `light` | Screenshots want a bright background |
| 6. Pipeline | `light` | Flowcharts must read clearly |
| 7. Hero Question | `hero dark` | Strong visual impact by default |
| 8. Big Quote | **`dark` first**, occasional `light` | Quotes feel ceremonial against dark |
| 9. Before/After | `light` | Two columns must read clearly |
| 10. Mixed Media | **alternate `light` / `dark`** | Rhythm |

#### Hard rhythm rules (grep-check after generation)

- ❌ **Never** run more than two consecutive pages of the same theme (light or dark).
- ❌ **Never** ship a deck of eight pages or more without at least one `hero dark` + one `hero light`.
- ❌ **Never** ship a deck that's all `light` body pages with no `dark` body pages — it reads flat and airless.
- ✅ **Recommended**: insert one hero (cover / divider / question / big quote) every three or four pages.

#### Eight-page rhythm template (drop-in)

| Page | Theme | Layout | Notes |
|---|---|---|---|
| 1 | `hero dark` | Cover | Opening |
| 2 | `light` | Big Numbers | Drop the data |
| 3 | `dark` | Text + Image | Contrast / story |
| 4 | `light` | Pipeline | Flow |
| 5 | `hero light` | Act Divider | Breath |
| 6 | `dark` | Text + Image or Big Quote | |
| 7 | `hero dark` | Hero Question | Suspense |
| 8 | `light` | Big Quote / Closer | Wrap-up |

**Sketch this table first, then write the slides.** Skipping the plan and pasting skeletons = everything ends up `light`.

---

## Layout 1: Hero Cover

```html
<section class="slide hero dark">
  <div class="chrome">
    <div>A Talk · 2026.04.22</div>
    <div>Vol.01</div>
  </div>
  <div class="frame" style="display:grid; gap:4vh; align-content:center; min-height:80vh">
    <div class="kicker">Private session · Li Jigang</div>
    <h1 class="h-hero">The One-Person Company</h1>
    <h2 class="h-sub">An organization folded by AI</h2>
    <p class="lead" style="max-width:60vw">
      One AI creator — 110,000 lines of code in 64 days, shipping consistently across nine platforms with everyday life essentially unchanged.
    </p>
    <div class="meta-row">
      <span>Guizang</span><span>·</span><span>Independent creator / Author of CodePilot</span>
    </div>
  </div>
  <div class="foot">
    <div>A talk on AI · organizations · the individual</div>
    <div>— 2026 —</div>
  </div>
</section>
```

**Key points**:
- `hero dark` lets the WebGL background bleed through most of the surface.
- `h-hero` is the largest heading size (10vw); used here as the cover statement.
- Use `min-height:80vh + align-content:center` to center vertically.
- No need for a page number in `.chrome` — the cover is its own thing.

---

## Layout 2: Act Divider

```html
<section class="slide hero light">
  <div class="chrome">
    <div>Act I · Hard Data</div>
    <div>Act I · 01 / 25</div>
  </div>
  <div class="frame" style="display:grid; gap:6vh; align-content:center; min-height:80vh">
    <div class="kicker">Act I</div>
    <h1 class="h-hero" style="font-size:8.5vw">Hard Data</h1>
    <p class="lead" style="max-width:55vw">
      Numbers first. Methods next.
    </p>
  </div>
  <div class="foot">
    <div>Act I opener</div>
    <div>— · —</div>
  </div>
</section>
```

**Key points**:
- Minimal: just kicker + giant headline + one lead line.
- Two act covers can alternate `hero light` / `hero dark` for rhythm.
- Tune `h-hero` between 10vw and 8.5vw to fit the title length.

---

## Layout 3: Big Numbers Grid

```html
<section class="slide light">
  <div class="chrome">
    <div>The last 64 days · Engineering</div>
    <div>Act I / Dev · 02 / 25</div>
  </div>
  <div class="frame" style="padding-top:6vh">
    <div class="kicker">One person — what got built.</div>
    <h2 class="h-xl">The last 64 days</h2>
    <p class="lead" style="margin-bottom:5vh">From zero to open-sourced CodePilot.</p>

    <div class="grid-6" style="margin-top:6vh">
      <div class="stat-card">
        <div class="stat-label">Duration</div>
        <div class="stat-nb">64 <span class="stat-unit">days</span></div>
        <div class="stat-note">From zero to today</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Lines of Code</div>
        <div class="stat-nb">110K+</div>
        <div class="stat-note">Hand-written line by line</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">GitHub Stars</div>
        <div class="stat-nb">5,166</div>
        <div class="stat-note">Single open-source repo</div>
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

**Key points**:
- 3×2 or 4×2 grids work most reliably (see `.grid-6`).
- Each `stat-card` has a fixed shape: label (small English) → nb (large numeric) → note (annotation).
- Keep numbers to two or three characters (longer numbers overflow); use `K` / `M` shorthand.
- Reserve at least 5vh of breathing room above for the heading area to grab attention first.

---

## Layout 4: Quote + Image

```html
<section class="slide light">
  <div class="chrome">
    <div>The Twist · Identity</div>
    <div>03 / 25</div>
  </div>
  <div class="frame grid-2-7-5" style="padding-top:6vh">
    <!-- Left column: heading + body + callout. flex column lets the callout drop to the bottom of the column. -->
    <div style="display:flex; flex-direction:column; justify-content:space-between; gap:3vh">
      <div>
        <div class="kicker">BUT</div>
        <h2 class="h-xl" style="white-space:nowrap; font-size:7.2vw">
          I'm not a programmer.
        </h2>
        <p class="lead" style="margin-top:3vh">
          I haven't written a line of code since college. The last decade was UI design and AI VFX.
        </p>
      </div>
      <div class="callout">
        "Three years ago this would have taken<br>
        a team of ten an entire year."
        <div class="callout-src">— An observer's verdict</div>
      </div>
    </div>
    <!-- Right column: image at standard 16/10 ratio + max-height; do NOT use align-self:end -->
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

**Key points**:
- Use `grid-2-7-5` (left 7 / right 5); `align-items:start` is preset in the template.
- **Left column** uses flex column + `justify-content:space-between`: heading sticks to the top, callout naturally drops to the bottom.
- **Right column image** **must not have `align-self:end`** — it would slide the image to the bottom of the cell, where the browser toolbar covers it on low-resolution screens.
- The image must use a **standard ratio (16/10 or 4/3) + `max-height:56vh`**, not raw weird ratios from the source image (`2592/1798` etc.).

---

## Layout 5: Image Grid (multi-image compare)

```html
<section class="slide light">
  <div class="chrome">
    <div>Platform proof</div>
    <div>Act I / Ops · 05 / 27</div>
  </div>
  <div class="frame" style="padding-top:5vh">
    <div class="kicker">Proof · Audience proof</div>
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
        <img src="images/wechat.png" alt="WeChat Official Account 96K">
        <figcaption class="img-cap">WeChat Official · 96K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh">
        <img src="images/jike.png" alt="Jike 26K">
        <figcaption class="img-cap">Jike · 26K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh">
        <img src="images/xhs.png" alt="RedNote 19K">
        <figcaption class="img-cap">RedNote · 19K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh">
        <img src="images/douyin.png" alt="Douyin 10K">
        <figcaption class="img-cap">Douyin · 10K</figcaption>
      </figure>
    </div>
  </div>
  <div class="foot">
    <div>Snapshot · 2026.04</div>
    <div>Page 05 · Audience proof</div>
  </div>
</section>
```

**Key points**:
- The key rule: every `frame-img` must have a fixed `height:NNvh` (no `aspect-ratio`), or the grid will break.
- Images automatically use `object-fit:cover + object-position:top` — only the bottom is cropped.
- Wrap with `.grid-3-3` (3×2) or `.grid-3` (3×1).

---

## Layout 6: Two-Pipeline (Pipeline)

```html
<section class="slide light">
  <div class="chrome">
    <div>My Workflow</div>
    <div>Act II · 15 / 27</div>
  </div>
  <div class="frame">
    <div class="kicker">Pipeline</div>
    <h2 class="h-xl">Two pipelines</h2>

    <!-- First group: text side -->
    <div class="pipeline-section">
      <div class="pipeline-label">Text Pipeline</div>
      <div class="pipeline">
        <div class="step">
          <div class="step-nb">01</div>
          <div class="step-title">Draft</div>
          <div class="step-desc">AI drafts the first version</div>
        </div>
        <div class="step">
          <div class="step-nb">02</div>
          <div class="step-title">Polish</div>
          <div class="step-desc">AI removes the AI tone</div>
        </div>
        <div class="step">
          <div class="step-nb">03</div>
          <div class="step-title">Morph</div>
          <div class="step-desc">AI reshapes for Twitter / RedNote</div>
        </div>
        <div class="step">
          <div class="step-nb">04</div>
          <div class="step-title">Illustrate</div>
          <div class="step-desc">AI generates infographics</div>
        </div>
        <div class="step">
          <div class="step-nb">05</div>
          <div class="step-title">Distribute</div>
          <div class="step-desc">One-click fan-out to 9 platforms</div>
        </div>
      </div>
    </div>

    <!-- Second group: video side -->
    <div class="pipeline-section">
      <div class="pipeline-label">Visual / Video Pipeline</div>
      <div class="pipeline">
        <div class="step">
          <div class="step-nb">06</div>
          <div class="step-title">Cut</div>
          <div class="step-desc">AI handles editing</div>
        </div>
        <div class="step">
          <div class="step-nb">07</div>
          <div class="step-title">Wrap</div>
          <div class="step-desc">AI handles packaging</div>
        </div>
        <div class="step">
          <div class="step-nb">08</div>
          <div class="step-title">Cover</div>
          <div class="step-desc">AI-generated cover art</div>
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

**Key points**:
- Use `.pipeline-section` to group steps with `.pipeline-label` as the group title.
- Two groups separated by 3.6vh of spacing + a thin divider on top (already preset in CSS).
- Every step is the fixed `nb → title → desc` shape.
- Step counts aren't capped, but five per row is the upper limit; spill into a second pipeline if you have more.

---

## Layout 7: Hero Question

```html
<section class="slide hero dark">
  <div class="chrome">
    <div>A question for you</div>
    <div>24 / 27</div>
  </div>
  <div class="frame" style="display:grid; gap:8vh; align-content:center; min-height:80vh">
    <div class="kicker">The Question</div>
    <h1 class="h-hero" style="font-size:7vw; line-height:1.15">
      Inside your company,<br>
      which roles never should<br>
      have been done by humans?
    </h1>
    <p class="lead" style="max-width:50vw">
      This isn't a tech question. It's an architecture question.
    </p>
  </div>
  <div class="foot">
    <div>Page 24 · The Question</div>
    <div>— · —</div>
  </div>
</section>
```

**Key points**:
- Hero pages: the more whitespace the better; just one question.
- Tune `h-hero` size based on length (7vw works for three lines, 10vw for one).
- Manual `<br>` to break at semantic boundaries.
- Optional tail line in `lead` to land the punchline.

---

## Layout 8: Big Quote (serif headline quote)

```html
<section class="slide light">
  <div class="chrome">
    <div>The Takeaway · Core quote</div>
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
    <div>Page 18 · Quote</div>
    <div>— · —</div>
  </div>
</section>
```

**Key points**:
- Whitespace-heavy page: just the big quote + attribution.
- Use inline style on `<blockquote>` to scale up (5–6vw); don't use `h-hero` (that's reserved for the page main heading).
- Follow with the original phrase or translation (lead · opacity:.65) for hierarchy.
- Pair with a `meta-row` for source · date.

---

## Layout 9: Side-by-side Compare (A vs B · Old vs New)

```html
<section class="slide light">
  <div class="chrome">
    <div>The Shift · Old vs New</div>
    <div>12 / 25</div>
  </div>
  <div class="frame" style="padding-top:5vh">
    <div class="kicker">Before / After · Paradigm shift</div>
    <h2 class="h-xl" style="margin-bottom:4vh">From handoff to co-build</h2>

    <div class="grid-2-6-6" style="gap:5vw 4vh">
      <!-- Left column: old -->
      <div style="padding:3vh 2vw; border-left:3px solid currentColor; opacity:.55">
        <div class="kicker" style="opacity:.9">Before · Old model</div>
        <h3 class="h-md" style="margin-top:2vh">Design → Engineering → Handoff</h3>
        <ul style="margin-top:3vh; padding-left:1.2em; display:flex; flex-direction:column; gap:1.4vh; font-family:var(--sans-zh); font-size:max(14px,1.1vw); line-height:1.55">
          <li>Designers chase the file in Figma</li>
          <li>Engineers translate the spec by hand</li>
          <li>Endless PR alignment</li>
          <li>Non-technical members can't touch code</li>
        </ul>
      </div>
      <!-- Right column: new -->
      <div style="padding:3vh 2vw; border-left:3px solid currentColor">
        <div class="kicker" style="opacity:.9">After · New model</div>
        <h3 class="h-md" style="margin-top:2vh">Same tools · parallel · co-built</h3>
        <ul style="margin-top:3vh; padding-left:1.2em; display:flex; flex-direction:column; gap:1.4vh; font-family:var(--sans-zh); font-size:max(14px,1.1vw); line-height:1.55">
          <li>Three roles working the Intent in parallel</li>
          <li>agents.md as the shared context</li>
          <li>Agents handle alignment / conflicts / animation</li>
          <li>Anyone can safely contribute code</li>
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

**Key points**:
- Use `.grid-2-6-6` (1:1) to split the page in half.
- Left column at `opacity:.55` to visually weaken "old"; right column at full opacity to emphasize "new."
- Both columns use `border-left:3px solid` + `padding-left` for a quote-block feel.
- The two columns share the same shape: `kicker` → `h-md` → `<ul>` bullets, so the rhythm matches.

---

## Layout 10: Mixed Media (Lead Image + Side Text)

```html
<section class="slide light">
  <div class="chrome">
    <div>Design First</div>
    <div>08 / 16</div>
  </div>
  <div class="frame grid-2-8-4" style="padding-top:6vh">
    <!-- Left column: long-form body + quote -->
    <div>
      <div class="kicker">Phase 01 · Design phase</div>
      <h2 class="h-xl" style="margin-top:1vh; margin-bottom:3vh">Design First · 2 weeks</h2>

      <p class="lead" style="margin-bottom:3vh">
        Visual exploration and design system in Figma — grids, typography, color variables, reusable components — desktop and mobile drafts iterated through several rounds of feedback.
      </p>

      <p style="font-family:var(--sans-zh); font-size:max(14px,1.15vw); line-height:1.75; opacity:.78; margin-bottom:2.4vh">
        Within two weeks the visual style, rough structure, and directional content are all stable. This is solid traditional design work — nothing exotic here.
      </p>

      <div class="callout" style="margin-top:3vh">
        "This phase was pretty standard.<br>Just a solid Web design process."
        <div class="callout-src">— Luke Wroblewski</div>
      </div>
    </div>
    <!-- Right column: support image · vertical or square -->
    <figure class="frame-img" style="aspect-ratio:3/4; max-height:60vh">
      <img src="images/figma.png" alt="Figma design system">
      <figcaption class="img-cap">Figma · Design System</figcaption>
    </figure>
  </div>
  <div class="foot">
    <div>Page 08 · Design First</div>
    <div>About 2 weeks</div>
  </div>
</section>
```

**Key points**:
- `.grid-2-8-4` (8:4) lets body copy lead and the image play support.
- Left column carries multiple information layers: kicker → big headline → lead → body paragraph → callout (quote).
- Right column uses a **vertical 3:4 or square 1:1** image so it doesn't compete with the text.
- This layout fits **information-heavy pages** (unlike Layout 4, which carries only one quote).

---

## Appendix: common grid presets

| Class | Ratio | Use |
|---|---|---|
| `.grid-2-6-6` | 6:6 (1:1) | Split in half |
| `.grid-2-7-5` | 7:5 | Text-led + supporting image |
| `.grid-2-8-4` | 8:4 (2:1) | Long body + small image / data |
| `.grid-3` | 1:1:1 | Three side-by-side (cases / screenshots) |
| `.grid-3-3` | 3×2 | Six-image matrix |
| `.grid-6` | 3×2 | Six data cards |

Every grid reserves `gap: 3vw 4vh` (3vw horizontal, 4vh vertical) and can be overridden individually.

---

## Pacing recommendations

A 25–30 page talk recommends this rhythm:

1. **Hero Cover** (page 1)
2. **Act Divider** (Act I opener, hero light or hero dark)
3. **Big Numbers** (drop the hard data for impact)
4. **Quote + Image** (identity twist / hook)
5. **Image Grid** (proof)
6. **Hero Question** (act closer, suspense)
7. ... repeat the rhythm for Act II, Act III ...
8. **Hero Close** (final page, question or thanks)

Hero and non-hero pages should alternate roughly **2–3 : 1** — never run more than three non-hero pages in a row, and never more than two hero pages in a row.
