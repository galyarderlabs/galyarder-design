---
name: poster-hero
emoji: "🖼️"
description: "Vertical poster / social share cards designed with high visual impact"
category: poster
scenario: marketing
tags: ["poster", "poster", "moments"]
example_id: sample-poster-launch
example_format: markdown
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "Marketing Poster" template to turn my content into "Vertical poster / social share cards designed with high visual impact". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Marketing Poster]
- Container `w-[1080px] h-[1920px] mx-auto`, fullscreen gradient / mesh background.
- Top 30% negative space + a large emoji or abstract geometric graphic.
- Central main title dominates the visual focus (text-8xl, font-black), with a single-line subtitle.
- Bottom info card: 3-5 core points using icons + concise sentences.
- Bottom-right features brand / QR code (using SVG placeholder).
- Use bold colors: gradient background (like from-violet-500 via-fuchsia-500 to-indigo-500), white text + 1 contrast color highlight.
- Use SVGs for decorative elements (circles / triangles / waves / noise textures).
