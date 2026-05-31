---
name: social-spotify-card
emoji: "🎵"
description: "Spotify Now Playing style card: album art + progress bar + playback controls, perfect for video overlays or personal homepages"
category: card
scenario: personal
featured: 43
tags: ["spotify", "music", "now-playing", "card", "overlay"]
example_id: sample-social-spotify-card
example_format: markdown
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · spotify-card"
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: personal
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "Spotify Now Playing Card" template to turn my content into "Spotify Now Playing style card: album art + progress bar + playback controls, perfect for video overlays or personal homepages". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Spotify Now-Playing Card]
【Intent] Render a song, podcast, or personal intro into a Spotify Now Playing card, perfect for video overlay / personal about page / creator hero. Inspired by hyperframes spotify-card.

【Canvas] Two dimensions:
- Landscape video overlay: 1280×720, card centered or floating bottom-left.
- Compact landscape widget: 600×200, can be embedded into any hero slide.

【Card Structure]
- Frame: Rounded corners 12-16px; bg using dark gradients extracted from album cover color (e.g. `linear-gradient(135deg, #1e3264 0%, #0d1f3d 100%)`) or classic Spotify `#121212`; features 1px subtle border on edge.
- Left: **Album Cover** (CSS gradient + large monogram or abstract geometric depiction, cannot link external images), rounded corners 6px, 60-200px square.
- Right:
  - Top `NOW PLAYING` (uppercase letterspace 0.14em, 11px, green `#1DB954`).
  - **Song Title / Title** (Inter / Spotify Circular, 22-28px, weight 700, white).
  - **Artist / Subtitle** (16px, weight 400, opacity 0.7).
  - Progress bar: 4px high, rounded corners, gray background + white fill (`width: 38%`); timestamp on both ends `1:24 / 3:42` (mono, 11px, gray).
  - Control Row: ⏮ ⏯ ⏭ icons (inline SVG, 24px, white fill), smaller shuffle / repeat icons.
- Top-right: Spotify logo (inline SVG, green `#1DB954` circle + three white waves).
- Optional: micro-soundwave animation bottom-right (3-bar `@keyframes`).

【Typography]
- Main: `Spotify Circular` → fallback `Inter` / `Inter Tight`, weight 400 / 700.
- Numbers: Same as main font, avoid excessive mono.

【Design Details]
- Spotify classic dark mode: `#121212` bg, `#1DB954` accent, `#b3b3b3` secondary text.
- If the user input is text/title → treat "Title" as the song name, "Subtitle/Author" as the artist, and default estimated "duration" to 3:42.
- If the user input is music-related → map directly.
- External image links are strictly prohibited; covers must use CSS gradients + text logos / geometric rendering.
- Micro-animation: soundwave animation using `@keyframes`, can be disabled by `prefers-reduced-motion`.
- Single-file HTML.
