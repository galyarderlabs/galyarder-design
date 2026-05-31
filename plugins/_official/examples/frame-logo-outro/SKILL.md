---
name: frame-logo-outro
zh_name: "Logo Outro Frame"
en_name: "Logo Outro Frame"
emoji: "🎬"
description: "Segmented logo assembly, glow bloom, and tagline reveal for video outros or brand closing frames."
zh_description: "Logo segmented-assembly entrance + glow bloom + tagline reveal — for video outros or brand closing frames."
en_description: "Segmented logo assembly, glow bloom, and tagline reveal for video outros or brand closing frames."
category: video
scenario: video
aspect_hint: "1920×1080 (16:9)"
featured: 40
recommended: 8
tags: ["logo", "outro", "branding", "end-card", "frame"]
example_id: sample-frame-logo-outro
example_name: "Logo Outro — HTML Anything"
example_format: markdown
example_tagline: "Midnight Indigo + glow bloom"
example_desc: "Logo assembly + brand name + tagline + CTA, made for video outros"
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · logo-outro"
od:
  mode: video
  surface: video
  scenario: video
  featured: 0.16
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: "Use the Logo Outro Frame template to turn my content into a video outro or brand closing frame with segmented logo assembly, glow bloom, and tagline reveal. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Logo Outro Frame template to turn my content into a video outro or brand closing frame with segmented logo assembly, glow bloom, and tagline reveal. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Logo Outro Frame]
[Intent] End-of-video brand reveal frame — logo segments assemble, glow bloom, tagline rises, CTA appears. Inspired by hyperframes logo-outro.

[Canvas] 1920×1080, black `#08090c` or a deep brand background; add a subtle vignette `radial-gradient(...)` so the center reads brighter.

[Layout]
- **Center logo**: drawn with CSS / inline SVG, composed of 4-8 geometric pieces (circle / square / triangle / hairline).
  - Entry animation: each piece slides in from off-screen (±100px in different directions) + scale 1.4→1.0 + opacity 0→1, staggered 80ms; total duration 1.2s.
  - After assembly, the logo gets a glow bloom: `filter: drop-shadow(0 0 24px <accent>40)`; simultaneously a shimmer `mask-image` sweeps across the logo (500ms).
- **Brand name**: 6-8% below the logo, large type (Inter Tight / SF Pro Display, 48-72px, weight 700, letter-spacing -0.02em), entry: typewriter or fade-up after the logo bloom (starts at 1.4s).
- **Tagline**: one line under the brand name (24-28px, weight 400, opacity 0.7), fades in (1.8s).
- **Bottom CTA + metadata**: a two-row strip at the foot, e.g. `htmlanything.dev · @htmlanything · 2026`, 11px uppercase letter-spacing 0.16em, color opacity 0.4, separated by hairlines.

[Palettes — pick 1 of 4, never mix]
- 🌌 **Midnight Indigo** — bg `#08090c`, accent `#7c5cff` (neon violet glow).
- 🌅 **Solar Amber** — bg `#0e0a08`, accent `#ffb547` (warm amber).
- 🌿 **Forest Mint** — bg `#0a1410`, accent `#5fb38a` (mint green).
- ⚪ **Bone & Ink** — bg `#f1efea`, accent `#0a0a0b` (no neon; editorial mood; replace glow with shadow).

[Design rules]
- **Forbidden**: external logo images; the logo must be drawn with pure CSS / inline SVG geometry.
- Entry animations use `@keyframes` + `animation-delay`; disable under `prefers-reduced-motion`.
- Fonts: Latin `Inter Tight` / `SF Pro Display` / `Manrope`.
- Use the user's brand name + tagline; if none is provided, fall back to "HTML Anything" / "Anything → beautiful HTML".
- Single-file HTML; the whole animation freezes once it completes (no loop — this is a video closing frame).
- Optional 5px ribbon (accent color) at the top for extra brand recognition.
