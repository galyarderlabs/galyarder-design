---
name: card-xiaohongshu
zh_name: "RedNote (xiaohongshu) Card"
en_name: "RedNote (xiaohongshu) Card"
emoji: "📱"
description: "RedNote (xiaohongshu)-style knowledge cards, arranged as a swipeable multi-card carousel."
zh_description: "RedNote (xiaohongshu)-style knowledge cards arranged as a swipeable multi-card carousel."
en_description: "RedNote (xiaohongshu)-style knowledge cards, arranged as a swipeable multi-card carousel."
category: card
scenario: marketing
aspect_hint: "1080×1440 (3:4)"
featured: 24
tags: ["xhs", "rednote", "carousel", "social"]
example_id: sample-xhs-ai-habits
example_name: "RedNote Card — AI Tool Habits"
example_format: markdown
example_tagline: "7-card sequence in soft Morandi gradients"
example_desc: "A bundle of tip cards, ready to screenshot and post to RedNote or share with friends"
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
  example_prompt: "Use the RedNote (xiaohongshu) Card template to turn my content into a RedNote-style swipeable knowledge-card carousel. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the RedNote (xiaohongshu) Card template to turn my content into a RedNote-style swipeable knowledge-card carousel. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: RedNote (xiaohongshu) Card]
- Output a sequence of N cards, each `w-[1080px] h-[1440px]`, stacked vertically with flex so users can screenshot the whole stack or any single card. N is determined by the volume of [user content]: short content starts at 3-6 cards; longer content uses more (RedNote allows up to 18 images per post, though 9 or fewer usually works best); each card carries exactly one core idea.
- The first card is the cover: a large title + a one-line subtitle + a hook label (something like "Must-read" or "Save this").
- The middle cards expand the body, one core idea per card, paired with an emoji + short sentence + 1-2 examples.
- The final card delivers a summary plus a call to action (follow / save / comment).
- Color: choose soft Morandi or pink palettes; keep elements rounded with generous whitespace.
- Use large type, generous line-height, and high contrast (RedNote is read on a phone — small text disappears).
- Add a small watermark (author name / date) in the bottom-right corner of every card.
