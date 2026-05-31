---
name: card-twitter
emoji: "🐦"
description: "Twitter golden quotes / data cards, perfect for attaching to tweets"
category: card
scenario: marketing
tags: ["twitter", "x", "quote", "quote"]
example_id: sample-twitter-quote
example_format: text
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
    Use the "Twitter Share Card" template to turn my content into "Twitter golden quotes / data cards, perfect for attaching to tweets". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Twitter Share Card]
- Container `w-[1600px] h-[900px]`, choice of dark / light theme based on content mood.
- A central hero golden quote (text-6xl, font-semibold, limited to 2-3 lines).
- Author signature + avatar placeholder + handle below.
- Top-left small badge (types: "Insight" / "Data" / "Quote").
- Brand watermark in the bottom-right corner.
- The entire card has subtle texturing (grid pattern / noise / dot pattern).
- Can be shared directly with tweets post-screenshot, visually clean and impactful.
