---
name: resume-modern
en_name: "Modern Resume"
emoji: "📄"
description: "Modern minimal resume, single A4 page, ready for print or PDF export."
en_description: "Modern minimal resume, single A4 page, ready for print or PDF export."
category: resume
scenario: personal
aspect_hint: "A4 (210×297mm)"
recommended: 12
tags: ["resume", "cv"]
example_id: sample-resume-frontend
example_name: "Modern Resume · Frontend Engineer"
example_format: markdown
example_tagline: "A4 single page, print or PDF ready"
example_desc: "Senior frontend engineer resume, two-column layout, with quantified achievements"
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
  example_prompt: "Use the Modern Resume template to turn my content into a modern minimal single-page A4 resume ready for print or PDF export. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Modern Minimal Resume]
- Container mimics A4: `w-[210mm] min-h-[297mm] mx-auto`, with 16-20mm padding.
- Big name at the top (text-4xl) followed by a contact line (email / phone / city / GitHub / LinkedIn) separated by hairline vertical rules.
- Optional two-column body: left 60% for the main track (experience / projects / education); right 40% for the sidebar (skills / languages / awards).
- Section headings: small caps with a short accent rule above (w-8 h-0.5).
- Each experience entry: company + role + date range (right-aligned), then 1-3 verb-led bullets.
- Avoid loud color — black and white plus one accent (deep blue or forest green).
- Add `@media print` styles: hide non-essential elements, keep colors intact.
