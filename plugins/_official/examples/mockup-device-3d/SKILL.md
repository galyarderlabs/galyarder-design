---
name: mockup-device-3d
en_name: "Device 3D Showcase"
emoji: "📱"
description: "Static iPhone and MacBook 3D-style showcase with real HTML embedded on screens, glass-lens refraction, and 360-degree turntable composition."
en_description: "Static iPhone and MacBook 3D-style showcase with real HTML embedded on screens, glass-lens refraction, and 360-degree turntable composition."
category: poster
scenario: product
aspect_hint: "1920×1080 (16:9)"
featured: 47
tags: ["device", "mockup", "iphone", "macbook", "html-in-canvas", "product"]
example_id: sample-mockup-device-3d
example_name: "iPhone × MacBook 3D Showcase"
example_format: markdown
example_tagline: "HTML-in-Canvas device showcase"
example_desc: "Real UI embedded on both the iPhone and MacBook screens, with glass-lens refraction"
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · vfx-iphone-device"
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: product
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: "Use the Device 3D Showcase template to turn my content into a static iPhone and MacBook 3D-style showcase with real HTML embedded on the screens. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Device 3D Showcase / HTML-in-Canvas]
[Intent] Product launches, app demos, design-spec showcases. Render the user's UI content directly inside the iPhone / MacBook "screen" while CSS 3D transforms simulate the glass / highlights / refraction of a GLTF model. Inspired by hyperframes vfx-iphone-device.

[Composition rules]
- **Canvas**: 1920×1080, warm gray gradient `radial-gradient(#1a1a1f → #0a0a0f)` background, with a reflective floor at the bottom (mirror gradient).
- **iPhone 15 Pro model**: positioned left/center, `transform: rotateY(-12deg) rotateX(4deg) translateZ(40px)`; titanium-silver bezel `#a8a8ad` (solid 4px) + 56px screen radius; the screen is an iframe-like div that renders the user's HTML content (mobile viewport 375×812).
- **MacBook Pro 14"** (optional second device): right side, slightly smaller, `rotateY(8deg)`; lid screen embeds the desktop viewport content (1440×900 scaled); base keyboard + trackpad drawn with CSS shadow lines (skip individual key caps).
- **Glass / lens highlights**: 2-3 ellipse highlights with `radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 60%)` at the top to simulate a morphing glass lens.
- **Floor reflection**: under each device use `transform: scaleY(-1)` + `mask-image: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 70%)`.

[Where the screen content comes from]
- If the user supplies text/data, render a mock app UI (status bar at the top + title + body + bottom tab bar or home indicator).
- If the user supplies HTML, embed it as-is in the screen div (apply a scale transform to fit the screen width/height).
- The on-screen UI uses Tailwind with type sizes that match real mobile (text-sm / text-base, never text-9xl).

[Optional supporting elements]
- Bottom-right "product slug" lock-up: large logo + a tagline line + a hairline subtitle.
- Top caption row (Latin sans, small, opacity 0.6): product codename / date / version.
- 8s CSS turntable: `@keyframes turntable` rotateY -12 ↔ 12, ease-in-out infinite alternate; honors `prefers-reduced-motion`.

[Design notes]
- **Never** use external mockup image URLs (no Unsplash, no Dribbble assets). Devices must be drawn entirely with CSS / SVG.
- Fonts: captions / logos use `Inter Tight` / `SF Pro` style; on-screen content adapts to user content.
- The background uses one of four palettes: charcoal / pearl / midnight blue / mocha — no rainbow gradients.
- Single-file HTML; do NOT nest iframes via srcdoc (fragile). Use `<div class="screen">` + Tailwind.
- The screen content must come from real user data — no lorem ipsum or "Your text here".
