---
name: doc-kami-parchment
zh_name: "Kami Parchment Document"
en_name: "Kami Parchment Document"
emoji: "📜"
description: "Warm parchment canvas (#f5f4ed), monochrome ink-blue accent (#1B365D), one serif family, and editorial-grade typography."
zh_description: "Warm parchment canvas (#f5f4ed) + monochrome ink-blue accent (#1B365D) + a single serif family, editorial-grade typography."
en_description: "Warm parchment canvas (#f5f4ed), monochrome ink-blue accent (#1B365D), one serif family, and editorial-grade typography."
category: doc
scenario: personal
aspect_hint: "A4 / Letter long page"
featured: 48
recommended: 3
tags: ["kami", "parchment", "serif", "editorial", "report", "letter", "one-pager"]
example_id: sample-kami-parchment
example_name: "Kami Parchment — One-Pager"
example_format: markdown
example_tagline: "Warm parchment + monochrome ink blue + a single serif"
example_desc: "A one-page Galyarder Design Studio Issue №26 editorial-grade one-pager"
example_source_url: "https://github.com/tw93/kami"
example_source_label: "tw93/kami"
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: personal
  featured: 0.04
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: "Use the Kami Parchment Document template to turn my content into a warm parchment document with monochrome ink-blue accents, one serif family, and editorial-grade typography. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Kami Parchment Document template to turn my content into a warm parchment document with monochrome ink-blue accents, one serif family, and editorial-grade typography. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Kami Parchment Document]
[Intent] Serious typeset documents: one-pagers / long reports / letters / resumes / financial reports / changelogs / portfolios. Inspired by tw93/kami. Emphasizes "looks like typeset paper," not a dashboard, not a webpage.

[Hard visual signature — do not change]
- **Canvas**: warm parchment `#f5f4ed` (never pure white `#fff`). Secondary background `#efeee5`.
- **Ink**: primary text `#1f1d18` (warm near-black, never pure `#000`). Secondary text `#6b665b`.
- **Single accent color**: ink blue `#1B365D` — every accent (links, tag outlines, key numbers, blockquote left rule) uses only this color; no other colors allowed.
- **Fonts**: one serif per language, never mixed in the same document:
  - Latin: `Charter` (fallback: `Source Serif Pro`, `Iowan Old Style`)
  - Body 400, Heading 500 (no 700 / 800 / 900).
- **Line height**: titles 1.1–1.3, tight body 1.4–1.45, reading-grade body 1.5–1.55.
- **Forbidden**: drop-shadow / blur / corner radius ≥ 8px / gradients / neon / rgba (use solid hex).
- **Details**: tags use solid-hex background blocks (because WeasyPrint renders rgba poorly); single-line geometric icons; 1px hairline `#d4d1c5` rules at the edges, kept short rather than running edge-to-edge.

[Optional document types — choose based on user content]
- **One-Pager** — top logotype (Charter italic) + title + lede + 3-column key points + footer metadata.
- **Long Doc** — cover page (large title + subtitle + author + date) → table of contents (kicker + page numbers) → chapter (folio in the corner + section rule + body) → footnotes + closing colophon.
- **Letter** — letterhead address + date + recipient + body (left-aligned, 1.5em paragraph spacing) + signature block + signature line.
- **Portfolio** — project hero (large title + subtitle) + a full-width image (CSS block placeholder) + project description + role / time / stack metadata row.
- **Resume** — top name (large) + tagline line + contact row + main sections: experience (company / time / role / bullets) + skills + education.
- **Slides** — keynote feel; the slide count is determined by [user content] (short content starts at 6 pages, longer content uses more); each slide is full parchment with a large title + lede + corner page number, restrained enough to feel printed.
- **Equity Report** — company name + ticker + Q × year + key metrics row (revenue / margin / yoy) + body analysis + chart (single-color SVG line chart).
- **Changelog** — version (Charter italic, large) + date + change list (Added / Changed / Fixed), separated by single rules.

[Design principles]
- "Composed pages, not dashboards." Don't pile up KPI cards, don't pile up emoji icons, don't use hero gradients.
- "Ring or whisper only, no hard drop shadows." Shadows can only be hairline outlines like `0 0 0 1px #d4d1c5`.
- Type hierarchy comes from **serif contrast + size + whitespace**, not from color.
- Single-file HTML using Tailwind via CDN; no external image links — placeholders are paper-tint blocks with a 1px ink outline.
