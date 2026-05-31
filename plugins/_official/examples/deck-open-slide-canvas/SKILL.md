---
name: deck-open-slide-canvas
zh_name: "Open-Slide 1920 Canvas Deck"
en_name: "Open-Slide 1920 Canvas Deck"
emoji: "🎨"
description: "Locked 1920x1080 canvas deck with React component-level free composition, not bound to a fixed template."
zh_description: "Locked 1920×1080 canvas with React-component-level free composition, not bound to a fixed template."
en_description: "Locked 1920x1080 canvas deck with React component-level free composition, not bound to a fixed template."
category: slides
scenario: design
aspect_hint: "1920×1080 (16:9)"
featured: 35
recommended: 9
tags: ["canvas", "open-slide", "freeform", "1920", "react"]
example_id: sample-deck-open-slide-canvas
example_name: "Open-Slide 1920 Canvas — Sea Indigo"
example_format: markdown
example_tagline: "Locked 1920×1080 + free composition"
example_desc: "Sea Indigo palette + a hero question slide with corner marks"
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
  example_prompt: "Use the Open-Slide 1920 Canvas Deck template to turn my content into a locked 1920x1080 free-composition deck with React component-level layout. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Open-Slide 1920 Canvas Deck template to turn my content into a locked 1920x1080 free-composition deck with React component-level layout. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Open-Slide 1920 Canvas Deck]
[Intent] Use cases that don't want to be tied to a template (personal portfolios, unconventional talks, art / design class decks). Provides a fixed 1920×1080 canvas + strong type / palette constraints, so the agent can lay out each slide freely like a React component based on the content. Inspired by 1weiho/open-slide.

[Hard technical specs]
- Canvas: every slide is strictly `width: 1920px; height: 1080px;`, fitted to the viewport with `transform: scale(...)` (default `scale(0.7)`, centered).
- **Overflow is forbidden**: every slide's content must fit inside 1920×1080; no scrollbars allowed.
- Type scale (px): `2xs:18 · xs:22 · sm:28 · md:36 · lg:48 · xl:64 · 2xl:88 · 3xl:120 · 4xl:160 · 5xl:220`.
- Padding: pick exactly one of 96 / 128 / 160.
- Each slide is `<section class="slide" data-slide-id="<n>">`.

[Palettes — pick one set per deck and stick with it]
- 🌫 **Ash & Lime** — bg `#f1efea`, ink `#161616`, accent `#c5e803`.
- 🌌 **Sea Indigo** — bg `#0a0e1a`, ink `#f5f5f7`, accent `#5ac8fa`.
- 🧉 **Mate Mocha** — bg `#1a1411`, ink `#f5e9d6`, accent `#d97757`.
- 🌸 **Pearl Rose** — bg `#fdf6f3`, ink `#1a1015`, accent `#ff5d8f`.

[Layout freedom — this is the core]
- No fixed template; pick a layout per slide based on **content character**: cover / question / quote / image-text / 3-column / 5-column / list / data card / full-bleed image.
- Every slide **must follow one rule**: there is exactly 1 visual focal point — a single quote, a single number, a single image. Never "emphasize everything."
- Don't cram in two equal-weight blocks of text. If you really need parallel ideas, use a 3-column equal-weight grid.

[Fonts]
- Latin: `Inter Tight` (display) + `Inter` (body); or `Source Serif Pro` (for editorial vibes).
- Mono: `JetBrains Mono` for data / timestamps.

[Design rules]
- No decorative emoji (emoji inside the user's content is fine); no rainbow palettes; one accent color only.
- No off-the-shelf SVG icon libraries (Lucide / Feather etc.) — write inline SVGs yourself.
- Keyboard ← / → switches slides + hash sync; corner marks pinned: `№N/M` bottom-right, deck title bottom-left.
- Use the user's real content; lorem ipsum is forbidden.
- Single-file HTML; Tailwind via CDN; no external image links.
