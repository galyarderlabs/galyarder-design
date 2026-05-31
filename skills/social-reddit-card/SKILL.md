---
name: social-reddit-card
emoji: "🔺"
description: "Realistic Reddit post card + upvote/downvote actions + comment counter, ideal for video overlays or story sharing"
category: card
scenario: marketing
featured: 42
tags: ["reddit", "social", "card", "overlay", "story"]
example_id: sample-social-reddit-card
example_format: markdown
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · reddit-post"
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
    Use the "Reddit Post Card" template to turn my content into "Realistic Reddit post card + upvote/downvote actions + comment counter, ideal for video overlays or story sharing". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Reddit Post Card]
【Intent] Render a story / question / joke into a Reddit post card, suitable for video overlays and social media story sharing. Inspired by reddit-post.

[Canvas] 1280×720 (video overlay) or 800×600 (single-card share); transparent or dark background `#0b1416`.

【Card Structure]
- Frame: Rounded corners 16px, bg white `#ffffff` (light) or `#1a1a1b` (dark, recommended for video overlay), border 1px `#edeff1` / `#343536`.
- Left **vote rail** (40-56px wide):
  - Up arrow ▲ (16px, `#878a8c`, hover turns orange `#ff4500`).
  - Vote count (Inter, 17px, weight 700, Centered, color: 0 gray / positive orange / negative blue); large numbers in `12.3k` format.
  - Down arrow ▼ (hover turns blue `#7193ff`).
- Main Content Area:
  - Top meta row: Subreddit icon (CSS circle + letter) + `r/subreddit` (bold) + `· Posted by u/username · 3h` (small gray text).
  - **Title** (Inter / IBM Plex Sans, 22-28px, weight 500, dark text).
  - Content: 16px body, blockquote, or 1 image (CSS gradient placeholder).
  - Bottom action row: 💬 `1.2k Comments` · 🏆 Awards · ⤴️ Share · ⋯ icon。
- Top-right: Reddit Snoo logo (inline SVG, orange `#ff4500`).

【Typography]
- Primary: `IBM Plex Sans` → fallback `Inter`, weight 400/500/700.
- Numbers: Same as main font.
- Chinese: `Noto Sans SC`.

【Design Details]
- Light mode: bg `#fff`, text `#1c1c1c`, secondary `#7c7c7c`。
- Dark mode (recommended): bg `#1a1a1b`, text `#d7dadc`, secondary `#818384`, border `#343536`.
- Vote color: positive = `#ff4500`, negative = `#7193ff`, 0 = `#878a8c`.
- Title click area can feature a subtle background hover.
- External image links are strictly prohibited; utilize CSS gradients + descriptions for image placeholders.
- Must use content provided by the user; automatically generate appropriate subreddit / username / vote count.
- Single-file HTML; icons as inline SVG (up/down arrows, comment bubbles, trophies).
