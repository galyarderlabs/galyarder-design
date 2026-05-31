---
name: article-magazine
emoji: "📖"
description: "Huashu / huashu-md-html-inspired magazine article layout for turning Markdown or notes into a polished long-form HTML essay."
category: article
scenario: marketing
featured: 11
tags: ["blog", "essay", "newsletter", "newsletter", "blog", "article"]
example_id: sample-article-trq212-html
example_format: markdown
example_source_url: "https://x.com/trq212/status/2052809885763747935"
example_source_label: "@trq212 / x.com"
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
    Use the 'Magazine Article' template to design my content as a polished long-form HTML essay inspired by the Huashu style for Markdown or notes. Retain the visual signature of the template, use realistic content and data, and avoid any lorem ipsum or placeholder images.
---

[Template: Magazine Article]
- Top Hero: Large Title (text-5xl/6xl) + Optional Subtitle + Author / Reading Time / Date Metadata.
- Body: Single Column, Max width about 700px, Centered. Paragraphs `text-lg leading-relaxed text-neutral-700 dark:text-neutral-300`.
- H2 / H3 headers use serif font, to provide visual contrast.
- Blockquotes use thick left accent  accent border + italic style.
- Code blocks: rounded corners + dark background + light text, showing language tags.
- List items use custom bullet (small squares / accent dots).
- Sections separated by `<hr>`, but styled as a small Centered ornament in the middle.
- Footer includes a simple "If you find this useful, feel free to share" call-to-action card.
