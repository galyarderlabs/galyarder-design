---
name: deck-swiss-international
zh_name: "Swiss International Deck"
en_name: "Swiss International Deck"
emoji: "🟦"
description: "16-column grid, one saturated accent, and 22 locked layouts (Klein Blue, Lemon, Mint, Safety Orange)."
zh_description: "16-column grid + a single saturated accent + 22 locked layouts (Klein Blue / Lemon / Mint / Safety Orange)."
en_description: "16-column grid, one saturated accent, and 22 locked layouts (Klein Blue, Lemon, Mint, Safety Orange)."
category: slides
scenario: marketing
aspect_hint: "16:9 horizontal deck"
featured: 1
recommended: 1
tags: ["swiss", "grid", "international", "ikb", "editorial", "facts"]
example_id: sample-swiss-international
example_name: "Swiss International — Product Roadmap"
example_format: markdown
example_tagline: "Klein Blue IKB + 16-column grid"
example_desc: "S01 Cover + S06 KPI Tower preview, IKB full-screen title + 4 KPI bars"
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
  example_prompt: "Use the Swiss International Deck template to turn my content into a 16-column-grid deck with one saturated accent and 22 locked layouts. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Swiss International Deck template to turn my content into a 16-column-grid deck with one saturated accent and 22 locked layouts. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Swiss International Deck]
[Intent] Facts, products, analysis, methodology. Extremely calm, rational, academic — no hand-drawn marks, no noise, no decoration. Inspired by op7418/guizang-ppt-skill Style B.

[Themes] **Pick exactly one of the 4 below; never mix and never edit the hex values:**
- 🔵 **Klein Blue (IKB)** — accent `#002FA7`, paper `#fafaf8`, ink `#0a0a0a`. Business / AI / design.
- 🟡 **Lemon Yellow** — accent `#FFD500`, paper `#f7f5ee` (cream), ink `#0a0a0a`. Youth / retail / sports. Type must be black (never white).
- 🟢 **Lemon Green / Neon** — accent `#C5E803`, paper `#f7f5ee`, ink `#0a0a0a`. Sustainability / tech startups / Gen-Z brands. Type must be black.
- 🟠 **Safety Orange** — accent `#FF6B35`, paper `#f7f5ee`, ink `#0a0a0a`. Industrial / automotive / urgent messaging. Type must be white + bold ≥ 600.

[Layouts — 22 reusable layouts; do not invent new layouts and do not modify these. **Count is driven by content**: cover [user content] completely (short content starts at 6-10 slides; long content goes well beyond that, with the same layout repeated across sections)]
- **S01 Cover** — full-screen accent + ASCII breathing dot matrix + reverse-knockout title + chrome metadata (date / № / topic).
- **S02 Vertical Timeline** — dashed left axis + dots; nodes on the right = year + KPI + description.
- **S03 Statement** — 9.6vw centered oversized type + generous left whitespace + bottom hairline + footnote.
- **S04 Six Cells** — 2×3 grid; each cell: icon + number + short title + one-line description.
- **S05 Three Sub-cards** — left hero title + right 3 horizontally stacked grey cards.
- **S06 KPI Tower** — 4 columns of variable-height blue bars; icon at the top of each bar; large number + label at the bottom.
- **S07 H-Bar Chart** — horizontal ranking bars; width reflects data; numbers anchored at the end.
- **S08 Duo Compare** — vertical divider; left = Before, right = After.
- **S09 Closing Manifesto** — left IKB block + ASCII dot matrix + manifesto; right white background + 3 bullet points.
- **S10 Dot Matrix Statement** — centered manifesto + corner geometric dot or ring matrix.
- **S11 Horizontal Timeline** — top headline, mid hairline axis, equally spaced nodes, step name below each node.
- **S12 Manifesto + Ink Banner** — top half headline + explanation; bottom half full-width black banner + reverse-knockout small text.
- **S13 Three Forces Cards** — left ink hero block; right 3 grey cards, each with a large number + text.
- **S14 Loop Diagram** — left numbered steps; right SVG concentric rings; center "LOOP" label.
- **S15 Image Matrix + Hero Stat** — 4×3 equal-height cards (12 items) + bottom summary big number + label.
- **S16 Multi-card Brief** — 3×2 micro cards; main copy top-left, footnotes bottom-right, one card highlighted in accent.
- **S17 System Diagram** — left headline + 3 description paragraphs; right SVG three concentric circles + outer labels.
- **S18 Why Now** — 3 columns; each column: category label + headline + description + bottom number (last column in accent).
- **S19 Four Cards** — top accent hairline + headline + 4 equal-width cards (metadata / title / body).
- **S20 Stacked KPI Ledger** — vertical rows + hairline separators; left big number / center label / right icon.
- **S21 Tech Spec Sheet** — left title block / center 3 KPI hairlines / right variable-height bars / bottom data.
- **S22 Image Hero** — top 60% full-width image + white title block overlay; bottom 40% explanation + 3 KPI columns.

[Design rules — strict]
- **Right angles only**: `border-radius: 0` everywhere. Rounded corners = immediate violation.
- **1px hairline borders**, black or accent; no shadows / gradients / blur.
- **16-column grid**: `grid-template-columns: repeat(16, 1fr); gap: 0`.
- **Fonts**: Inter Tight (Latin display) / Inter (body) / JetBrains Mono (data); no serifs, no decorative faces.
- **Extreme type contrast**: cover at 9.6vw display, body 14-16px, label 11px uppercase letter-spacing 0.08em.
- **Keyboard ← / → switches slides + hash sync**; corner marks pinned: `№N/N` bottom-right, topic tag bottom-left.
- **No fabrication**: numbers must come from user input; bar heights = real data, drawn proportionally.
- Output a single-file HTML with no external image URLs; render decorative geometry (ASCII matrices / concentric rings) with pure CSS or inline SVG.
