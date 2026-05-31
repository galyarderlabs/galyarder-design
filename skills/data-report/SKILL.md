---
name: data-report
emoji: "📊"
description: "Transform CSV, Excel, or JSON data into a beautifully visualized report page"
category: data
scenario: finance
featured: 10
tags: ["data", "report", "chart", "data", "report"]
example_id: sample-data-weekly-report
example_format: csv
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
  example_prompt: >-
    Use the "Data Visualization Report" template to turn my content into "Transform CSV, Excel, or JSON data into a beautifully visualized report page". Maintain the template's visual signature, use real content and data, and avoid lorem ipsum and placeholder images.
---

[Template: Data Visualization Report]
- Header: report title + date range + data source explanation.
- KPI card grid: 3-5 key metrics, each card displaying value + YoY change + micro-trendline.
- Main Chart Area: At least 2 charts (bar / line / pie / scatter), use Chart.js or ECharts (imported via jsdelivr CDN), with data parsed from user inputs.
- **Chart containers must have a fixed height**: Wrap each `<canvas>` in an outer `<div style="position:relative;height:NNNpx">` (KPI mini chart ~40px, main chart ~240–280px). When using Chart.js with `responsive:true, maintainAspectRatio:false`, if the parent container does not have an explicit height, it will fall into an infinite ResizeObserver loop, causing the chart to grow infinitely until the browser crashes. **Never** write the `height=` attribute directly on the canvas as a layout; that is only an initial value.
- Data tables: Excerpts of user's raw data, use `<table>` + modern styling (zebra stripe, hover, sticky header).
- Insight block: 3-5 text insights, starting with emojis, styled like a product weekly update.
- Bottom "Methodology" collapsible area.
- Restrained, professional color scheme: primary color 1 + neutral color scales, utilizing the theme palette for charts.
- **Must parse actual data provided by the user**, do not fabricate.
