---
name: frame-logo-outro
emoji: "🎬"
description: "Segmented logo assembly entrance + glow bloom effect + tagline reveal, perfect for video outros or brand closures"
category: video
scenario: video
featured: 40
recommended: 8
tags: ["logo", "outro", "branding", "end-card", "frame"]
example_id: sample-frame-logo-outro
example_format: markdown
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
  example_prompt: >-
    Use the "Brand Logo Outro Frame" template to turn my content into "Segmented logo assembly entrance + glow bloom effect + tagline reveal, perfect for video outros or brand closures". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Logo Outro (Logo Outro)]
【Intent] Brand reveal frame at the end of the video — logo assembled in blocks + glow bloom + tagline floating up + CTA. Inspired by hyperframes logo-outro.

【Canvas] 1920×1080, black `#08090c` or brand dark background; add subtle vignette `radial-gradient(...)` to make the center brighter.

【Layout]
- **Center Logo**: Drawn using CSS / inline SVG; composed of 4-8 geometric blocks (circle / square / triangle / hairline).
  - Entrance animation: Each block slides in from off-screen (±100px different directions) + scale 1.4→1.0 + opacity 0→1, staggered by 80ms; total duration 1.2s.
  - After entrance is complete, apply a glow bloom to the entire logo: `filter: drop-shadow(0 0 24px <accent>40)`; simultaneously sweep a shimmer `mask-image` across the logo (500ms).
- **Brand Name**: Located at 6-8% below the logo, large text (Inter Tight / SF Pro Display, 48-72px, weight 700, letter-spacing -0.02em), entrance: typewriter or fade-up after logo bloom (starting at 1.4s).
- **Tagline**: Single line below the brand name (24-28px, weight 400, opacity 0.7), fade in (1.8s).
- **Bottom CTA + Metadata**: Dual-line bottom row, e.g. `htmlanything.dev · @htmlanything · 2026`, 11px uppercase letter-spacing 0.16em, color opacity 0.4, hairline.

【Color Palette — Choose 1 of 4, do not mix]
- 🌌 **Midnight Indigo** — bg `#08090c`, accent `#7c5cff` (neon purple-blue glow).
- 🌅 **Solar Amber** — bg `#0e0a08`, accent `#ffb547` (Warm Amber).
- 🌿 **Forest Mint** — bg `#0a1410`, accent `#5fb38a` (Mint Green).
- ⚪ **Bone & Ink** — bg `#f1efea`, accent `#0a0a0b` (no neon, editorial style, glow replaced with shadow).

【Design Details]
- **Never**: use external logo image links; logos must be drawn entirely via CSS / inline SVG geometry.
- Entrance animation uses `@keyframes` + `animation-delay`; can be disabled by `prefers-reduced-motion`.
- Fonts: Western `Inter Tight` / `SF Pro Display` / `Manrope`; Chinese `Noto Sans SC` weight 700.
- Must use user-provided brand name + tagline; if not available, run fallback "HTML Anything" / "Anything → beautiful HTML".
- Single-file HTML; freeze the animation once completed (do not loop, as this is the final frame of the video).
- Optional 5px top ribbon (accent color) to enhance brand identity.
