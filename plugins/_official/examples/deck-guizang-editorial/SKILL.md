---
name: deck-guizang-editorial
zh_name: "Guizang Editorial E-Ink Deck"
en_name: "Guizang Editorial E-Ink Deck"
emoji: "🖋️"
description: "Editorial magazine meets e-ink: 10 layouts and 5 palettes (Ink, Indigo Porcelain, Forest Ink, Kraft Paper, Dune)."
zh_description: "Editorial magazine meets e-ink — 10 layouts and 5 palettes (Ink / Indigo Porcelain / Forest Ink / Kraft Paper / Dune)."
en_description: "Editorial magazine meets e-ink: 10 layouts and 5 palettes (Ink, Indigo Porcelain, Forest Ink, Kraft Paper, Dune)."
category: slides
scenario: marketing
aspect_hint: "16:9 horizontal deck"
featured: 49
recommended: 1
tags: ["editorial", "e-ink", "magazine", "narrative", "guizang"]
example_id: sample-guizang-editorial
example_name: "Guizang Editorial E-Ink — Chapter Cover"
example_format: markdown
example_tagline: "Ink classic palette + serif display"
example_desc: "L02 Act Divider + L03 Big Numbers Grid, paper-print feel"
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
  example_prompt: "Use the Guizang Editorial E-Ink Deck template to turn my content into an editorial magazine x e-ink horizontal deck with 10 layouts and 5 palettes. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Guizang Editorial E-Ink Deck template to turn my content into an editorial magazine x e-ink horizontal deck with 10 layouts and 5 palettes. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Guizang Editorial E-Ink Deck (Editorial × E-Ink)]
[Intent] Narrative, opinion, sharing, and personal-voice expression. Paper-print feel, never tech-y. Inspired by op7418/guizang-ppt-skill Style A.

[Palettes — pick exactly one; never edit the hex values, never mix palettes]
- 🖋 **Ink Classic (Monocle)** — ink `#0a0a0b`, paper `#f1efea`, paper-tint `#e8e5de`, ink-tint `#18181a`. Default / general business / tech.
- 🌊 **Indigo Porcelain** — ink `#0a1f3d`, paper `#f1f3f5`, paper-tint `#e4e8ec`, ink-tint `#152a4a`. Tech / research / data.
- 🌿 **Forest Ink** — ink `#1a2e1f`, paper `#f5f1e8`, paper-tint `#ece7da`, ink-tint `#253d2c`. Nature / sustainability / culture.
- 🍂 **Kraft Paper** — ink `#2a1e13`, paper `#eedfc7`, paper-tint `#e0d0b6`, ink-tint `#3a2a1d`. Nostalgic / humanist / literary.
- 🌙 **Dune** — ink `#1f1a14`, paper `#f0e6d2`, paper-tint `#e3d7bf`, ink-tint `#2d2620`. Art / design / fashion.

[Layouts — 10 reusable cassette-style layouts; the **count is driven by [user content]**, covering every point fully; short content starts at 6-12 slides, long content uses many more (the same layout may repeat across sections)]
- **L01 Hero Cover** — centered hero typography + kicker + subtitle + lead paragraph + footer metadata row.
- **L02 Act Divider** — kicker + 8.5–10vw oversized headline + a single lead quote; section transitions can invert (ink ↔ paper).
- **L03 Big Numbers Grid** — 3×2 stat cards (label / large number / footnote).
- **L04 Quote + Image** — left: kicker + headline + body + callout; right: 16:10 image (baseline-aligned, not top-aligned).
- **L05 Image Grid** — 3×2 or 3×1 equal-height image grid (26vh or 22vh); strict uniform heights.
- **L06 Pipeline / Flow** — horizontal numbered step group; each step: №X + title + description; supports keyboard step-through.
- **L07 Hero Question** — 7vw full-screen single question, semantic line breaks, minimalism around it.
- **L08 Big Quote** — 5.8vw oversized serif quote + translation + byline + date.
- **L09 Before / After** — 1:1 split; left column at opacity .55 (before); right column at full brightness (after).
- **L10 Mixed Media** — 8:4 ratio; left: long text block (kicker / headline / body / callout); right: 3:4 vertical image as support.

[Design rules]
- **Forbidden**: gradients / drop-shadows / rounded corners / circular ornaments / blur / SVG icon libraries / decorative emoji.
- **Fonts**: display uses `Playfair Display`; body uses `Inter`; numbers / numerals may occasionally use italic serif.
- **Magazine details**: kicker uses 11px uppercase, letter-spacing 0.12em; folio in the bottom-right reads `01 / 12`; thin hairline rule at the top + journal logo / topic.
- **Forbidden**: fabricated data, lorem ipsum, placeholder image URLs. Render every image with pure CSS / inline SVG (color blocks + line drawings).
- Keyboard ← / → switches slides; hash sync; single-file HTML.
