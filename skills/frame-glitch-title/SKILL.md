---
name: frame-glitch-title
emoji: "⚡"
description: "Digital glitch / chromatic aberration / data-corrupted title cards, ideal for video transitions or cyberpunk hero sections"
category: video
scenario: video
featured: 37
recommended: 6
tags: ["glitch", "cyberpunk", "title", "transition", "vfx", "frame"]
example_id: sample-frame-glitch-title
example_format: markdown
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · glitch"
od:
  mode: video
  surface: video
  scenario: video
  featured: 0.14
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "Glitch Art Title Frame" template to turn my content into "Digital glitch / chromatic aberration / data-corrupted title cards, ideal for video transitions or cyberpunk hero sections". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Glitch Art Title (Glitch Title)]
【Intent] Single-frame hero / video transition / cyberpunk-style title. Inspired by hyperframes glitch.

【Canvas] 1920×1080, background `#070708` near black or CRT dark gray `#0d0e10`; add 56px grid (5% opacity) + scanline horizontal lines (8% opacity, 2px spacing).

【Main Title]
- Centered, 6-9vw, weight 800/900, font `Space Grotesk Bold` / `Inter Tight Black` / `JetBrains Mono Bold`.
- Color: primary layer `#f5f5f7`; layered with 2 pseudo-shadow layers underneath:
  - cyan `#00f0ff` translate(`-3px`, `1px`)。
  - magenta `#ff2bd6` translate(`3px`, `-1px`)。
- Clip-path the entire layer into 5-8 slices, each with `@keyframes` randomly translating X by -10px → 10px, lasting 80-160ms, staggered playback, creating a "data corruption" astigmatism.
- Trigger a "heavy glitch" every 1.5s — the entire title is smeared horizontally for 1 frame, using `filter: url(#displacementFilter)` or simple CSS translation.

【Additional Layer]
- Top single-line caption (uppercase mono, 11px, opacity 0.6): `>> SIGNAL_LOST · CH-04 · 14:32:08`.
- 1 subtitle line below title (24-28px, mono, opacity 0.7), occasionally replaced with ` ̶▒̶` character (fake corruption).
- Corners are randomly adorned with `█▓▒░` ASCII noise chunks.
- Bottom timecode (mono, opacity 0.4)。
- Overlay noise grain layer on the entire screen: `background-image: url("data:image/svg+xml,...turbulence...")`, opacity 6%, mix-blend-mode overlay.

【SVG Filters (Optional)]
- Define `<filter id="rgbShift">` using `feColorMatrix` + `feOffset` + `feMerge` to shift R/G/B channels; apply `filter: url(#rgbShift)` to the entire layer at the instant of glitch.

【Design Details]
- Limit colors to: black / white / cyan / magenta / a touch of amber for warnings; rainbow palettes are strictly forbidden.
- Fonts: Western `Space Grotesk` or `JetBrains Mono` Bold; Chinese `Noto Sans Mono CJK SC` or `Noto Sans SC` Bold.
- Lorem ipsum is strictly prohibited; must use user-provided title + subtitle.
- Animation uses `@keyframes`, can be disabled by `prefers-reduced-motion` (falling back to static chromatic split).
- Single-file HTML.
