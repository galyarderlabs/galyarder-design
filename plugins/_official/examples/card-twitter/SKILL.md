---
name: card-twitter
zh_name: "Twitter Share Card"
en_name: "Twitter Share Card"
emoji: "🐦"
description: "Twitter quote or data card designed to pair with a post."
zh_description: "Twitter quote or data card designed to pair with a post."
en_description: "Twitter quote or data card designed to pair with a post."
category: card
scenario: marketing
aspect_hint: "1600×900 (16:9)"
tags: ["twitter", "x", "quote", "pull-quote"]
example_id: sample-twitter-quote
example_name: "Twitter Card — Pull Quote"
example_format: text
example_tagline: "16:9 dark pull-quote card; screenshot it and post directly to Twitter"
example_desc: "High-contrast pull-quote template with grid lines and a soft gradient glow background"
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
  example_prompt: "Use the Twitter Share Card template to turn my content into a Twitter quote or data card designed to pair with a post. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Twitter Share Card template to turn my content into a Twitter quote or data card designed to pair with a post. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Twitter Share Card]
- Container `w-[1600px] h-[900px]`, dark or light theme based on the content's mood.
- A single hero pull quote (text-6xl, font-semibold, capped at 2-3 lines) centered on the canvas.
- Author byline + avatar placeholder + handle below the quote.
- Small label in the top-left corner (kind: "Insight" / "Data" / "Quote").
- Brand watermark in the bottom-right corner.
- Subtle texture across the whole card (grid lines, noise, or dot pattern).
- Once screenshotted, the card pairs directly with a tweet — clean and impactful.
