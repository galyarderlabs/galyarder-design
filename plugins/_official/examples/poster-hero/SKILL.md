---
name: poster-hero
en_name: "Marketing Poster"
emoji: "🖼️"
description: "Vertical poster or social-share image with strong visual impact."
en_description: "Vertical poster or social-share image with strong visual impact."
category: poster
scenario: marketing
aspect_hint: "1080×1920 vertical"
tags: ["poster", "social poster", "share image"]
example_id: sample-poster-launch
example_name: "Marketing Poster · Product Launch"
example_format: markdown
example_tagline: "9:16 social share image"
example_desc: "High-contrast launch poster with QR placeholder, gradient mesh, and noise texture"
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
  example_prompt: "Use the Marketing Poster template to turn my content into a vertical poster or social-share image with strong visual impact. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Marketing Poster]
- Container `w-[1080px] h-[1920px] mx-auto`, full-bleed gradient / mesh background.
- Top 30% breathing room with one large emoji or abstract geometric shape.
- Middle: hero headline at the visual center (text-8xl, font-black) plus a one-line subhead.
- Lower information card: 3-5 core points, each an icon + short line.
- Bottom-right: brand mark / QR code (use an SVG placeholder).
- Use bold color: gradient backgrounds (e.g. from-violet-500 via-fuchsia-500 to-indigo-500) with white text plus one accent for emphasis.
- Use SVG decorative elements (circles / triangles / waves / noise textures).
