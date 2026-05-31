---
name: frame-light-leak-cinema
emoji: "🎞️"
description: "Film light leaks + grain noise + 16:9 letterbox framing + bold serif display typography, perfect for cinematic intros or chapter cards"
category: video
scenario: video
featured: 36
tags: ["cinema", "film", "light-leak", "grain", "letterbox", "frame"]
example_id: sample-frame-light-leak-cinema
example_format: markdown
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · light-leak"
od:
  mode: video
  surface: video
  scenario: video
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "Film Light Leak Movie Frame" template to turn my content into "Film light leaks + grain noise + 16:9 letterbox framing + bold serif display typography, perfect for cinematic intros or chapter cards". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Film Light Leak Movie Frame]
【Intent] Opening single-frame for documentaries / personal short films / video chapter cards — warm orange light leaks + 35mm grain + large serif text, classic film texture. Inspired by hyperframes light-leak.

【Canvas]
- **2.39:1 letterbox** (recommended): 1920×800, top and bottom black borders 140px each (`#000`).
- Or 16:9: 1920×1080, no letterbox.

【Background]
- Bottom layer: Deep warm color (dark reddish brown `#1a0d08` / dark green `#0a1410` / blue-violet `#0d0e1a`) or scene depiction (CSS gradient simulating sky / indoor / outdoor).
- **Film Light Leak**: 2-3 large `radial-gradient(ellipse at top right, #ffb547 0%, transparent 50%)` + 1 bottom `linear-gradient(to top, #d97757 0%, transparent 30%)`; choose from warm orange / peach / rose / dark yellow, **do not use cool blue**.
- **35mm Grain**: Full screen covered SVG turbulence noise layer, opacity 14%, `mix-blend-mode: overlay`; can also use `background-image: url("data:image/svg+xml,...feTurbulence...")`.
- Optional: 1 `feDisplacementMap` pass to simulate film wobble (use with caution).

【Text]
- Center or bottom-left: large serif font (Source Serif Pro / Playfair Display / EB Garamond) 5-8vw, weight 500 italic; warm white color `#f5e9d6` or cream.
- Subtitle (24-28px) in a single line, opacity 0.7, matching serif.
- Corner caption (uppercase letterspace 0.18em, 10-11px, mono, opacity 0.5): "REEL 03 · CH I · 1985".
- Bottom timecode + shooting location + date (mono, opacity 0.4).

【Optional Additions]
- "Film scratches": a few 1-2px vertical white lines, opacity 0.2, at irregular intervals (using multiple `box-shadow` inset or multiple `<div>`).
- "Film perforations": equidistant small white squares inside the letterbox black borders (CSS repeating-linear-gradient).
- Entrance animation: The entire screen goes from underexposed (brightness 0.3) → normal within 800ms; light leaks slowly drift in a 12s cycle.

【Design Details]
- Color palette absolutely restricted to 4 hues (dark background + 2 warm light leaks + cream text).
- Strictly forbidden: blue/purple light leaks (violates film aesthetic), emojis, neon colors, and geometric dashboard decorations.
- Chinese: `Noto Serif SC` italic is non-existent → use `Noto Serif SC` regular + increased letter-spacing.
- Must use the title provided by the user; automatically estimate appropriate "year / chapter / location" metadata (derived from user content).
- Single-file HTML; use `prefers-reduced-motion` to disable animation.
