---
name: ppt-keynote
emoji: "🎬"
description: "Apple Keynote-grade slides, structured one-screen-per-card with standard keyboard navigation"
category: slides
scenario: marketing
featured: 19
tags: ["slides", "deck", "presentation", "slides", "presentation"]
example_id: sample-ppt-html-anything
example_format: markdown
od:
  mode: deck
  surface: web
  scenario: marketing
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "Keynote-Style PPT" template to turn my content into "Apple Keynote-grade slides, structured one-screen-per-card with standard keyboard navigation". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Keynote-Style PPT]
- Each slide is a `<section class="slide">`, overall width 1280 height 720, displayed Centered, with a gradient background.
- Ultra-minimalist single page: Large Title + 1-3 lines of supporting text; or a data chart; or a golden quote.
- Font size: Title `text-7xl font-semibold tracking-tight`, subtitle `text-2xl text-neutral-500`.
- Slide 1 is the cover (topic + presenter / date), and the last slide is "Thanks." or a call to action.
- Small indicator in the top-right corner: Current Page / Total Pages.
- Add a piece of JavaScript listening to ArrowLeft / ArrowRight / Space key to switch slides; also maintain hash (#/3).
- Use fade-in animation between pages.
- Maintain generous negative space, align data cards with grid layouts, and keep colors restrained.
