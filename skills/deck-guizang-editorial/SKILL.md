---
name: deck-guizang-editorial
emoji: "🖋️"
description: "Digital Magazine × E-Ink; featuring 10 layouts + 5 color palettes (Ink, Indigo Porcelain, Forest Ink, Kraft Paper, Dune)"
category: slides
scenario: marketing
featured: 49
recommended: 1
tags: ["editorial", "e-ink", "magazine", "narrative", "guizang"]
example_id: sample-guizang-editorial
example_format: markdown
example_source_url: "https://github.com/op7418/guizang-ppt-skill"
example_source_label: "op7418/guizang-ppt-skill"
od:
  mode: deck
  surface: web
  scenario: marketing
  featured: 0.01
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "Guizang Editorial Ink Deck" template to turn my content into "Digital Magazine × E-Ink; featuring 10 layouts + 5 color palettes (Ink, Indigo Porcelain, Forest Ink, Kraft Paper, Dune)". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Guizang Editorial Ink Deck (Editorial × E-Ink)]
【Intent] Narrative, viewpoints, sharing, and personal style expression. Ink-on-paper print feel, no high-tech look. Inspired by op7418/guizang-ppt-skill Style A.

[Palette — 5 Options, strictly forbid modifying hex, strictly forbid mixing]
- 🖋 **Monocle** — ink `#0a0a0b`, paper `#f1efea`, paper-tint `#e8e5de`, ink-tint `#18181a`. Default / Universal Business / Tech.
- 🌊 **Indigo Porcelain** — ink `#0a1f3d`, paper `#f1f3f5`, paper-tint `#e4e8ec`, ink-tint `#152a4a`. Tech / Research / Data.
- 🌿 **Forest Ink** — ink `#1a2e1f`, paper `#f5f1e8`, paper-tint `#ece7da`, ink-tint `#253d2c`. Natural / Sustainable / Cultural.
- 🍂 **Kraft Paper** — ink `#2a1e13`, paper `#eedfc7`, paper-tint `#e0d0b6`, ink-tint `#3a2a1d`. Nostalgic / Humanistic / Literary.
- 🌙 **Dune** — ink `#1f1a14`, paper `#f0e6d2`, paper-tint `#e3d7bf`, ink-tint `#2d2620`. Art / Design / Fashion.

【Layout — 10 cassette-style layout pools, reusable; **quantity is determined by [User Content]**, completely covering every key point; short content starting at 6-12 cards, long content should have more (the same layout can be repeated in different chapters)]
- **L01 Hero Cover** — Centered large text hero typography + kicker + subtitle + lead paragraph + Bottom metadata row.
- **L02 Act Divider** — kicker + 8.5-10vw giant headline + a single quote; section transition can invert colors (ink ↔ paper).
- **L03 Big Numbers Grid** — 3×2 data cards (label / large metric / annotation).
- **L04 Quote + Image** — Left kicker + headline + body + callout; right 16:10 image (baseline alignment, not top).
- **L05 Image Grid** — 3×2 or 3×1 equal height image grid (26vh or 22vh); strictly uniform heights.
- **L06 Pipeline / Flow** — Horizontal numbered step group, each step: №X + Title + Description; supports keyboard stepping.
- **L07 Hero Question** — 7vw fullscreen single question, broken semantically, with ultra-minimal surroundings.
- **L08 Big Quote** — 5.8vw massive serif quotation + English translation + signature + date.
- **L09 Before / After** — 1:1 split; Left column opacity .55 (Old/before); Right column full brightness (New/after).
- **L10 Mixed Media** — 8:4 aspect ratio; left has large text block (kicker / headline / body / callout) + right has a 3:4 vertical image as support.

【Design Details]
- **Strictly Prohibited**: Gradients / drop-shadow / rounded corners / circular decorations / blur / SVG icon libraries / emoji decorations.
- **Typography**: Display uses `Playfair Display` (EN) / `Noto Serif SC` (CN); Body uses `Inter` / `Noto Sans SC`; numbers/indexes may occasionally use italic serif.
- **Editorial Details**: kicker uses 11px uppercase letterspacing 0.12em; folio in the bottom-right corner `01 / 12`; top hairline rule + magazine logo / topic.
- **Not Allowed**: Data fabrication, Lorem ipsum, placeholder image URLs. Draw all images using pure CSS / inline SVG (color blocks + simple shapes).
- Keyboard ← / → navigation; hash synchronization; single-file HTML.
