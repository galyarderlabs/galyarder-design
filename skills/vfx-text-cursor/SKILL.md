---
name: vfx-text-cursor
emoji: "✨"
description: "Cursor trail light paths + colorful aberration rays + directional light blobs, perfect for revealing quotes word-by-word in video intros"
category: video
scenario: video
featured: 38
recommended: 7
tags: ["vfx", "text", "cursor", "chromatic", "reveal", "frame"]
example_id: sample-vfx-text-cursor
example_format: markdown
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · vfx-text-cursor"
od:
  mode: video
  surface: video
  scenario: video
  featured: 0.15
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "VFX Text Cursor" template to turn my content into "Cursor trail light paths + colorful aberration rays + directional light blobs, perfect for revealing quotes word-by-word in video intros". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: VFX Text Cursor (Text Cursor)]
【Intent] Video intro / Hero frame — cursor "typing" on the canvas, characters emerging one by one, trailing colorful astigmatism wakes + directional light flares behind. Inspired by hyperframes vfx-text-cursor.

【Canvas] 1920×1080, background `#06070a` matte dark black or `#0a0d12` (warm blue bias); add subtle vignette.

【Content]
- A single golden quote (regardless of language), Centered, font size 6-8vw, weight 700, font `Inter Tight` / `Source Sans 3` / `Noto Sans SC`.
- Staggered character reveal with 80ms intervals; a cursor `▍` (or thin vertical bar) follows the current character.
- Revealed text defaults to white `#f5f5f7`, opacity 1; add a chromatic ghost to positions about to be revealed: a `text-shadow: 2px 0 #ff3b6f, -2px 0 #00d4ff` at the instant of reveal, converging back to normal within 200ms.
- The cursor itself: 16px wide rectangle, color = accent (choose 1: hot pink `#ff3b6f` / cyan `#00d4ff` / amber `#ffb547`), blinking `@keyframes` with 1.0s cycle; followed by a 60-120px motion blur trail (radial gradient to transparent).

【Glows / Light Rays]
- Randomly generate 3-5 **directional light flares** (light leaks) near the typing position: using thin rectangles with `linear-gradient(45deg, transparent, accent20, transparent)` + `mix-blend-mode: screen` at irregular angles.
- Upon text rendering completion, apply a 0.5s shimmer sweep across the entire block.

【Fields]
- Top caption (uppercase letterspace 0.18em, 11px, opacity 0.5): "FRAME 01 · OPENING"。
- Subtitle beneath text (24-28px, opacity 0.6): source / chapter.
- Bottom-right timecode (`00:03:21` mono).

【Design Details]
- **Never**: multi-color rainbow chromatic (only use a binary astigmatism like 1 hot pink + cyan, do not use all R/G/B colors).
- Fonts: Western `Inter Tight` Bold; Chinese `Noto Sans SC` Bold; sans-serif only (serif is strictly forbidden).
- Animation uses `@keyframes` + JS timer (`setTimeout` character by character), can be disabled by `prefers-reduced-motion` (revealing all text directly).
- Must use user-provided golden quote; do not fabricate.
- Single-file HTML, do not link to external resources other than fonts.
