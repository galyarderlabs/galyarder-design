---
name: social-spotify-card
en_name: "Spotify Now-Playing Card"
emoji: "🎵"
description: "Spotify Now Playing-style card with album art, progress bar, and playback controls, suited to video overlays or personal homepages."
en_description: "Spotify Now Playing-style card with album art, progress bar, and playback controls, suited to video overlays or personal homepages."
category: card
scenario: personal
aspect_hint: "1280×720 or 600×200"
featured: 43
tags: ["spotify", "music", "now-playing", "card", "overlay"]
example_id: sample-social-spotify-card
example_name: "Spotify Now Playing · Lo-Fi"
example_format: markdown
example_tagline: "Classic Spotify dark card"
example_desc: "Lo-Fi Beats · Chillhop progress 1:24 / 3:42 + control row"
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
  example_prompt: "Use the Spotify Now-Playing Card template to turn my content into a Spotify Now Playing-style card with album art, progress bar, and playback controls for a video overlay or personal homepage. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Spotify Now-Playing Card]
[Intent] Render a track, podcast, or short personal intro as a Spotify-style now-playing card — for video overlays, personal about pages, or creator hero modules. Inspired by hyperframes spotify-card.

[Canvas] Two sizes:
- Wide video overlay: 1280×720, card centered or floating in the bottom-left.
- Compact widget bar: 600×200, embedable inside any hero block.

[Card structure]
- Outer frame: 12-16px corner radius; bg uses a dark gradient sampled from the album art (e.g. `linear-gradient(135deg, #1e3264 0%, #0d1f3d 100%)`) or classic Spotify `#121212`; 1px subtle border at the edges.
- Left: **album cover** (CSS gradient + a large monogram or abstract geometric mark — never an external image), 6px rounded square, 60-200px on a side.
- Right:
  - Top label `NOW PLAYING` (uppercase, letter-spacing 0.14em, 11px, green `#1DB954`).
  - **Track title** (Inter / Spotify Circular, 22-28px, weight 700, white).
  - **Artist / subtitle** (16px, weight 400, opacity 0.7).
  - Progress bar: 4px tall, rounded, gray track + white fill (`width: 38%`); time stamps on each end `1:24 / 3:42` (mono, 11px, gray).
  - Control row: ⏮ ⏯ ⏭ icons (inline SVG, 24px, white fill); shuffle / repeat icons smaller.
- Top-right Spotify logo (inline SVG, green `#1DB954` circle + three white waves).
- Optional: a small audio-wave indicator in the bottom-right (3 bars on `@keyframes`).

[Typography]
- Primary: `Spotify Circular` → fallback `Inter` / `Inter Tight`, weight 400 / 700.
- Numbers: same primary face; do not lean heavily on mono.

[Design notes]
- Spotify classic dark mode: `#121212` background, `#1DB954` accent, `#b3b3b3` secondary text.
- If the user provides text/headline → treat the headline as the track title, the subtitle/author as the artist, and default duration to 3:42.
- If the user provides music-related content → map directly.
- No external image URLs; album art must use CSS gradients + a text logo / geometric mark.
- Subtle motion: the audio-wave indicator uses `@keyframes` and honors `prefers-reduced-motion`.
- Single-file HTML.
