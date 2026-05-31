---
name: social-x-post-card
en_name: "X / Twitter Post Card"
emoji: "𝕏"
description: "Realistic X post card with engagement metrics (likes, reposts, views), suited to video overlays or shareable image cards."
en_description: "Realistic X post card with engagement metrics (likes, reposts, views), suited to video overlays or shareable image cards."
category: card
scenario: marketing
aspect_hint: "1280×720 or 1080×1080"
featured: 44
tags: ["twitter", "x", "social", "card", "overlay"]
example_id: sample-social-x-post-card
example_name: "X post card · pull-quote post"
example_format: markdown
example_tagline: "X dark mode + engagement metrics"
example_desc: "A pull-quote tweet with 12.3K likes / 1.2K reposts and a verified blue check"
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
  example_prompt: "Use the X / Twitter Post Card template to turn my content into a realistic X post card with engagement metrics for a video overlay or shareable image card. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: X (Twitter) Post Card]
[Intent] Render a tweet (or a user-supplied pull quote) as a high-fidelity X post card for video overlays, sharing as an image, or saving as a knowledge artifact. Inspired by hyperframes x-post.

[Canvas] 1280×720 or 1080×1080, dark background `#0f1419` or light background `#ffffff` (per X theme); card centered with a soft drop shadow.

[Card structure]
- Outer frame: 16px border radius, 1px border `#2f3336` (dark) / `#eff3f4` (light), 16px inner padding.
- Top row: avatar (48×48 round, CSS gradient placeholder) + display name + handle `@username` + verified blue check + timestamp (mono, 12px, gray).
- Body: 17-22px, weight 400; links use X blue `#1d9bf0`; hashtags and mentions use the same; paragraphs spaced 0.6em apart.
- Optional: quoted tweet (a smaller nested card on a gray background, 12px radius).
- Optional: one image (CSS gradient + descriptive placeholder — never an external URL), 16:9 ratio, 12px radius.
- Engagement row: 4 icons + numbers (reply / retweet / quote / like), inline SVG icons in X's official style, gray with hover-tinted color.
- Top-right corner: X single-line SVG logo.
- Views row: 👁️ + number (small text).

[Typography]
- Latin: `Chirp` (X's font) → fallback `Inter` or `Segoe UI`.
- CJK: `Noto Sans SC` / `PingFang SC`.
- Numbers: same primary face — do not switch to mono.

[Design notes]
- Light palette: bg `#fff`, text `#0f1419`, secondary `#536471`, border `#eff3f4`, accent `#1d9bf0`.
- Dark palette (recommended for video overlays): bg `#000`, text `#e7e9ea`, secondary `#71767b`, border `#2f3336`, accent `#1d9bf0`.
- Format numbers as 1.2K / 4.5M (not 1234).
- The body must come from user input — never invent tweet content.
- If the user input is data, summarize it into a single pull-quote tweet (≤280 characters).
- Single-file HTML; inline SVG icons; no external image URLs.
- Optional: add a subtle radial highlight `radial-gradient(...)` behind the card to improve readability when overlaid on video.
