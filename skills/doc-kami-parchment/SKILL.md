---
name: doc-kami-parchment
emoji: "📜"
description: "Warm parchment background (#f5f4ed) + deep indigo accent (#1B365D) + single editorial serif font for high-end typography"
category: doc
scenario: personal
featured: 48
recommended: 3
tags: ["kami", "parchment", "serif", "editorial", "report", "letter", "one-pager"]
example_id: sample-kami-parchment
example_format: markdown
example_source_url: "https://github.com/tw93/kami"
example_source_label: "tw93/kami"
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: personal
  featured: 0.04
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "Kami Parchment Document" template to turn my content into "Warm parchment background (#f5f4ed) + deep indigo accent (#1B365D) + single editorial serif font for high-end typography". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Kami Parchment Document]
【Intent] Serious layout documents: one-pager / long report / letters / resume / financial report / changelog / portfolio. Inspired by tw93/kami. Emphasizes "writing that feels like beautifully typeset paper", not a dashboard, not a web page.

【Strict Visual Signatures — Modification strictly forbidden]
- **Canvas**: warm parchment `#f5f4ed` (never use pure white `#fff`). Secondary background `#efeee5`.
- **Ink Black**: primary text `#1f1d18` (near-black warm gray, avoid pure black `#000`). Secondary text `#6b665b`.
- **Unique Color**: Ink blue `#1B365D` — all accents (links, tag outlines, key numbers, blockquote left rules) can only use this one color, multiple colors are strictly prohibited.
- **Fonts**: one serif per language, do not mix throughout the text:
  - English: `Charter` (fallback: `Source Serif Pro`, `Iowan Old Style`)
  - Chinese: `TsangerJinKai02 W04` (fallback: `Noto Serif SC`)
  - Japanese: `YuMincho` (fallback: `Noto Serif JP`)
  - Body 400, Heading 500 (avoid 700/800/900).
- **Line-height**: titles 1.1–1.3, compact body 1.4–1.45, readable body 1.5–1.55.
- **Never**: drop-shadow / blur / rounded corners ≥ 8px / gradients / neon colors / rgba (use solid hex).
- **Details**: tags use solid hex background blocks (as WeasyPrint handles them better than rgba); single-stroke geometric icons; 1px hairline `#d4d1c5` rule on edges, length controlled to not reach margins.

【Optional Document Types — Determined by user content]
- **One-Pager** — Top logotype (Charter italic) + title + lede + 3 columns of key points + footer metadata.
- **Long Doc** — Cover page (Large Title + subtitle + author + date) → Table of Contents (kicker + page no.) → Chapters (folio corner + section rule + body) → Notes / footnotes + closing colophon.
- **Letter** — Header address + date + recipient + body (left-aligned, 1.5em spacing between paragraphs) + sign-off + signature placeholder line.
- **Portfolio** — Project hero (Large Title + sub) + 1 full-width image (drawn using a CSS block placeholder) + project description + role / time / stack metadata row.
- **Resume** — Top name (large text) + single line tagline + contact row + main sections: experience (company / time / title / bullets) + skills + education.
- **Slides** — Keynote style, page count determined by [User Content] (6 pages starting for short content, longer content should have more), each page fully covered in parchment, Large Title + lede + corner page no., so simple it feels purely "printed".
- **Equity Report** — Company Name + ticker + Q × Year + key metrics row (revenue / margin / yoy) + body analysis + chart (monochrome SVG polyline).
- **Changelog** — Version number (large Charter italic) + date + list of changes (Added / Changed / Fixed), single rule.

【Design Guidelines]
- "Composed pages, not dashboards." Do not pile up KPI cards, do not pile up emoji icons, do not use hero gradients.
- "Ring or whisper only, no hard drop shadows." Shadows must only be hairline strokes like `0 0 0 1px #d4d1c5`.
- Typographic hierarchy relies on **serif contrast + font size + negative space**, not color.
- Single-file HTML, using Tailwind CDN; add Pangu's space when mixing Chinese and English text; do not link external images, use paper-tint color blocks + 1px ink stroke as placeholders.
