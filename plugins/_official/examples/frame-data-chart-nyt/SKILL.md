---
name: frame-data-chart-nyt
zh_name: "NYT-Style Data Chart Frame"
en_name: "NYT-Style Data Chart Frame"
emoji: "📈"
description: "NYT-newsroom typography, staggered reveal animation, and editorial-grade charts (line, bar, or range band)."
zh_description: "NYT-newsroom typography + staggered reveal animation + editorial-grade charts (line / bar / range band)."
en_description: "NYT-newsroom typography, staggered reveal animation, and editorial-grade charts (line, bar, or range band)."
category: video
scenario: video
aspect_hint: "1920×1080 (16:9)"
featured: 46
tags: ["data", "chart", "nyt", "editorial", "frame"]
example_id: sample-frame-data-chart-nyt
example_name: "NYT-Style Line Chart — Global Users"
example_format: markdown
example_tagline: "Editorial-grade chart with staggered reveal"
example_desc: "8-year weekly active users line + NYT-red accent + mono annotations"
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · data-chart"
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
  example_prompt: "Use the NYT-Style Data Chart Frame template to turn my content into a frame with NYT-newsroom typography, staggered reveal animation, and editorial-grade charts. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the NYT-Style Data Chart Frame template to turn my content into a frame with NYT-newsroom typography, staggered reveal animation, and editorial-grade charts. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: NYT-Style Data Chart Frame]
[Intent] Turn a piece of data (CSV / JSON / a one-line conclusion) into a *New York Times*-column-style single frame or animated chart, suitable for video clips or Twitter cards. Inspired by hyperframes data-chart.

[Canvas] 1920×1080. Pick either a warm-white `#f7f5ee` or ink-black `#0e0e0e` background; the text color is the opposite of the background.

[Layout]
- **Top kicker** (11px uppercase, letter-spacing 0.14em, color = accent red `#a91d1d` or mint `#5fb38a`): data source + category, e.g. "GLOBAL · WEEKLY ACTIVE USERS · 2018–2026".
- **Display headline** (Cheltenham / Playfair / Source Serif Pro, 5.6vw, optional italic deck): one-sentence conclusion. **The conclusion must be extracted from the user's data**, not a description of the chart.
- **Chart area** (occupies 55-65% of the canvas):
  - Line: 1-2 lines, primary line ink solid 2.5px, secondary line dashed 1.5px; data points as 6px solid circles; annotate key points with `2024 · 412M` in black mono small type.
  - Bars: ink monochrome with optionally one accent-highlighted bar; large number on top of the bar; italic category label below the bar (Cheltenham italic).
  - Range band: light grey `#e6e2d2` envelope + ink centerline.
- **Footer source + footnote** (10px mono, opacity 0.6): "Source: user data · Chart by html-anything".
- **Staggered reveal**: title fades in (0s), kicker (200ms), line `stroke-dashoffset` 1.2s ease-out (400ms), data labels appear sequentially with 100ms intervals. Disabled under `prefers-reduced-motion`.

[Design rules]
- **Forbidden**: chart.js / d3 libraries (unless via jsdelivr CDN); prefer hand-written SVG, no more than 80 lines inline.
- Fonts: heading `Source Serif Pro` or `Cheltenham` (fall back to `Playfair Display`); body `IBM Plex Sans` or `Inter`; data labels `IBM Plex Mono`.
- 1 primary color (ink) + 1 accent (pick one of NYT red `#a91d1d` / editorial mint `#5fb38a` / warm orange `#d97757`).
- Y-axis ticks: hairline only with 3-4 ticks, labels mono on the outside of the axis.
- No full-canvas grids, no shadows, no 3D bars; no decorative emoji.
- Must use the user's data. If the input is a textual conclusion, estimate plausible coordinates (and label as "schematic"); if CSV / JSON, plot directly.
- Single-file HTML; annotation format next to data points: `<text class="annot">2024 · 412M</text>`.
