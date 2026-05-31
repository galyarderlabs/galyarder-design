---
name: article-magazine
zh_name: "Magazine Article"
en_name: "Magazine Article"
emoji: "📖"
description: "Huashu / huashu-md-html-inspired magazine article layout for turning Markdown or notes into a polished long-form HTML essay."
zh_description: "Huashu / huashu-md-html-style magazine article layout that turns Markdown or notes into a polished long-form HTML article."
en_description: "Huashu / huashu-md-html-inspired magazine article layout for turning Markdown or notes into a polished long-form HTML essay."
category: article
scenario: marketing
aspect_hint: "A4 / long page"
featured: 11
tags: ["blog", "essay", "newsletter", "publication", "post", "article"]
example_id: sample-article-trq212-html
example_name: "Magazine Article — HTML supersedes Markdown"
example_format: markdown
example_tagline: "Inspired by a tweet from @trq212"
example_desc: "Extended commentary on \"HTML > Markdown in the AI era,\" with the original tweet annotation and clickable links"
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
  example_prompt: "Use the Magazine Article template to turn my content into a Huashu / huashu-md-html-inspired long-form HTML essay. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Magazine Article template to turn my content into a Huashu / huashu-md-html-inspired long-form HTML essay. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Magazine Article]
- Hero header: large title (text-5xl/6xl) + optional subtitle + author / reading-time / date metadata.
- Body: single column, max width around 700px, centered. Paragraphs use `text-lg leading-relaxed text-neutral-700 dark:text-neutral-300`.
- Use a serif font for H2 / H3 headings so the body and headings have visual contrast.
- Blockquotes use a thick accent-colored left rule plus italic text.
- Code blocks: rounded corners, dark background, light text, with the language label shown.
- List items use a custom bullet (small square or accent-colored dot).
- Separate sections with `<hr>`, but style it as a small centered ornament.
- End the article with a simple "If this was useful, please share" call-to-action card.
