---
name: social-reddit-card
en_name: "Reddit Post Card"
emoji: "🔺"
description: "Realistic Reddit post card with vote rail and comment count, suited to video overlays or story sharing."
en_description: "Realistic Reddit post card with vote rail and comment count, suited to video overlays or story sharing."
category: card
scenario: marketing
aspect_hint: "1280×720 or 800×600"
featured: 42
tags: ["reddit", "social", "card", "overlay", "story"]
example_id: sample-social-reddit-card
example_name: "Reddit post · r/programming"
example_format: markdown
example_tagline: "Reddit dark mode + vote rail"
example_desc: "An AITA-style story with 12.3k upvotes + 1.2k comments"
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
  example_prompt: "Use the Reddit Post Card template to turn my content into a realistic Reddit post card with vote rail and comment count for a video overlay or story share. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Reddit Post Card]
[Intent] Render a story / question / one-liner as a Reddit-style post card for video overlays and social-story shares. Inspired by hyperframes reddit-post.

[Canvas] 1280×720 (video overlay) or 800×600 (single-card share); transparent background or dark `#0b1416`.

[Card structure]
- Outer frame: 16px corner radius, light `#ffffff` or dark `#1a1a1b` (recommended for video overlay), 1px border `#edeff1` (light) / `#343536` (dark).
- Left **vote rail** (40-56px wide):
  - Up arrow ▲ (16px, `#878a8c`, hover orange `#ff4500`).
  - Vote count (Inter, 17px, weight 700, centered, color: 0 gray / positive orange / negative blue); large numbers use `12.3k` formatting.
  - Down arrow ▼ (hover blue `#7193ff`).
- Body area:
  - Top meta row: subreddit icon (CSS round + letter) + `r/subreddit` (bold) + `· Posted by u/username · 3h` (small, gray).
  - **Title** (Inter / IBM Plex Sans, 22-28px, weight 500, dark text).
  - Body: 16px text, blockquote, or one image (CSS gradient placeholder).
  - Bottom action row: 💬 `1.2k Comments` · 🏆 Awards · ⤴️ Share · ⋯ icon.
- Top-right Reddit Snoo logo (inline SVG, orange `#ff4500`).

[Typography]
- Primary: `IBM Plex Sans` → fallback `Inter`, weight 400/500/700.
- Numbers: same primary face.
- CJK: `Noto Sans SC`.

[Design notes]
- Light mode: bg `#fff`, text `#1c1c1c`, secondary `#7c7c7c`.
- Dark mode (recommended): bg `#1a1a1b`, text `#d7dadc`, secondary `#818384`, border `#343536`.
- Vote color: positive `#ff4500`, negative `#7193ff`, zero `#878a8c`.
- Title click-target may use a subtle hover background.
- No external image URLs allowed; use CSS gradients + descriptive captions for image slots.
- Use the user's content; auto-generate plausible subreddit / username / vote counts.
- Single-file HTML; inline SVG icons (up/down arrow, comment bubble, trophy).
