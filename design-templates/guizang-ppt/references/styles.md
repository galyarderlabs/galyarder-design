# Magazine directions

Five **preset directions**, each bundling "which theme color / which layouts / how many slides / how to write chrome copy" — so you don't have to spit out five unrelated options during the six-question clarification.

> Inspired by [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design)'s "20 design philosophies × 5 streams." We've compressed that down to five magazine-flavored directions, each tied to a specific set in `themes.md` plus a combination from `layouts.md`.

---

## When to read this file

At the start of `Step 1 · Clarify requirements` in SKILL.md: **first ask the user to pick one of the five directions below**, then move on to theme color, duration, audience, and outline. The flow is:

```
1. The user says "I want to make a talk deck."
2. You (the agent) introduce the five directions (paste the one-line summary below).
3. The user picks one (or says "not sure, you recommend").
4. With the chosen direction you can answer "theme color" and "slide count" yourself, then ask the remaining four questions.
```

**Hard rule**: pick from these five only — no mixing. Mixing repeats the failure path huashu-design already validated (brand asset protocol v1). If none of the five satisfies the user, gently steer them toward the closest one and allow tonal tweaks in `chrome` / `kicker` only — **never recolor**.

---

## 1. Monocle Editorial · International magazine ✦ default recommendation

**Keywords**: restrained, knowledgeable, cosmopolitan, in good *taste*.

| Recipe | Choice |
|---|---|
| Theme | 🖋 Ink Classic |
| Recommended slide count | 18–24 (60% non-hero / 40% hero) |
| Primary layouts | **1 Cover / 2 Act Divider / 4 Text + Image / 8 Big Quote / 10 Mixed Media** |
| Chrome copy | `Vol.04 · Spring 2026` / `Act II · 12 / 24` / `lukew.com · 2026.04` |
| Kicker style | Short English + middle dot: `THE TWIST` / `BUT` / `DEC.` |
| Foot copy | `Page 12 · A new way of working` |

**Best for**: business launches, internal industry talks, product announcements, personal brand sessions. **The safe default** — hard to go wrong.

**Avoid for**: deep technical reports (density too low), heavy ops retrospectives with lots of tabular data (no matching layout).

**Visual anchors**: *Monocle* / *Apricot Magazine* / *A Book Apart* / *Apartamento*.

---

## 2. WIRED Tech · Data + engineering

**Keywords**: hard data, pipelines, comparisons, future-facing.

| Recipe | Choice |
|---|---|
| Theme | 🌊 Indigo Porcelain |
| Recommended slide count | 14–18 (light, data-dense) |
| Primary layouts | **1 Cover / 3 Big Numbers / 6 Pipeline / 7 Hero Question / 9 Before/After** |
| Chrome copy | `Q2 / 2026 · Field Report` / `Data · 03` / `Eng Notes` |
| Kicker style | Uppercase + numbers: `38× FASTER` / `RUNTIME 04` / `CASE 02` |
| Foot copy | `Page 03 · benchmark` / `methodology footnote` |

**Best for**: technical launches, research talks, benchmark reports, internal engineering communication, AI product demo days.

**Avoid for**: humanities / quote-driven talks (too cold), art and lifestyle brands (not enough warmth).

**Visual anchors**: *WIRED* feature spreads / *MIT Technology Review* / *The Pudding* / *Stripe Press*.

**Special tips**: every `stat-label` uses an English monospace label (this is core to the WIRED look); skip thousand-separator commas (not engineer-flavored) and prefer `K` / `M` / `×` shorthand.

---

## 3. Kinfolk Slow · Slow living / humanities

**Keywords**: whitespace, serif, warmth, private gatherings.

| Recipe | Choice |
|---|---|
| Theme | 🍂 Kraft Paper |
| Recommended slide count | 9–12 (slow, contemplative, low density) |
| Primary layouts | **1 Cover / 4 Text + Image / 8 Big Quote / 10 Mixed Media / 2 Act Divider** |
| Chrome copy | `Vol.07 · Autumn` / `A Letter · 03` / `Notes from Kyoto` |
| Kicker style | Short phrases with punctuation: "For a friend." / "Late autumn." / "Letter Three" |
| Foot copy | `Page 03 · Letter Three` / `2026 · Spring Issue` |

**Best for**: private sessions, book talks, post-interview reflections, lifestyle brands, personal essays.

**Avoid for**: product launches (too slow), tech talks (too soft), serious data work (information density too low).

**Visual anchors**: *Kinfolk* / *The Gentlewoman* / *Cereal* / *Drift Magazine*.

**Special tips**:
- **Deliberately keep slide count under ten** — Kinfolk is "less is more"; do not pad.
- Lean heavily on Layout 8 (Big Quote) and Layout 10 (Mixed Media).
- Skip Layout 3 (Big Numbers) — it clashes with the tone.
- `<title>` text, section names, and kickers should all be serif and short.

---

## 4. Domus Architectural · Architecture / spatial

**Keywords**: scale, geometry, asymmetry, restrained showmanship.

| Recipe | Choice |
|---|---|
| Theme | 🌙 Dune |
| Recommended slide count | 12–18 (medium density, strong visuals) |
| Primary layouts | **1 Cover / 2 Act Divider / 5 Image Grid / 9 Before/After / 10 Mixed Media** |
| Chrome copy | `Spazio 09 · Project File` / `Plan · 03` / `Fig.4` |
| Kicker style | Number + category: `PROJECT 04` / `SECTION B` / `FIGURE 12` |
| Foot copy | `Page 09 · West Wing` / `1:200 scale` |

**Best for**: design / architecture case studies, product design reviews, brand visual launches, gallery-style portfolio walks.

**Avoid for**: quote-driven talks (too rigid), technical deep dives (poor pipeline support).

**Visual anchors**: *Domus* / *Apartamento* / *Mark Magazine* / *Pin-Up*.

**Special tips**:
- **Every hero page should be 60% empty** — leave breathing room; the architectural feel comes from negative space.
- Use Layout 5 (Image Grid) often, but only with **four large images**, not six small ones.
- Keep `chrome` copy cool — English and numerals only.

---

## 5. Lab / Reference · Academic + craft manual

**Keywords**: restrained, charts and tables, reproducible, engineer-friendly.

| Recipe | Choice |
|---|---|
| Theme | 🌿 Forest Ink |
| Recommended slide count | 16–24 (high density, with charts) |
| Primary layouts | **1 Cover / 2 Act Divider / 3 Big Numbers / 6 Pipeline / 9 Before/After** |
| Chrome copy | `Field Notes · Vol.II` / `Section 3.2 · Method` / `Reference 04` |
| Kicker style | Section numbers: `§ 3.2` / `Ref. 04` / `Method 01` |
| Foot copy | `Page 12 · 3.2 Calibration` / `appendix A` |

**Best for**: academic talks, internal research retrospectives, sustainability / nature topics, long-running product retrospectives, methodology-heavy craft talks (coffee / fragrance / tea).

**Avoid for**: business launches (too restrained), marketing events (not catchy enough).

**Visual anchors**: *National Geographic* (vintage) / *Hand-Eye Magazine* / *Nautilus* / MIT Press book layouts.

**Special tips**:
- Use `meta-row` extensively for source / method / citation labels.
- Use `<figcaption class="img-cap">` to number every image **more aggressively than other directions**.
- `kicker` uses § section numbers, not exclamation phrases.

---

## Quick-pick cheat sheet (map user intent to a direction)

| If the user says... | Recommend |
|---|---|
| "Generic talk" / "I'm not sure" | **1. Monocle** |
| "One-person company / AI folding / startup demo day" | **1. Monocle** (default) or **2. WIRED** if more technical |
| "AI / benchmark / model evaluation" | **2. WIRED** |
| "Product launch / internal engineering talk" | **2. WIRED** |
| "Book talk / interview / one person's story" | **3. Kinfolk** |
| "Private session / gathering with friends / weekend chat" | **3. Kinfolk** |
| "Design case / brand launch / portfolio walk" | **4. Domus** |
| "Architecture / space / installation" | **4. Domus** |
| "Academic / research / methodology / tutorial" | **5. Lab** |
| "Sustainability / environmental / nature topic" | **5. Lab** |

---

## Decision record (do this before generation)

After picking a direction, **create or update `project-record.md`** (or `outline-v1.md`) in the project directory. The first lines should make it explicit:

```markdown
# [Talk Title] · Project record

- Direction: **Monocle Editorial** (from `references/styles.md`)
- Theme: 🖋 Ink Classic
- Audience: Internal team (product + design)
- Duration: 25 min · ~18 slides
- Chrome style: Vol.04 / Act II / 12 of 18
- Kicker style: short English + middle dot
```

Update this section every time you change direction. **Do not switch direction mid-stream** — the gap in tone between any two directions is bigger than it looks; mixing tears the deck apart.

---

## ❌ Don't

- ❌ Mixing layouts across directions (e.g. Monocle + several Layout 6 pipeline pages with Kinfolk-style chrome) — chaotic.
- ❌ Inventing a sixth direction ("I want a 'tech + literary' style") — politely steer them to the closest match and warn that mixing has historically failed.
- ❌ Switching direction mid-deck (page 8 suddenly thinks Kinfolk would be better) — the first seven pages are now wasted; either redo from scratch or stay the course.
- ❌ Spending time on layouts the chosen direction doesn't favor (e.g. four Layout 6 Pipeline pages in Kinfolk) — that's a signal you've picked the wrong direction.

## ✅ Do

- ✅ Pick from the five only; use the chosen direction to answer the other clarifying questions.
- ✅ Lock the direction in line one of `project-record.md` and never change it.
- ✅ Let chrome / kicker / foot speak for the direction — they carry half the recognizability.
- ✅ When in doubt, **default to Monocle Editorial** — it has the lowest failure rate of the five.
