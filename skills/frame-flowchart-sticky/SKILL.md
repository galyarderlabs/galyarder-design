---
name: frame-flowchart-sticky
emoji: "📝"
description: "SVG curved connectors + sticky-note nodes + interactive cursors mimicking a collaborative whiteboard brainstorm"
category: video
scenario: operations
featured: 45
tags: ["flowchart", "diagram", "sticky", "whiteboard", "frame"]
example_id: sample-frame-flowchart-sticky
example_format: markdown
example_source_url: "https://hyperframes.heygen.com/catalog"
example_source_label: "hyperframes · flowchart"
od:
  mode: video
  surface: video
  scenario: operations
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "Sticky Note Flowchart Frame" template to turn my content into "SVG curved connectors + sticky-note nodes + interactive cursors mimicking a collaborative whiteboard brainstorm". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Sticky Note Flowchart (Sticky Flowchart)]
【Intent] Visualize a process / system / workflow like a "whiteboard + sticky notes", suitable for onboarding videos, operational process explanations, and system architecture presentations. Inspired by hyperframes flowchart.

【Canvas] 1920×1080. Background: Beige whiteboard paper `#f4ede1` or cool gray whiteboard `#f0f2f4`; add very light hex grid `rgba(0,0,0,0.04)` to give it a whiteboard feel.

【Nodes (Sticky Notes)]
- Each node = one 240×180px sticky note, randomly assigned from 4 color schemes: yellow `#fcd34d` / peach `#fca5a5` / mint `#a7f3d0` / sky `#a5b4fc`.
- Sticky notes feature slight, irregular rotations `transform: rotate(±2deg)`, drop shadow `drop-shadow(0 6px 14px rgba(0,0,0,0.12))`, decorated with top tape `linear-gradient(...)`.
- Node content: 1 emoji or single-stroke SVG icon + large title (16-20px) + one-line description (12px).
- Node Font: `Kalam` / `Caveat` / `Patrick Hand` hand-written font (or generic handwriting font for non-English scripts).

【Connection Lines (SVG)]
- Connect nodes with `<path>` Bezier curves, stroke `#2a2a2a`, width 2.5, `stroke-linecap: round`, `stroke-dasharray: 0` (solid line) or `8 6` (dashed line = conditional branch).
- Arrow ends utilize `marker-end`, forming small black triangular arrowheads.
- Complex nodes can have loops or branches: 2 outgoing lines from one node (fork) or 2 incoming lines to one node (merge).

【Optional Interactions]
- Top caption (sans, 12px uppercase): "FLOW · MIGRATION · 2026"。
- Hovering over a node: lift shadow + scale 1.05, utilizing CSS transition.
- A "cursor" decoration (`<svg>` arrow + name tag), floating next to some node, simulating a figma collaborative cursor.

【Design Details]
- At least 5 nodes, at most 12.
- Node arrangement should not be strictly centered; aim for a whiteboard-style "sticky note" feel, while ensuring connectors are clear and non-crossing.
- Strictly forbidden: fullscreen dark backgrounds, neon colors, enterprise dashboard style.
- Fonts must not use Inter / serif; a handwritten feel is mandatory.
- Single-file HTML; do not use external icon libraries (use inline SVG).
- Must use actual user workflow content; node text is directly derived from user input.
