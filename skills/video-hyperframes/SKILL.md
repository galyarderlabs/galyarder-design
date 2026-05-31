---
name: video-hyperframes
emoji: "🎞️"
description: "Hyperframes and Remotion compatible frame-by-frame animations with autoplay support"
category: video
scenario: video
recommended: 5
tags: ["video", "hyperframes", "remotion", "video"]
example_id: sample-hyperframes-workflow
example_format: markdown
example_source_url: "https://github.com/heygen-com/hyperframes"
example_source_label: "heygen-com/hyperframes"
od:
  mode: video
  surface: video
  scenario: video
  featured: 0.13
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: >-
    Use the "Hyperframes Video Script" template to turn my content into "Hyperframes and Remotion compatible frame-by-frame animations with autoplay support". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Hyperframes Video Frame]
- Output N consecutive `<section class="frame">`, each `w-[1920px] h-[1080px]`; N is determined by [User Content] information density (6-10 frames starting for short scripts, longer scripts should have more, each frame carrying only one shot/concept).
- Each frame expresses a scene/concept: text + visual composition (centered composition / golden ratio / rule of thirds).
- Hidden marker at the bottom of each frame `<!-- frame:N duration:3000 transition:fade -->` for subsequent Remotion / Hyperframes rendering scripts to read.
- Add a piece of JavaScript at the top for autoplay: switch to the next frame every 3 seconds, also supports click / arrow keys control; progress bar displayed in the corner.
- Frame 1 is the hook (a data point / a counter-intuitive fact / a question), frames 2-N are the arguments, and the last is the conclusion + CTA.
- Massive font size (text-9xl), a single sentence is sufficient, avoid clutter.
- Harmonize colors into a cinematic style (dark background + 1 neon accent).
- Output a short comment at the end `<!-- HYPERFRAMES_META: ... -->` containing JSON metadata for each frame's duration / transition / sceneSummary, for subsequent conversion to Remotion.
