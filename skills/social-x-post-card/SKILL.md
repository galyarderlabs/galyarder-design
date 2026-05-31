---
name: social-x-post-card
emoji: "𝕏"
description: "Realistic X (Twitter) post card + interactive metrics (likes, reposts, views), ideal for video overlays or social sharing"
category: card
scenario: marketing
featured: 44
tags: ["twitter", "x", "social", "card", "overlay"]
example_id: sample-social-x-post-card
example_format: markdown
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · x-post"
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
    Use the "X (Twitter) Post Card" template to turn my content into "Realistic X (Twitter) post card + interactive metrics (likes, reposts, views), ideal for video overlays or social sharing". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: X (Twitter) Post Card]
【Intent] Render a tweet's content (or user's golden quote) into a highly realistic X post card, suitable for video overlays, Twitter posts, and knowledge archiving. Inspired by hyperframes x-post.

【Canvas] 1280×720 or 1080×1080, dark background `#0f1419` or light background `#ffffff` (based on X theme); card Centered with soft shadows.

【Card Structure]
- Frame: Rounded corners 16px, 1px border `#2f3336` (dark) / `#eff3f4` (light), padding 16px.
- Top row: Avatar (48×48 circle, placeholder using CSS gradient) + username + handle `@username` + verified blue checkmark + time (mono, 12px, gray).
- Body: 17-22px, font-weight 400; links use X blue `#1d9bf0`; hashtag same color; mention same color; 0.6em space between paragraphs.
- Optional: quote card (embedded small card, gray background, 12px border radius).
- Optional: 1 image (CSS gradient + descriptive placeholder, no external image links), 16:9 ratio, 12px border radius.
- Interaction row: 4 icons + metrics (reply / retweet / quote / like), icons use inline SVG (X official style), gray, changes color on hover.
- Top-right X logo as single-stroke SVG.
- View count row: 👁️ + number (small text).

【Typography]
- Western: `Chirp` (X font) → fallback `Inter` or `Segoe UI`.
- Chinese: `Noto Sans SC` / `PingFang SC`.
- Numbers: Same as main font, do not use mono.

【Design Details]
- Color scheme light: bg `#fff`, text `#0f1419`, secondary `#536471`, border `#eff3f4`, accent `#1d9bf0`.
- Color scheme dark (recommended, for video overlay): bg `#000`, text `#e7e9ea`, secondary `#71767b`, border `#2f3336`, accent `#1d9bf0`.
- Number formatting: 1.2K / 4.5M (do not use raw 1234).
- Content must come from user inputs; do not fabricate tweets.
- If user input is data → automatically synthesize it into a "golden quote" tweet (≤ 280 characters).
- Single-file HTML; inline SVG icons; do not include any external image URLs.
- Optional: add subtle radial gradient background `radial-gradient(...)` to enhance video overlay readability.
