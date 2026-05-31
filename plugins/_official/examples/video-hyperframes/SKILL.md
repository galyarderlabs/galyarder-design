---
name: video-hyperframes
en_name: "Hyperframes Video"
emoji: "🎞️"
description: "Hyperframes / Remotion-compatible continuous frame animation with autoplay support."
en_description: "Hyperframes / Remotion-compatible continuous frame animation with autoplay support."
category: video
scenario: video
aspect_hint: "1920×1080 (16:9)"
recommended: 5
tags: ["video", "hyperframes", "remotion"]
example_id: sample-hyperframes-workflow
example_name: "Hyperframes · AI workflow video"
example_format: markdown
example_tagline: "8 frames, autoplay, with progress bar + metadata"
example_desc: "Cinematic animation script ready for Remotion to render to mp4"
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
  example_prompt: "Use the Hyperframes Video template to turn my content into a Hyperframes / Remotion-compatible continuous frame animation with autoplay support. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Hyperframes Video Frames]
- Output N continuous `<section class="frame">` blocks, each `w-[1920px] h-[1080px]`. N depends on the information density of [user content] (start at 6-10 for a short script; longer scripts should use more, with each frame holding one shot/concept).
- Each frame conveys one shot/concept: text + visual composition (centered / golden ratio / rule of thirds).
- At the bottom of each frame add a hidden marker `<!-- frame:N duration:3000 transition:fade -->` for downstream Remotion / Hyperframes render scripts to read.
- Add a top-level JavaScript autoplayer: advance every 3 seconds, support click and arrow keys, show a progress bar in the corner.
- Frame 1 is the hook (a stat / a counterintuitive line / a question); frames 2-N argue the case; the last frame is the conclusion + CTA.
- Type scale should be huge (text-9xl), one sentence per frame — do not stack copy.
- Keep one cinematic palette (dark background + a single neon accent).
- End the file with a short comment `<!-- HYPERFRAMES_META: ... -->` containing per-frame duration / transition / sceneSummary as JSON metadata for the Remotion conversion step.
