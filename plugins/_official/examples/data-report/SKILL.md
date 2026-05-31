---
name: data-report
zh_name: "Data Visualization Report"
en_name: "Data Visualization Report"
emoji: "📊"
description: "Turns CSV, Excel, or JSON data into a polished visual report page."
zh_description: "Turns CSV / Excel / JSON data into a polished visual report page."
en_description: "Turns CSV, Excel, or JSON data into a polished visual report page."
category: data
scenario: finance
aspect_hint: "desktop long page"
featured: 10
tags: ["data", "report", "chart", "analytics", "visualization"]
example_id: sample-data-weekly-report
example_name: "Data Report — Weekly"
example_format: csv
example_tagline: "KPI cards + Chart.js charts + table"
example_desc: "Auto-renders nine months of growth data into a visualization report with Chart.js inlined"
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: finance
  upstream: "https://github.com/galyarderlabs/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: "Use the Data Visualization Report template to turn my CSV, Excel, or JSON data into a polished visual report page. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    en: "Use the Data Visualization Report template to turn my CSV, Excel, or JSON data into a polished visual report page. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
---

[Template: Data Visualization Report]
- Header: report title + date range + data source note.
- KPI card grid: 3-5 of the most important metrics, each card showing the value + period-over-period change + a sparkline.
- Main chart area: at least 2 charts (bar / line / pie / scatter), drawn with Chart.js or ECharts (loaded from the jsdelivr CDN), with the data parsed from the user's input.
- **Chart containers must have a fixed height**: wrap each `<canvas>` in a `<div style="position:relative;height:NNNpx">` (KPI sparkline ~40px, main charts ~240–280px). When Chart.js runs with `responsive:true` and `maintainAspectRatio:false`, a parent without an explicit height enters a ResizeObserver loop in which the chart grows infinitely until the browser hangs. **Never** set `height=` directly on the canvas as the layout — that attribute is only the initial value.
- Data table: a slice of the user's raw data rendered with `<table>` plus modern styling (zebra stripes, hover, sticky header).
- Insight block: 3-5 sentences of insight, each starting with an emoji, like a product weekly report.
- Collapsible "Methodology" section at the bottom.
- Restrained, professional color palette: one primary color + neutral scale, with a chart palette for the visualizations.
- **Always parse the user's actual data**; never fabricate values.
