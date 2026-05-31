---
name: frame-data-chart-nyt
emoji: "📈"
description: "NYT-newsroom typography + staggered reveal animations + editorial-grade charts (line, bar, range area)"
category: video
scenario: video
featured: 46
tags: ["data", "chart", "nyt", "editorial", "frame"]
example_id: sample-frame-data-chart-nyt
example_format: markdown
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
  example_prompt: >-
    Use the "NYT-Style Data Chart Frame" template to turn my content into "NYT-newsroom typography + staggered reveal animations + editorial-grade charts (line, bar, range area)". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: NYT-Style Data Chart Frame]
[Intent] Turn data (CSV / JSON / single conclusion) into a New York Times column-style single-frame or animated chart, suitable for video snippets or Twitter cards. Inspired by hyperframes data-chart.

[Canvas] 1920×1080, choice of warm white background `#f7f5ee` or ink black background `#0e0e0e`; text color is inverted relative to background.

【Layout]
- **Top kicker** (11px uppercase letterspace 0.14em, color = accent red `#a91d1d` or mint `#5fb38a`): Data source + category, e.g., "GLOBAL · WEEKLY ACTIVE USERS · 2018–2026".
- **Large Title** (Cheltenham / Playfair / Source Serif Pro, 5.6vw, italic subtitle optional): a single-line conclusion. **Conclusions must be distilled from user data**, not just describing the chart.
- **Chart Area** (occupies 55-65% of the canvas):
  - Line: 1-2 lines, primary line ink solid 2.5px, secondary line dashed 1.5px; data points use 6px solid circles; key points are annotated with `2024 · 412M` black mono small text.
  - Column: All ink monochrome or with 1 accent highlighted column; large numbers at column top; column bottom category in italic style (Cheltenham italic).
  - Range band: light gray fill `#e6e2d2` envelope + ink center line.
- **Bottom source + footnote** (10px mono, opacity 0.6): "Source: User Data · Chart by html-anything".
- **Staggered reveal animation**: Title fade-in (0s), kicker (200ms), polyline stroke-dashoffset 1.2s ease-out (400ms), data labels staggered at 100ms intervals. Can be disabled by `prefers-reduced-motion`.

【Design Details]
- **Never**: use chart.js / d3 libraries (unless imported via jsdelivr CDN); recommend hand-written SVG, under 80 lines inline.
- Fonts: Title `Source Serif Pro` or `Cheltenham` (fallback to `Playfair Display`); body `IBM Plex Sans` or `Inter`; data labels `IBM Plex Mono`.
- 1 main color (ink) + 1 accent (choose 1 of 3: NYT red `#a91d1d` / editorial mint `#5fb38a` / warm orange `#d97757`).
- Y-axis has only hairline gridlines + 3-4 ticks, with labels in mono font outside the axis.
- Strictly forbidden: fullscreen gridlines, shadows, 3D metric cylinders; emojis are banned.
- Must use the actual data provided by the user. If the input is a textual conclusion, automatically estimate reasonable coordinates (but annotate with "schematic"); if it is CSV/JSON, plot directly.
- Single-file HTML; annotation format beside data point: `<text class="annot">2024 · 412M</text>`.
