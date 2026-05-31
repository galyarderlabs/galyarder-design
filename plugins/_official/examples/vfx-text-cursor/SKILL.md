---
name: vfx-text-cursor
en_name: "VFX Text Cursor"
emoji: "✨"
description: "Cursor light trail, chromatic rays, and directional flares for word-by-word quote reveals in video intros."
en_description: "Cursor light trail, chromatic rays, and directional flares for word-by-word quote reveals in video intros."
category: video
scenario: video
aspect_hint: "1920×1080 (16:9)"
featured: 38
recommended: 7
tags: ["vfx", "text", "cursor", "chromatic", "reveal", "frame"]
example_id: sample-vfx-text-cursor
example_name: "VFX cursor · opening pull-quote"
example_format: markdown
example_tagline: "Word-by-word reveal + chromatic trail"
example_desc: "Hot pink + cyan chromatic cursor typing — a video opener"
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · vfx-text-cursor"
od:
  mode: video
  surface: video
  scenario: video
  featured: 0.15
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: "Use the VFX Text Cursor template to turn my content into a video-intro quote reveal with cursor light trails, chromatic rays, and directional flares. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: VFX Text Cursor]
[Intent] Video opener / hero frame — a cursor types onto the canvas, words reveal one character at a time, and the trail leaves chromatic light streaks plus directional flares. Inspired by hyperframes vfx-text-cursor.

[Canvas] 1920×1080, background `#06070a` matte black or `#0a0d12` (slightly warm/blue), with a subtle vignette.

[Content]
- One pull-quote (any language), centered, font-size 6-8vw, weight 700, font `Inter Tight` / `Source Sans 3` / `Noto Sans SC`.
- Reveal one character at a time, 80ms per character; the current cursor `▍` (or a thin vertical bar) trails the reveal point.
- Already-revealed text defaults to white `#f5f5f7`, opacity 1; the about-to-reveal position gets a chromatic ghost on contact: `text-shadow: 2px 0 #ff3b6f, -2px 0 #00d4ff` for ~200ms before settling back to normal.
- Cursor itself: a 16px-wide rectangle, color = accent (pick one: hot pink `#ff3b6f` / cyan `#00d4ff` / amber `#ffb547`), 1.0s blink keyframe, with a 60-120px motion-blur trail behind it (radial gradient to transparent).

[Flares / rays]
- Near the typing position, randomly spawn 3-5 **directional flares** (light leaks): thin elongated rectangles with `linear-gradient(45deg, transparent, accent20, transparent)` and `mix-blend-mode: screen`, at irregular angles.
- After the final character is typed, sweep a 0.5s shimmer band across the entire line.

[Captions]
- Top caption (uppercase, letter-spacing 0.18em, 11px, opacity 0.5): "FRAME 01 · OPENING".
- Subtitle below the body line (24-28px, opacity 0.6): source / chapter.
- Bottom-right timecode (`00:03:21`, mono).

[Design notes]
- **Never** use full rainbow chromatic offsets (stick to a binary like hot-pink + cyan, never R/G/B together).
- Fonts: Latin `Inter Tight` Bold; CJK `Noto Sans SC` Bold; no serifs.
- Use `@keyframes` + JS timers (`setTimeout` per character); honor `prefers-reduced-motion` (just show all characters at once).
- Use the user's actual pull-quote — never invent content.
- Single-file HTML, no external resources beyond fonts.
