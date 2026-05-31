---
name: frame-flowchart-sticky
zh_name: "Sticky Flowchart Frame"
en_name: "Sticky Flowchart Frame"
emoji: "📝"
description: "SVG curve connectors, sticky-note nodes, and cursor interaction with a whiteboard-brainstorm feel."
zh_description: "SVG curve connectors + sticky-note nodes + cursor interaction, a whiteboard-brainstorm feel."
en_description: "SVG curve connectors, sticky-note nodes, and cursor interaction with a whiteboard-brainstorm feel."
category: video
scenario: operations
aspect_hint: "1920×1080 (16:9)"
featured: 45
tags: ["flowchart", "diagram", "sticky", "whiteboard", "frame"]
example_id: sample-frame-flowchart-sticky
example_name: "Sticky Flowchart — User Onboarding"
example_format: markdown
example_tagline: "SVG curves + 4-color sticky notes"
example_desc: "6-node onboarding flow, handwritten type on whiteboard paper"
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
  example_prompt: "Use the Sticky Flowchart Frame template to turn my content into a whiteboard-brainstorm frame with SVG curve connectors, sticky-note nodes, and cursor interaction. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Sticky Flowchart Frame template to turn my content into a whiteboard-brainstorm frame with SVG curve connectors, sticky-note nodes, and cursor interaction. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Sticky Flowchart Frame]
[Intent] Render a process / system / workflow as a "whiteboard + sticky notes," suitable for onboarding videos, ops flow explanations, or system architecture talks. Inspired by hyperframes flowchart.

[Canvas] 1920×1080. Background: cream-yellow whiteboard paper `#f4ede1` or cool-grey whiteboard `#f0f2f4`; add a very faint hex grid `rgba(0,0,0,0.04)` to give it a whiteboard feel.

[Nodes (Sticky Notes)]
- Each node = one 240×180px sticky note, with 4 colors assigned at random: yellow `#fcd34d` / peach `#fca5a5` / mint `#a7f3d0` / sky `#a5b4fc`.
- Sticky notes get slight, inconsistent rotation `transform: rotate(±2deg)`, a `drop-shadow(0 6px 14px rgba(0,0,0,0.12))`, and a piece of decorative tape at the top via `linear-gradient(...)`.
- Node content: 1 emoji or single-line SVG icon + a title (16-20px) + a one-line description (12px).
- Node fonts: handwritten faces such as `Kalam` / `Caveat` / `Patrick Hand`.

[Connectors (SVG)]
- Use `<path>` Bezier curves to connect nodes, stroke `#2a2a2a`, width 2.5, `stroke-linecap: round`, `stroke-dasharray: 0` (solid) or `8 6` (dashed = conditional branch).
- Arrowheads use `marker-end` with a small black triangle.
- Complex nodes can have loops or branches: 2 outgoing edges (fork) or 2 incoming edges (merge) on the same node.

[Optional interactions]
- Top caption (sans, 12px uppercase): "FLOW · MIGRATION · 2026".
- Hover on a node: lift the shadow + scale 1.05 with CSS transition.
- One "cursor" decoration (`<svg>` arrow + name tag) hovering near a node, simulating a Figma collaboration cursor.

[Design rules]
- At least 5 nodes, at most 12.
- Don't center every node; it should feel like notes casually stuck on a whiteboard, but connectors must remain clear and uncrossed.
- Forbidden: full-screen dark backgrounds, neon colors, enterprise-dashboard styling.
- Fonts cannot be Inter or serif; they must feel handwritten.
- Single-file HTML; no external icon libraries (use inline SVG).
- Use the user's actual flow content; node text comes directly from the user's input.
