---
name: deck-swiss-international
emoji: "🟦"
description: "16-column grid + single saturated accent + 22 locked layouts (Klein Blue, Lemon, Mint, Safety Orange)"
category: slides
scenario: marketing
featured: 1
recommended: 1
tags: ["swiss", "grid", "international", "ikb", "editorial", "facts"]
example_id: sample-swiss-international
example_format: markdown
example_source_url: "https://github.com/op7418/guizang-ppt-skill"
example_source_label: "op7418/guizang-ppt-skill"
od:
  mode: deck
  surface: web
  scenario: marketing
  featured: 0.001
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "Swiss Internationalism Deck" template to turn my content into "16-column grid + single saturated accent + 22 locked layouts (Klein Blue, Lemon, Mint, Safety Orange)". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Swiss Internationalism Deck (Swiss International)]
【Intent] Facts, product, analysis, methodological expression. Extremely calm, rational, academic, without any hand-drawn elements / noise / decorations. Inspired by op7418/guizang-ppt-skill Style B.

[Theme] **Must choose one of the following 4 options; no mixing, no hex modification**:
- 🔵 **Klein Blue (IKB)** — accent `#002FA7`, paper `#fafaf8`, ink `#0a0a0a`. Business / AI / Design scenes.
- 🟡 **Lemon Yellow** — accent `#FFD500`, paper `#f7f5ee` (light cream), ink `#0a0a0a`. Youth / Retail / Sports. Text must be black (not white).
- 🟢 **Lemon Green / Neon** — accent `#C5E803`, paper `#f7f5ee`, ink `#0a0a0a`. Sustainable / Tech Startup / Gen-Z Brand. Text must be black.
- 🟠 **Safety Orange** — accent `#FF6B35`, paper `#f7f5ee`, ink `#0a0a0a`. Industrial / Automotive / Emergency Alerts. Text uses white + bold ≥ 600.

【Layout — 22 reusable layout pools, do not add or modify layouts; **quantity is determined by content**, completely covering all [User Content] (short content starting at 6-10 cards, long content should far exceed this range, the same layout can be repeated in different chapters)]
- **S01 Cover** — Full screen accent + ASCII pulsing dot matrix + inverted title + metadata chrome (date / № / topic).
- **S02 Vertical Timeline** — Left dashed axis + dots; Right node = Year + KPI + Description.
- **S03 Statement** — 9.6vw Centered giant text + left large blank space + bottom hairline + annotation.
- **S04 Six Cells** — 2×3 grid, each cell: icon + number + short title + single-line description.
- **S05 Three Sub-cards** — Left hero Title + Right 3 horizontally stacked gray cards.
- **S06 KPI Tower** — 4-column rising blue bars; icon at the top; large metric + label at the base.
- **S07 H-Bar Chart** — horizontal ranking bars, where width reflects the metric, labeled with numbers at the end.
- **S08 Duo Compare** — vertical divider; Before on the left / After on the right.
- **S09 Closing Manifesto** — Left IKB block + ASCII dot matrix + manifesto; right white background + 3 key points.
- **S10 Dot Matrix Statement** — Centered manifesto + corner geometric dot matrix / circular matrix.
- **S11 Horizontal Timeline** — Top headline, middle hairline axis, equidistant nodes, step names below nodes.
- **S12 Manifesto + Ink Banner** — Top half headline + explanation; bottom half full-width black banner + inverted small text.
- **S13 Three Forces Cards** — Left ink hero block; right 3 gray cards, each card: large number + text.
- **S14 Loop Diagram** — numbered steps on the left; SVG concentric rings on the right; "LOOP" label in the center.
- **S15 Image Matrix + Hero Stat** — 4×3 equal height cards (12 items) + Bottom summary large numbers + tags.
- **S16 Multi-card Brief** — 3×2 micro cards; main body at top-left, footnotes at bottom-right, single card accent highlighted.
- **S17 System Diagram** — Left headline + 3 paragraphs of description; right SVG three concentric circles + external labels.
- **S18 Why Now** — 3 columns, each column: category label + headline + description + Bottom number (last column is accent).
- **S19 Four Cards** — Top accent hairline + headline + 4 equal width cards (metadata / title / body).
- **S20 Stacked KPI Ledger** — Vertical rows + hairline; left large number / middle label / right icon.
- **S21 Tech Spec Sheet** — Left title block / middle 3 KPI hairlines / right growing columns / bottom data.
- **S22 Image Hero** — Top 60% full width image + white title block overlay; bottom 40% explanation + 3 columns KPI.

【Design Details — Absolute ironclad rules]
- **Right angles only**: strictly `border-radius: 0` throughout. Rounded corners = instant violation.
- **1px hairline borders**, black or accent; shadows, gradients, and blurs are strictly forbidden.
- **16-Column Grid**: `grid-template-columns: repeat(16, 1fr); gap: 0`.
- **Fonts**: Inter Tight (Latin display) / Inter (body) / Noto Sans SC (Chinese) / JetBrains Mono (data); serif and decorative fonts are strictly prohibited.
- **Extreme size contrast**: cover uses 9.6vw display, body 14-16px, label 11px uppercase letterspacing 0.08em.
- **Keyboard ← / → navigation + hash synchronization**; fixed badges: `№N/N` bottom-right, topic tag bottom-left.
- **Do not fabricate**: metrics must be sourced from user input; chart bar heights = actual proportional data.
- Output single-file HTML, do not use any external image URLs; decorative geometry (ASCII matrices / concentric circles) should use pure CSS or inline SVGs.
