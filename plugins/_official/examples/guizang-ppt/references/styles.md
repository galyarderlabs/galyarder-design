# Magazine Directions

Five preset directions. Each one bundles a recommended theme color, a curated set of layouts, a target slide count, and chrome copy conventions — so a single decision in this file answers half of the clarifying questions in the next step.

> Inspiration: [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) and its "20 design philosophies × 5 streams" framing — compressed here into 5 magazine-flavored directions, each mapped onto a palette in `themes.md` and a subset of the layouts in `layouts.md`.

---

## When to use this file

At the start of `Step 1 · Clarification` in SKILL.md, **have the user pick one of the five directions before asking about theme color, length, audience, and outline**. The flow is:

```
1. User says something like "I want to put together a talk deck."
2. You (the agent) introduce the 5 directions (use the one-line summaries below).
3. User picks one (or says "not sure, recommend one").
4. The chosen direction answers "theme color" and "slide count"; you ask the remaining 4 questions.
```

**Hard rule**: pick exactly one of the five directions — do not blend them. Mixing equals walking the failure path huashu-design already validated (Brand Asset Protocol v1). If none of the five fit, gently steer the user to the closest one and allow light tonal customization in `chrome` / `kicker` only — **never adjust the palette**.

---

## 1. Monocle Editorial — international magazine ✦ default recommendation

**Keywords**: restraint, intellectual feel, cosmopolitan, taste.

| Recipe | Choice |
|---|---|
| Theme | Ink Classic |
| Slide count | 18–24 (60% non-hero / 40% hero) |
| Primary layouts | **1 cover / 2 act divider / 4 quote + image / 8 big quote / 10 lead image + side text** |
| Chrome copy | `Vol.04 · Spring 2026` / `Act II · 12 / 24` / `lukew.com · 2026.04` |
| Kicker style | Short English with a center dot: `THE TWIST` / `BUT` / `DEC.` |
| Foot copy | `Page 12 · A New Way of Working` |

**Best for**: business launches, in-industry talks, product announcements, personal-brand thought-leadership. **Pick this by default** — it's the lowest-risk option.

**Avoid for**: deeply technical reports (information density too low), table-heavy ops retrospectives (no fitting layout).

**Visual anchors**: *Monocle*, *Apricot Magazine*, *A Book Apart*, *Apartamento*.

---

## 2. WIRED Tech — data + engineering

**Keywords**: hard data, pipelines, comparisons, future-leaning.

| Recipe | Choice |
|---|---|
| Theme | Indigo Porcelain |
| Slide count | 14–18 (lean and data-dense) |
| Primary layouts | **1 cover / 3 big numbers / 6 pipeline / 7 hero question / 9 before / after** |
| Chrome copy | `Q2 / 2026 · Field Report` / `Data · 03` / `Eng Notes` |
| Kicker style | All caps with numbers: `38× FASTER` / `RUNTIME 04` / `CASE 02` |
| Foot copy | `Page 03 · benchmark` / `methodology footnote` |

**Best for**: tech launches, research talks, benchmark reports, internal engineering communication, AI demo days.

**Avoid for**: humanities-flavored quote talks (too cold), art brands (lacks warmth).

**Visual anchors**: *WIRED* longform, *MIT Technology Review*, *The Pudding*, Stripe Press.

**Tip**: keep `stat-label` in monospace English (this is the heart of the WIRED look). Skip thousand separators in numbers (not engineering enough); use `K` / `M` / `×` shorthand.

---

## 3. Kinfolk Slow — slow living / humanities

**Keywords**: whitespace, serif, warmth, intimate gathering.

| Recipe | Choice |
|---|---|
| Theme | Kraft Paper |
| Slide count | 9–12 (slow, low density, lots of room to breathe) |
| Primary layouts | **1 cover / 4 quote + image / 8 big quote / 10 lead image + side text / 2 act divider** |
| Chrome copy | `Vol.07 · Autumn` / `A Letter · 03` / `Notes from Kyoto` |
| Kicker style | Short phrases with punctuation: "For a friend." / "Late autumn." / "Letter Three" |
| Foot copy | `Page 03 · Letter Three` / `2026 · Spring Issue` |

**Best for**: intimate gatherings, book talks, post-interview reflections, lifestyle brands, personal essays.

**Avoid for**: product launches (too slow), tech talks (too soft), serious data work (not enough density).

**Visual anchors**: *Kinfolk*, *The Gentlewoman*, *Cereal*, *Drift Magazine*.

**Tips**:
- Deliberately keep the slide count under 10 — Kinfolk's core is "less is more". Don't fill the deck.
- Lean heavily on Layout 8 (big quote) and Layout 10 (lead image + side text).
- Avoid Layout 3 (big numbers) — it clashes with the mood.
- Use serif type and short phrasing for the `<title>`, section names, and kickers.

---

## 4. Domus Architectural — architecture / spatial

**Keywords**: scale, geometry, asymmetry, restrained confidence.

| Recipe | Choice |
|---|---|
| Theme | Dune |
| Slide count | 12–18 (medium density, strong visuals) |
| Primary layouts | **1 cover / 2 act divider / 5 image grid / 9 before / after / 10 lead image + side text** |
| Chrome copy | `Spazio 09 · Project File` / `Plan · 03` / `Fig.4` |
| Kicker style | Numbers + categories: `PROJECT 04` / `SECTION B` / `FIGURE 12` |
| Foot copy | `Page 09 · West Wing` / `1:200 scale` |

**Best for**: design / architecture case studies, product design reviews, brand visual launches, gallery-style portfolios.

**Avoid for**: quote-driven talks (too sharp), deep technical dives (pipelines are not the strength here).

**Visual anchors**: *Domus*, *Apartamento*, *Mark Magazine*, *Pin-Up*.

**Tips**:
- Leave roughly 60% of every hero slide empty — the architectural feel comes from the air.
- Use Layout 5 (image grid) generously, but with **4 large images, not 6 small ones**.
- Keep `chrome` copy cold: English plus numbers only.

---

## 5. Lab / Reference — academic + craft manual

**Keywords**: restrained, charts and figures, reproducible, engineer-friendly.

| Recipe | Choice |
|---|---|
| Theme | Forest Ink |
| Slide count | 16–24 (high density, charts and figures) |
| Primary layouts | **1 cover / 2 act divider / 3 big numbers / 6 pipeline / 9 before / after** |
| Chrome copy | `Field Notes · Vol.II` / `Section 3.2 · Method` / `Reference 04` |
| Kicker style | Numbered: `§ 3.2` / `Ref. 04` / `Method 01` |
| Foot copy | `Page 12 · 3.2 Calibration` / `appendix A` |

**Best for**: academic talks, internal research retrospectives, sustainability and nature themes, long-running product retrospectives, methodology-heavy craft talks (coffee / fragrance / tea).

**Avoid for**: business launches (too clinical), marketing campaigns (not catchy enough).

**Visual anchors**: vintage *National Geographic*, *Hand-Eye Magazine*, *Nautilus*, MIT Press book layouts.

**Tips**:
- Use `meta-row` liberally to label sources, methods, and references.
- Apply `<figcaption class="img-cap">` more often than other directions to number every figure.
- Use `§` section numbers in `kicker`, not exclamatory phrases.

---

## Quick lookup (intent → direction)

| What the user said | Recommended direction |
|---|---|
| "Generic talk" / "not sure" | **1. Monocle** |
| "Solo company / AI folding orgs / startup demo day" | **1. Monocle** (default) or **2. WIRED** if technical |
| "AI / benchmarks / model evaluations" | **2. WIRED** |
| "Product launch / engineering team talk" | **2. WIRED** |
| "Book talk / interview reflection / one person's story" | **3. Kinfolk** |
| "Intimate gathering / talk among friends / weekend chat" | **3. Kinfolk** |
| "Design case study / brand launch / portfolio review" | **4. Domus** |
| "Architecture / space / installation" | **4. Domus** |
| "Academic / research / methodology / tutorial" | **5. Lab** |
| "Sustainability / environment / nature theme" | **5. Lab** |

---

## Decision record (do this before generating)

After picking a direction, **create or update `project-log.md`** (or `outline-v1.md`) in the project directory and start with:

```markdown
# [Talk Title] · Project Log

- Direction: **Monocle Editorial** (from `references/styles.md`)
- Theme: Ink Classic
- Audience: internal team (product + design)
- Length: 25 min · ~18 slides
- Chrome style: Vol.04 / Act II / 12 of 18
- Kicker style: short English with center dot
```

Update this section every time the direction shifts. **Don't change directions mid-deck** — the tonal gap between any two directions is bigger than it looks, and mixing them tears the deck apart.

---

## Don't

- Don't blend layout choices across directions (e.g., Monocle plus Kinfolk-style chrome plus Layout 6 pipeline-heavy pages) — the result reads as noise.
- Don't invent a sixth direction ("how about tech + literary?") — politely steer the user to the nearest fit and explain that historical mixes have a very high failure rate.
- Don't switch directions mid-deck (e.g., on slide 8 you decide Kinfolk would be better) — slides 1–7 are now wasted; either redo them all or commit to the original direction.
- Don't spend time on layouts that don't belong to the chosen direction (e.g., four Layout 6 pipeline slides inside a Kinfolk deck) — that's a signal you picked the wrong direction.

## Do

- Stick to the five directions, and let the chosen direction answer the other clarifying questions for you.
- Pin the direction in the first line of `project-log.md` and keep it there until the deck ships.
- Let the chrome / kicker / foot trio carry half the direction's identity — that copy is a meaningful share of the visual signal.
- When in doubt, **default to Monocle Editorial** — it has the lowest failure rate of the five.
