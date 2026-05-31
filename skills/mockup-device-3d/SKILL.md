---
name: mockup-device-3d
emoji: "📱"
description: "iPhone + MacBook realistic static 3D stand with real embedded HTML screen content, glass lens refraction, and a 360° turntable composition"
category: poster
scenario: product
featured: 47
tags: ["device", "mockup", "iphone", "macbook", "html-in-canvas", "product"]
example_id: sample-mockup-device-3d
example_format: markdown
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
  example_prompt: >-
    Use the "iPhone × MacBook 3D Exhibition Stand" template to turn my content into "iPhone + MacBook realistic static 3D stand with real embedded HTML screen content, glass lens refraction, and a 360° turntable composition". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Device 3D Showcase / HTML-in-Canvas]
【Intent] Product launch, App demo, design showcase. Render the user-provided UI content realistically into the iPhone / MacBook "screen", and use CSS 3D transform around it to simulate the glass / highlights / refraction of a GLTF model. Inspired by hyperframes vfx-iphone-device.

【Strict Layout Composition]
- **Canvas**: 1920×1080, warm gray gradient background `radial-gradient(#1a1a1f → #0a0a0f)`, bottom reflecting floor (mirror gradient).
- **iPhone 15 Pro Model**: Left / Center, `transform: rotateY(-12deg) rotateX(4deg) translateZ(40px)`; Titanium silver border `#a8a8ad` (solid 4px) + screen rounded corner 56px; screen nested iframe-like div, rendering the user's actual HTML content (mobile viewport 375×812).
- **MacBook Pro 14"** (optional second unit): Right, slightly smaller, `rotateY(8deg)`; upper cover screen embeds desktop viewport content (1440×900 scaled); base keyboard + trackpad drawn with CSS shadow lines (does not draw individual keycaps).
- **Glass / lens flare**: Add 2-3 elliptical highlights of `radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 60%)` at the top, simulating a morphing glass lens.
- **Ground Reflection**: Beneath the device `transform: scaleY(-1)` + `mask-image: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 70%)`.

【Screen Content Sources]
- User provides text/data → automatically renders into a mock app interface (Top status bar + title + body + Bottom tab bar or home indicator).
- User provides HTML → embedded directly inside screen div (note the transform scaling to make it fit screen width/height).
- UI inside screen uses Tailwind; font sizes should match actual mobile dimensions (text-sm / text-base, not text-9xl).

【Optional Additional Elements]
- Bottom-right "product slug" badge: large logo + single-line tagline + hairline subtitle.
- Top single-line caption (English sans, small font size, 0.6 opacity): product codename / date / version.
- Add an 8s automatic CSS turntable: `@keyframes turntable` rotateY -12 ↔ 12, ease-in-out infinite alternate; can be disabled by `prefers-reduced-motion`.

【Design Details]
- **Never**: use external mockup image URLs (any unsplash / dribbble links), draw all devices using CSS / SVG.
- Fonts: caption / logo outside the device use `Inter Tight` / `SF Pro` style; inside the device adapts based on user content.
- Background optional in 4 color schemes: charcoal / pearl / midnight blue / mocha; no rainbow gradients.
- Single-file HTML; do not nest iframe using srcdoc (prone to issues), use `<div class="screen">` + Tailwind to render content.
- Must populate screen content with actual user data; lorem ipsum or "Your text here" placeholders are strictly prohibited.
