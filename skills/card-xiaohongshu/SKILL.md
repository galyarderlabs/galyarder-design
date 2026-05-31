---
name: card-xiaohongshu
emoji: "📱"
description: "Xiaohongshu-style info cards, arrayed side-by-side for swipeable reading"
category: card
scenario: marketing
featured: 24
tags: ["xhs", "xiaohongshu", "carousel", "post"]
example_id: sample-xhs-ai-habits
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
    Use the "Xiaohongshu Graphics Card" template to turn my content into "Xiaohongshu-style info cards, arrayed side-by-side for swipeable reading". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Xiaohongshu Graphics Card]
- Output N consecutive cards, each `w-[1080px] h-[1440px]`, vertically aligned with flex for easy overall or single screenshots. N is determined by [User Content] information volume: 3-6 cards starting for short content, longer content should have more (Xiaohongshu platform allows max 18 images per post, usually under 9 is best); each card carries only one core viewpoint.
- First slide is the cover: massive title + single-line subtitle + an engaging tag (such as "Essential Insights" / "Must Save").
- The middle slides elaborate on the body text; each page features a core point, paired with an emoji + concise sentence + 1-2 examples.
- The final slide is a summary + call to action (follow / save / comment).
- Color scheme: select pastel Morandi or soft pink palettes; rounded elements, generous whitespace.
- Large font size, wide line spacing, strong contrast (Xiaohongshu is viewed on mobile; tiny text is completely illegible).
- Small watermark in the bottom-right corner of each card (Author Name / Date).
