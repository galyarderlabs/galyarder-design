---
name: frame-liquid-bg-hero
emoji: "🌊"
description: "WebGL-powered fluid displacement background + overlayed golden quote, perfect for video intros, landing hero sections, or posters"
category: poster
scenario: video
featured: 39
tags: ["liquid", "fluid", "background", "hero", "html-in-canvas", "vfx"]
example_id: sample-frame-liquid-bg-hero
example_format: markdown
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · vfx-liquid-background"
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
    Use the "Fluid Background Hero Frame" template to turn my content into "WebGL-powered fluid displacement background + overlayed golden quote, perfect for video intros, landing hero sections, or posters". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Fluid Background Hero]
【Intent] Can be used as a video intro frame, SaaS landing top hero, or poster base. WebGL fluid feel, but degraded to CSS / canvas drawing to ensure the single file can be opened by double-clicking. Inspired by hyperframes vfx-liquid-background.

[Canvas] 1920×1080 (horizontal) or 1080×1920 (vertical), pick one; background fills the canvas.

【Fluid Background — 3 implementations, select based on user preference]
1. **CSS multi-layered radial-gradient offset breath** (most stable, default recommendation):
   - 3-5 large elliptical `radial-gradient(...)` patterns, with colors selected from the palette.
   - Each ellipse is nested in a `@keyframes` translation + scale + hue-rotate, cycle 8-14s, staggered; the entire screen overlays `mix-blend-mode: screen` or `overlay`.
   - Add a top layer with `backdrop-filter: blur(80px)` to make the edges smoother and more diffused.
2. **Canvas + simple Perlin noise** (intermediate):
   - 80 lines inline JS, using `requestAnimationFrame` to draw metaballs or simplex noise field.
   - Enabled when performance permits; falls back to static screenshot if `prefers-reduced-motion` is active.
3. **WebGL fragment shader** (advanced, use with caution):
   - Use jsdelivr CDN to import `regl` or inline plain WebGL.
   - Shader implements domain-warp noise; single quad, one uniform `u_time`.

【Top Text Layer]
- Centered or bottom-left: a single giant golden quote (5-7vw, serif or bold sans), font: `Source Serif Pro` / `Inter Tight` / `Manrope Black`.
- Text color uses paper white `#fafaf8` or ink, depending on background brightness; add `mix-blend-mode: difference` to keep it readable on any fluid color.
- Subtitle (small sans, opacity 0.7) in a single line.
- Optional bottom CTA chip or hairline + metadata row.

【Color Palette — Choose 1 of 4, no rainbow gradients]
- 🌅 **Solar Peach** — `#ffb18a` + `#f78b4c` + `#d97757`, Solar Peach.
- 🌊 **Ocean Aqua** — `#5ac8fa` + `#0a84ff` + `#1e3a8a`, Ocean Aqua.
- 🌌 **Aurora Violet** — `#a78bfa` + `#7c5cff` + `#1e1b4b`, Aurora Violet.
- 🌿 **Forest Mint** — `#86efac` + `#34d399` + `#065f46`, Forest Mint.

【Design Details]
- Strictly forbidden: multicolor rainbow grids (>4 hues), PowerPoint gradients, and neon/fluorescent overlays.
- Fonts: Chinese uses `Noto Serif SC` (display) / `Noto Sans SC` (subtitle).
- External image links are strictly forbidden; utilize entirely CSS + SVG + optional canvas.
- Must use user-provided golden quote / title; if user input is raw data → synthesize a golden quote of ≤ 18 characters.
- Single-file HTML; motion effects can be disabled by `prefers-reduced-motion`.
