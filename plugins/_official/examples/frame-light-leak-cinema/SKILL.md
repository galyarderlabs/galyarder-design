---
name: frame-light-leak-cinema
zh_name: "Light-Leak Cinematic Frame"
en_name: "Light-Leak Cinematic Frame"
emoji: "🎞️"
description: "Film light leaks, grain, 16:9 letterbox, and large serif type for cinematic openings or chapter cards."
zh_description: "Film light leaks + grain + 16:9 letterbox + large serif type, for cinematic openings or chapter cards."
en_description: "Film light leaks, grain, 16:9 letterbox, and large serif type for cinematic openings or chapter cards."
category: video
scenario: video
aspect_hint: "2.39:1 letterbox (1920×800) or 16:9 (1920×1080)"
featured: 36
tags: ["cinema", "film", "light-leak", "grain", "letterbox", "frame"]
example_id: sample-frame-light-leak-cinema
example_name: "Light Leak — REEL 03"
example_format: markdown
example_tagline: "Warm orange light leak + 35mm grain"
example_desc: "2.39:1 letterbox + serif italic display + film-sprocket holes"
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
  example_prompt: "Use the Light-Leak Cinematic Frame template to turn my content into a cinematic opening or chapter card with film light leaks, grain, letterbox framing, and large serif type. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Light-Leak Cinematic Frame template to turn my content into a cinematic opening or chapter card with film light leaks, grain, letterbox framing, and large serif type. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Light-Leak Cinematic Frame]
[Intent] Single opening frame for documentaries / personal short films / video chapter cards — warm orange light leaks + 35mm grain + large serif type, classic film texture. Inspired by hyperframes light-leak.

[Canvas]
- **2.39:1 letterbox** (recommended): 1920×800, with 140px black bars (`#000`) on top and bottom.
- Or 16:9: 1920×1080, no letterbox.

[Background]
- Base: deep warm color (deep red-brown `#1a0d08` / ink green `#0a1410` / blue-violet `#0d0e1a`) or scene rendering (CSS gradient simulating sky / interior / exterior).
- **Light Leak**: 2-3 large `radial-gradient(ellipse at top right, #ffb547 0%, transparent 50%)` + 1 bottom `linear-gradient(to top, #d97757 0%, transparent 30%)`; pick warm orange / peach / rose / dim yellow — **never cool blues**.
- **35mm Grain**: full-canvas SVG turbulence noise overlay at opacity 14%, `mix-blend-mode: overlay`; alternatively `background-image: url("data:image/svg+xml,...feTurbulence...")`.
- Optional: a subtle `feDisplacementMap` to mimic film weave (use sparingly).

[Type]
- Center or lower-left: large serif (Source Serif Pro / Playfair Display / EB Garamond) at 5-8vw, weight 500 italic; color warm white `#f5e9d6` or cream.
- Subtitle (24-28px) on one line, opacity 0.7, same serif.
- Corner caption (uppercase letter-spacing 0.18em, 10-11px, mono, opacity 0.5): "REEL 03 · CH I · 1985".
- Bottom timecode + location + date (mono, opacity 0.4).

[Optional extras]
- "Film scratches": a few 1-2px vertical white lines, opacity 0.2, irregular spacing (multi-`box-shadow inset` or many `<div>`s).
- "Sprocket holes": small evenly spaced white squares inside the letterbox bars (CSS repeating-linear-gradient).
- Entry animation: the frame transitions from underexposed (brightness 0.3) → normal in 800ms; the light leak drifts slowly with a 12s cycle.

[Design rules]
- No more than 4 hues total (deep background + 2 warm leak colors + cream type).
- Forbidden: blue-violet leaks (breaks the film texture), decorative emoji, neon colors, geometric dashboard ornaments.
- Use the user's title; estimate plausible "year / chapter / location" metadata, but anchor to the user's content.
- Single-file HTML with `prefers-reduced-motion` disabling the animation.
