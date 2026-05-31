---
name: frame-liquid-bg-hero
zh_name: "Liquid Background Hero"
en_name: "Liquid Background Hero"
emoji: "🌊"
description: "WebGL-style fluid displacement background with a quote overlay, suited to video intros, landing heroes, or posters."
zh_description: "WebGL-style fluid displacement background + overlay pull-quote, fits video intros / landing heroes / posters."
en_description: "WebGL-style fluid displacement background with a quote overlay, suited to video intros, landing heroes, or posters."
category: poster
scenario: video
aspect_hint: "1920×1080 (16:9) or 1080×1920 (9:16)"
featured: 39
tags: ["liquid", "fluid", "background", "hero", "html-in-canvas", "vfx"]
example_id: sample-frame-liquid-bg-hero
example_name: "Liquid Background Hero — Pull Quote"
example_format: markdown
example_tagline: "Aurora Violet fluid"
example_desc: "Multi-layer radial-gradient breathing background + difference-blend text"
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
  example_prompt: "Use the Liquid Background Hero template to turn my content into a WebGL-style fluid displacement background with a quote overlay for a video intro, landing hero, or poster. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Liquid Background Hero template to turn my content into a WebGL-style fluid displacement background with a quote overlay for a video intro, landing hero, or poster. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Liquid Background Hero]
[Intent] Works as a video intro frame, top hero of a SaaS landing page, or poster background. WebGL fluid feel, but rendered with CSS / canvas fallbacks so the single file always opens with a double click. Inspired by hyperframes vfx-liquid-background.

[Canvas] 1920×1080 (landscape) or 1080×1920 (portrait). Background fills the canvas.

[Liquid background — 3 implementations, choose by user preference]
1. **Multi-layer CSS radial-gradient breathing** (most stable, default recommendation):
   - 3-5 large ellipses `radial-gradient(...)` using palette colors.
   - Each ellipse uses `@keyframes` to translate + scale + hue-rotate over 8-14s, staggered; the whole frame uses `mix-blend-mode: screen` or `overlay`.
   - Top layer adds `backdrop-filter: blur(80px)` to soften the edges further.
2. **Canvas + simple Perlin noise** (intermediate):
   - 80 lines of inline JS using `requestAnimationFrame` to draw metaballs or a simplex-noise field.
   - Enable when performance allows; fall back to a static still under `prefers-reduced-motion`.
3. **WebGL fragment shader** (advanced, use sparingly):
   - Pull `regl` from jsdelivr CDN or write plain WebGL inline.
   - Shader: domain-warp noise; one quad, one `u_time` uniform.

[Top text layer]
- Centered or lower-left: an oversized pull quote (5-7vw, serif or heavy sans), font: `Source Serif Pro` / `Inter Tight` / `Manrope Black`.
- Type color: paper white `#fafaf8` or ink, depending on background brightness; apply `mix-blend-mode: difference` so it stays legible across any fluid color.
- Subtitle (small sans, opacity 0.7), one line.
- Optional CTA chip or hairline + metadata row at the bottom.

[Palettes — pick 1 of 4, no rainbows]
- 🌅 **Solar Peach** — `#ffb18a` + `#f78b4c` + `#d97757`, warm peach-orange.
- 🌊 **Ocean Aqua** — `#5ac8fa` + `#0a84ff` + `#1e3a8a`, ocean blue.
- 🌌 **Aurora Violet** — `#a78bfa` + `#7c5cff` + `#1e1b4b`, aurora violet.
- 🌿 **Forest Mint** — `#86efac` + `#34d399` + `#065f46`, mossy forest.

[Design rules]
- Forbidden: rainbow palettes (>4 hues), PowerPoint-style gradients, neon overlays.
- No external image links; everything CSS + SVG + optional canvas.
- Use the user's quote / title; if the input is data, distill a one-liner of ≤ 60 characters.
- Single-file HTML, animation disabled by `prefers-reduced-motion`.
