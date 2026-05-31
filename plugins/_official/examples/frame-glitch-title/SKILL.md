---
name: frame-glitch-title
zh_name: "Glitch Title Frame"
en_name: "Glitch Title Frame"
emoji: "⚡"
description: "Digital glitch, chromatic offset, and data-corruption title frame for video transitions or cyberpunk heroes."
zh_description: "Digital glitch / chromatic offset / data-corruption title — works for video transitions or cyberpunk heroes."
en_description: "Digital glitch, chromatic offset, and data-corruption title frame for video transitions or cyberpunk heroes."
category: video
scenario: video
aspect_hint: "1920×1080 (16:9)"
featured: 37
recommended: 6
tags: ["glitch", "cyberpunk", "title", "transition", "vfx", "frame"]
example_id: sample-frame-glitch-title
example_name: "Glitch Title — SIGNAL_LOST"
example_format: markdown
example_tagline: "cyan / magenta chromatic offset + CRT scanlines"
example_desc: "Oversized title + data-corruption artifacts + ASCII noise chunks in the corners"
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
  example_prompt: "Use the Glitch Title Frame template to turn my content into a digital-glitch, chromatic-offset, data-corruption title frame for a video transition or cyberpunk hero. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Glitch Title Frame template to turn my content into a digital-glitch, chromatic-offset, data-corruption title frame for a video transition or cyberpunk hero. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Glitch Title Frame]
[Intent] Single-frame hero / video transition / cyberpunk-style title. Inspired by hyperframes glitch.

[Canvas] 1920×1080, background near-black `#070708` or CRT-dim `#0d0e10`; add a 56px grid (5% transparent) and horizontal scanlines (8% transparent, 2px spacing).

[Main title]
- Centered, 6-9vw, weight 800/900, font `Space Grotesk Bold` / `Inter Tight Black` / `JetBrains Mono Bold`.
- Color: primary layer `#f5f5f7`; behind it, two ghost layers:
  - cyan `#00f0ff` translate(`-3px`, `1px`).
  - magenta `#ff2bd6` translate(`3px`, `-1px`).
- Add a clip-path that slices the layer into 5-8 strips; each strip uses `@keyframes` to translate randomly between `-10px` and `10px` over 80-160ms, staggered, producing the "data corruption" chromatic shimmer.
- Every 1.5s, fire a "heavy glitch" — the entire title gets a horizontal smear for 1 frame using `filter: url(#displacementFilter)` or a simple CSS translate.

[Additional layers]
- Top caption row (uppercase mono, 11px, opacity 0.6): `>> SIGNAL_LOST · CH-04 · 14:32:08`.
- One subtitle line below the title (24-28px, mono, opacity 0.7), occasionally replaced by ` ̶▒̶` characters (fake garbled text).
- ASCII noise chunks `█▓▒░` randomly sprinkled in the corners.
- Bottom timecode (mono, opacity 0.4).
- Whole frame overlaid with a noise-grain layer `background-image: url("data:image/svg+xml,...turbulence...")`, opacity 6%, `mix-blend-mode: overlay`.

[SVG filter (optional)]
- Define `<filter id="rgbShift">` using `feColorMatrix` + `feOffset` + `feMerge` to offset the R/G/B channels; apply `filter: url(#rgbShift)` to the title layer at glitch peaks.

[Design rules]
- Colors only: black / white / cyan / magenta / a touch of amber for warnings; no rainbows.
- Fonts: Latin `Space Grotesk` or `JetBrains Mono` Bold.
- No lorem ipsum; you must use the user's title + subtitle.
- Animations rely on `@keyframes` and can be disabled by `prefers-reduced-motion` (fall back to a static chromatic split).
- Single-file HTML.
