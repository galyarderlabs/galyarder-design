---
name: frame-macos-notification
zh_name: "macOS Notification Banner"
en_name: "macOS Notification Banner"
emoji: "🔔"
description: "Realistic macOS notification banner with app icon, title, and body, suited to video overlays or product teasers."
zh_description: "Realistic macOS notification banner with app icon + title + body — fits video overlays / product teasers."
en_description: "Realistic macOS notification banner with app icon, title, and body, suited to video overlays or product teasers."
category: card
scenario: video
aspect_hint: "1920×1080 video frame or 480×120 banner"
featured: 41
tags: ["macos", "notification", "banner", "overlay", "frame"]
example_id: sample-frame-macos-notification
example_name: "macOS Notification — Feature Launch"
example_format: markdown
example_tagline: "Big Sur frosted-glass banner"
example_desc: "App icon + title + two-line body, for video corner overlays"
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
  example_prompt: "Use the macOS Notification Banner template to turn my content into a realistic macOS notification banner for a video overlay or product teaser. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the macOS Notification Banner template to turn my content into a realistic macOS notification banner for a video overlay or product teaser. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: macOS Notification Banner]
[Intent] Render an announcement / message / alert as a macOS Big Sur+ notification banner, suitable for corner overlays in video, product teasers, and social cards. Inspired by hyperframes macos-notification.

[Canvas] Two use cases:
- Video overlay 1920×1080, notification placed in the top-right corner with the rest transparent.
- Standalone banner 480×120, output centered.

[Banner structure]
- Frame: 14px border radius (macOS Big Sur standard), 480×120 (or longer 480×180 with body), 12-16px inner padding.
- Background: **frosted glass** — `background: rgba(245,245,247,0.78)` + `backdrop-filter: blur(40px) saturate(180%)`; dark version `rgba(28,28,30,0.78)`.
- Border: 1px `rgba(0,0,0,0.06)` (light) / `rgba(255,255,255,0.08)` (dark); top edge highlight 1px `rgba(255,255,255,0.5)`.
- Shadow: `0 10px 40px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)`.

[Content]
- Left: **App icon** (44×44, 10px corner radius, CSS gradient + a single emoji or monogram letter, **never an external image**).
- Middle:
  - Top row: app name (SF Pro 13px, weight 600) + `now` or specific time (12px, opacity 0.6) — justified to both ends.
  - Title (15px, weight 600, single-line truncate).
  - Body (13px, weight 400, 1-2 line truncate, line-height 1.35).
- Right (optional): action button "Open" or "Reply" (capsule, light grey background).

[Fonts]
- Primary: `SF Pro Text` → fallback `Inter` / `system-ui`.

[Optional extras]
- Stacked notifications: front banner in front; the other 2 recede with `scale(0.96)` + opacity 0.6 + translateY downward.
- Entry animation: slides in from off-screen right `transform: translateX(110%)→0`, 200ms ease-out; disabled under `prefers-reduced-motion`.
- Top-right control chip "Clear" (visible on hover, opacity 0 by default).

[Design rules]
- Light mode: white frosted background. Dark mode (recommended for video): near-black frosted background.
- Icon must not be an external emoji image — use a Unicode emoji or CSS-drawn geometry.
- Use the user's content; the title + body must come from the user's input.
- Single-file HTML; remember Safari needs the `-webkit-` prefix on `backdrop-filter`.
