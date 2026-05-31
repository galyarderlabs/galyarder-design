---
name: ppt-keynote
en_name: "Keynote-style Slides"
emoji: "🎬"
description: "Apple Keynote-quality slides, one card per screen, with keyboard left/right navigation."
en_description: "Apple Keynote-quality slides, one card per screen, with keyboard left/right navigation."
category: slides
scenario: marketing
aspect_hint: "16:9 (1280×720)"
featured: 19
tags: ["slides", "deck", "presentation", "keynote"]
example_id: sample-ppt-html-anything
example_name: "Keynote PPT · Product Overview"
example_format: markdown
example_tagline: "Tell the product story in 7 slides"
example_desc: "Apple Keynote-style product walkthrough with ←/→ navigation"
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
  example_prompt: "Use the Keynote-style Slides template to turn my content into Apple Keynote-quality slides with one card per screen and keyboard left/right navigation. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Keynote-style Slides]
- Each slide is a `<section class="slide">`, 1280 wide and 720 tall, centered, with a gradient background.
- Keep each slide minimal: a hero headline plus 1-3 supporting lines, or a single chart, or a punchline.
- Type scale: headline `text-7xl font-semibold tracking-tight`, subhead `text-2xl text-neutral-500`.
- The first slide is a cover (topic + speaker / date); the last slide is "Thanks." or a call to action.
- Top-right indicator showing current page / total pages.
- Add a small JavaScript handler for ArrowLeft / ArrowRight / Space to advance slides; keep a hash in sync (#/3).
- Use a fade-in transition between slides.
- Keep generous whitespace, align data cards on a grid, and stay restrained with color.
