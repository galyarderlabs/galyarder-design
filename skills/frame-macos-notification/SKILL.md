---
name: frame-macos-notification
emoji: "🔔"
description: "Realistic macOS notification banner + app icon + custom title and body, perfect for video overlays or product launch teasers"
category: card
scenario: video
featured: 41
tags: ["macos", "notification", "banner", "overlay", "frame"]
example_id: sample-frame-macos-notification
example_format: markdown
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · macos-notification"
od:
  mode: video
  surface: video
  scenario: video
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "macOS Notification Banner" template to turn my content into "Realistic macOS notification banner + app icon + custom title and body, perfect for video overlays or product launch teasers". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: macOS Notification Banner]
[Intent] Render an announcement / message / alert as a macOS Big Sur+ styled notification banner, suitable for video corner overlays, product release teasers, and social media graphics. Inspired by hyperframes macos-notification.

【Canvas] Two usages:
- Video overlay 1920×1080, notification placed top-right, transparent surroundings.
- Standalone banner 480×120, centered output.

【Banner Structure]
- Frame: Rounded corners 14px (macOS Big Sur standard), 480×120 (or longer 480×180 containing body text), 12-16px padding.
- Background: **frosted glass** effect — `background: rgba(245,245,247,0.78)` + `backdrop-filter: blur(40px) saturate(180%)`; dark version `rgba(28,28,30,0.78)`.
- Border: 1px `rgba(0,0,0,0.06)` (light) / `rgba(255,255,255,0.08)` (dark); add a 1px bright top highlight of `rgba(255,255,255,0.5)`.
- Shadows: `0 10px 40px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)`.

【Content]
- Left: **App icon** (44×44, rounded corner 10px, CSS gradient + 1 emoji or monogram letter, **do not use external image links**).
- Middle:
  - Top row: App Name (SF Pro 13px, weight 600) + `now` or specific time (12px, opacity 0.6) — justified on both ends.
  - Title (15px, weight 600, truncated to 1 line).
  - Body (13px, weight 400, truncated to 1-2 lines, line-height 1.35).
- Right (optional): action button "Open" or "Reply" (capsule, light gray background).

【Typography]
- Main: `SF Pro Text` → fallback `Inter` / `system-ui`; Chinese uses `PingFang SC` / `Noto Sans SC`.

【Optional Additions]
- Multiple stacked notifications: first one in front, remaining 2 scaled down and shifted downwards (scale 0.96 + opacity 0.6 + translateY).
- Entrance animation: Slide in from right off-screen `transform: translateX(110%)→0`, 200ms ease-out; can be disabled by `prefers-reduced-motion`.
- Top-right control chip "Clear" (revealed on hover, default opacity is 0).

【Design Details]
- Light mode features a white frosted glass background, while dark mode (recommended for video) features a near-black frosted glass background.
- Icons cannot use external emoji image links; use unicode emojis or geometric CSS drawing.
- Must use user-provided content; title + body must clearly originate from user input.
- Single-file HTML; note that `backdrop-filter` requires the `-webkit-` prefix for Safari.
