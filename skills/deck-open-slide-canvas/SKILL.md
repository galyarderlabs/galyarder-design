---
name: deck-open-slide-canvas
emoji: "🎨"
description: "Locked 1920×1080 canvas, with flexible React-level component composition independent of templates"
category: slides
scenario: design
featured: 35
recommended: 9
tags: ["canvas", "open-slide", "freeform", "1920", "react"]
example_id: sample-deck-open-slide-canvas
example_format: markdown
example_source_url: "https://github.com/1weiho/open-slide"
example_source_label: "1weiho/open-slide"
od:
  mode: deck
  surface: web
  scenario: design
  featured: 0.17
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "1920 Canvas Freedom Deck" template to turn my content into "Locked 1920×1080 canvas, with flexible React-level component composition independent of templates". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: 1920 Free Canvas Deck]
【Intent] Scenes where you do not want to be restricted by templates (personal portfolio, unique keynotes, art / design class deck). Provide a fixed 1920×1080 canvas + extremely strict typography / color constraints, letting the agent arrange each page freely based on content like writing React components. Inspired by 1weiho/open-slide.

【Strict Technical Specifications]
- Canvas: Each page strictly `width: 1920px; height: 1080px;` using `transform: scale(...)` to fit the viewport (defaults to `scale(0.7)` Centered).
- **Overflow is strictly prohibited**: each page of content must fit within 1920×1080, no scrollbars allowed.
- Font size type scale (px): `2xs:18 · xs:22 · sm:28 · md:36 · lg:48 · xl:64 · 2xl:88 · 3xl:120 · 4xl:160 · 5xl:220`.
- Margins/padding: one of three options (96 / 128 / 160).
- Each page has a `<section class="slide" data-slide-id="<n>">`.

[Palette — Select 1 set per deck, do not modify throughout]
- 🌫 **Ash & Lime** — bg `#f1efea`, ink `#161616`, accent `#c5e803`。
- 🌌 **Sea Indigo** — bg `#0a0e1a`, ink `#f5f5f7`, accent `#5ac8fa`。
- 🧉 **Mate Mocha** — bg `#1a1411`, ink `#f5e9d6`, accent `#d97757`。
- 🌸 **Pearl Rose** — bg `#fdf6f3`, ink `#1a1015`, accent `#ff5d8f`。

【Layout Freedom — This is core]
- Do not force templates, each page chooses its own layout based on the **nature of content**: cover / question / quote / image-text / three-column / five-column / list / data card / full bleed image.
- But each page **must follow one rule**: only 1 visual hierarchy — a single quote, a number, or an image, do not "emphasize everything".
- Do not pack two equal blocks of text; if parallel structure is needed, utilize a 3-column equal-weight grid.

【Typography]
- Western: `Inter Tight` (display) + `Inter` (body); or `Source Serif Pro` (when in editorial style).
- Chinese: Noto Sans SC (sans style) or Noto Serif SC (editorial style); do not mix sans + serif.
- mono: `JetBrains Mono` for data / timestamps.

【Design Details]
- Emoji decorations are strictly forbidden (permitted only inside content); multicolor rainbow palettes are banned; use only a single accent color.
- Using generic libraries like Lucide or Feather for SVG icons is strictly forbidden (write custom inline SVGs instead).
- Add keyboard ← / → navigation + hash synchronization; fixed badges: `№N/M` bottom-right, deck title bottom-left.
- Must use actual user content; lorem ipsum is strictly prohibited.
- Single-file HTML; Tailwind CDN; no external image links.
