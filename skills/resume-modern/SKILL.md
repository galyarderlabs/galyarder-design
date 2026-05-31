---
name: resume-modern
emoji: "📄"
description: "Modern minimalist resume, optimized for single-page A4 printing or PDF export"
category: resume
scenario: personal
recommended: 12
tags: ["resume", "cv", "resume"]
example_id: sample-resume-frontend
example_format: markdown
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
  example_prompt: >-
    Use the "Minimalist Resume" template to turn my content into "Modern minimalist resume, optimized for single-page A4 printing or PDF export". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Modern Minimalist Resume]
- Container width simulating A4: `w-[210mm] min-h-[297mm] mx-auto`, padding 16-20mm.
- Top name is massive (text-4xl), bottom line contact (email / phone / city / GitHub / LinkedIn) with a thin vertical line in between.
- Two-column layout option: Left 60% primary track (experience/projects/education), Right 40% secondary track (skills/languages/awards).
- Section title: small-caps style, with a short accent line above (w-8 h-0.5).
- Each experience: company + title + date range (right-aligned), with 1-3 bullets below starting with action verbs.
- Avoid flashy colors; use black, white, gray + 1 accent color (navy / forest green).
- Add @media print styles, hide unnecessary elements, and retain colors.
