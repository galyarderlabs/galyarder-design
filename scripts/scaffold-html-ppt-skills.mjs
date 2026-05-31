#!/usr/bin/env node
// Scaffold one Galyarder Design skill per upstream html-ppt full-deck template.
//
// Each generated `skills/html-ppt-<name>/SKILL.md` ships only frontmatter +
// a short body. Authoring guidance, layouts, themes, and animations live in
// the master `skills/html-ppt/` skill — these wrappers only exist so each
// template surfaces as its own card in the Examples gallery and so the
// "Use this prompt" flow can prefill `mode=deck`, scenario, and the right
// example_prompt.

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = path.join(ROOT, 'skills');
const UPSTREAM_URL = 'https://github.com/lewislulu/html-ppt-skill';

// `featured` is a sort priority used by the Examples gallery — smaller wins
// the tie-break, so a curated handful float to the top. Templates without
// `featured` slot in alphabetically after the existing skills.
const TEMPLATES = [
  {
    slug: 'pitch-deck',
    name: 'html-ppt-pitch-deck',
    title: 'HTML PPT · Pitch Deck',
    scenario: 'finance',
    featured: 20,
    description:
      'Investor-ready 10-slide HTML pitch deck — white + blue→purple gradient hero, big numbers, traction bar chart, $4.5M-style ask page. Use when the user wants a fundraising deck, seed-round pitch, or VC meeting slides.',
    triggers: ['pitch deck', 'pitch', 'fundraising', 'seed round', 'investor deck', 'vc deck', 'pitch slides'],
    examplePrompt:
      'Build a 10-slide pitch deck in HTML for my seed round. Use the html-ppt-pitch-deck full-deck template (white + blue→purple gradient, traction bars, $X.XM ask). Confirm three things first: (1) name + one-line pitch, (2) key traction numbers, (3) ask + use of funds.',
  },
  {
    slug: 'product-launch',
    name: 'html-ppt-product-launch',
    title: 'HTML PPT · Product Launch',
    scenario: 'marketing',
    featured: 21,
    description:
      'Launch keynote deck — dark hero + light content, warm orange→peach accent, feature cards, pricing tiers, CTA. Use when announcing a product, launching a feature, or doing a keynote-style reveal.',
    triggers: ['product launch', 'keynote', 'launch deck', 'feature reveal', 'launch slides'],
    examplePrompt:
      'Make a product-launch keynote deck in HTML using the html-ppt-product-launch full-deck template (dark hero, warm orange accent, feature cards, pricing tiers). Confirm: product name + tagline, the 3 key features, and pricing tiers — then write the deck.',
  },
  {
    slug: 'tech-sharing',
    name: 'html-ppt-tech-sharing',
    title: 'HTML PPT · Tech Sharing',
    scenario: 'engineering',
    featured: 22,
    description:
      'Conference / internal tech-talk deck — GitHub-dark, JetBrains Mono, terminal code blocks, agenda + Q&A pages. Use for engineering presentations, internal sharing sessions, conference talks, and code-heavy walkthroughs.',
    triggers: ['tech sharing', 'tech talk', 'engineering talk', 'conference talk', 'dev talk'],
    examplePrompt:
      'Use the html-ppt-tech-sharing template to make an 8-page tech-sharing deck. Confirm first: topic, audience (colleagues / community / customers), whether to include code snippets and benchmarks. GitHub dark theme + JetBrains Mono, agenda + Q&A pages prepared.',
  },
  {
    slug: 'weekly-report',
    name: 'html-ppt-weekly-report',
    title: 'HTML PPT · Weekly Report',
    scenario: 'operations',
    featured: 23,
    description:
      'Team weekly / status-update deck — corporate clarity, 8-cell KPI grid, shipped list, 8-week bar chart, next-week table. Use for weekly reports, business reviews, team status updates, and exec dashboards.',
    triggers: ['weekly report', 'status update', 'team report', 'business review', 'wbr'],
    examplePrompt:
      'Generate a weekly report (7 pages) using the html-ppt-weekly-report template. Ask me four things first: this week\'s time range, 3-5 core KPI numbers, items shipped / completed this week, and next week\'s plan and risks. Then fill in the 8-week bar chart and next-week table.',
  },
  {
    slug: 'xhs-post',
    name: 'html-ppt-xhs-post',
    title: 'HTML PPT · RedNote Image Post',
    scenario: 'marketing',
    featured: 24,
    description:
      'RedNote / Instagram-style 9-page 3:4 vertical image post (810×1080) — warm pastel, dashed sticker cards, dotted page-number footer. Used for RedNote (Xiaohongshu) image posts, Instagram carousels, and brand-promotion content.',
    triggers: ['xhs', 'xhs post', 'xiaohongshu', 'rednote', 'image carousel', 'instagram carousel'],
    examplePrompt:
      'Use the html-ppt-xhs-post template to make a set of 9 RedNote image cards (3:4 vertical, 810×1080). Tell me the topic first, then arrange the cover + 7 content pages + closing CTA, with one heading + one paragraph + a keyword sticker per page.',
  },
  {
    slug: 'course-module',
    name: 'html-ppt-course-module',
    title: 'HTML PPT · Course Module',
    scenario: 'education',
    featured: 25,
    description:
      'Online-course / workshop module deck — warm paper background + Playfair serif, persistent left sidebar of learning objectives, MCQ self-check page. Use for teaching modules, training materials, workshop slides.',
    triggers: ['course module', 'course slides', 'workshop', 'training deck', 'lesson', 'teaching', 'courseware'],
    examplePrompt:
      'Use the html-ppt-course-module template to build a 7-slide module deck. Confirm: module title, 3-5 learning objectives (these stick on the left rail), and the MCQ self-check question. Then assemble the deck with serif headings on warm paper.',
  },
  {
    slug: 'presenter-mode-reveal',
    name: 'html-ppt-presenter-mode',
    title: 'HTML PPT · Presenter Mode',
    scenario: 'engineering',
    featured: 26,
    description:
      'Presenter-mode-focused deck — tokyo-night default theme, 5 themes cycled with the T key, every page ships a 150-300 word verbatim speaker-note example (<aside class="notes">). Press S to open the popup (CURRENT / NEXT / SCRIPT / TIMER magnetic cards). Use for tech sharing, public talks, course explanations, or any scenario where you need a teleprompter / are afraid of forgetting your script.',
    triggers: ['presenter mode', 'speaker notes', 'teleprompter', 'presenter view', 'public talk', 'verbatim notes'],
    examplePrompt:
      'Use the html-ppt-presenter-mode template to make a deck with verbatim speaker notes. First confirm: talk topic, duration (2-3 minutes per page), target audience. Then write 150-300 words of conversational verbatim speaker notes per page (cue signals, not a written speech) that show up when S opens the presenter popup.',
  },
  {
    slug: 'xhs-white-editorial',
    name: 'html-ppt-xhs-white-editorial',
    title: 'HTML PPT · White Editorial Magazine',
    scenario: 'marketing',
    featured: 27,
    description:
      'White-background magazine-style deck — pure white background + a 10-color rainbow bar at the top, 80-110px display headlines, gradient text (purple→blue→green→orange→pink), macaron pastel soft cards (pink/purple/blue/green/orange), black-on-white .focus pills, oversized pull quotes. Doubles as RedNote image post + landscape PPT.',
    triggers: ['editorial deck', 'white editorial', 'magazine deck', 'xhs editorial', 'editorial magazine'],
    examplePrompt:
      'Use the html-ppt-xhs-white-editorial template to build a white-background magazine-style PPT. Key elements: 80-110px display headlines, top rainbow bar, macaron soft cards, black-on-white .focus pills. Tell me the topic and audience first, then write 8-12 pages.',
  },
  {
    slug: 'graphify-dark-graph',
    name: 'html-ppt-graphify-dark-graph',
    title: 'HTML PPT · Dark Knowledge Graph',
    scenario: 'engineering',
    featured: 28,
    description:
      'Dark knowledge-graph deck — #06060c→#0e1020 deep-night gradient + floating blur orbs, cover SVG force-directed graph, rainbow gradient titles, JetBrains Mono CLI highlights, glass-morphism cards. Suitable for dev-tool / CLI / knowledge-graph / data-visualization launches with an "AI-native + sci-fi + warm" tone.',
    triggers: ['knowledge graph', 'graph deck', 'dark graph', 'dev tool launch', 'cli launch', 'data viz launch'],
    examplePrompt:
      'Use the html-ppt-graphify-dark-graph template to build a dev-tool launch deck. Deep-night gradient background + force-directed graph cover + rainbow titles + JetBrains Mono CLI. First confirm: tool name, core capabilities, demo steps; whether to type CLI commands live.',
  },
  {
    slug: 'knowledge-arch-blueprint',
    name: 'html-ppt-knowledge-arch-blueprint',
    title: 'HTML PPT · Cream Blueprint Architecture',
    scenario: 'engineering',
    featured: 29,
    description:
      'Cream blueprint architecture deck — cream-paper #F0EAE0 background + a single rust-red #B5392A accent, 48px blueprint grid mask, 2px hard-edged black-bordered cards, pipeline step boxes (one raised), rust-red insight callout on the right, Playfair serif display, SVG dashed feedback loops. Zero gradients, zero soft shadows — serious and print-friendly.',
    triggers: ['architecture', 'blueprint', 'system design', 'data flow', 'engineering whitepaper'],
    examplePrompt:
      'Use the html-ppt-knowledge-arch-blueprint template for a system architecture deck. Cream paper + rust-red accent + blueprint grid + raised pipeline step + serif display. Tell me the system name + 5-7 core modules + data-flow direction, then write 8-10 pages.',
  },
  {
    slug: 'hermes-cyber-terminal',
    name: 'html-ppt-hermes-cyber-terminal',
    title: 'HTML PPT · Dark Terminal Review',
    scenario: 'engineering',
    featured: 30,
    description:
      'Dark-terminal honest-review deck — #0a0c10 black background + 56px cyber grid + CRT vignette + scanlines, window red/yellow/green chrome, `$ prompt` CLI titles, mint-green #7ed3a4 display text, JetBrains Mono, stroke-only bar charts, blinking cursor, amber/green/red 3-tier tags, dark code blocks. Ideal for CLI / agent / dev-tool reviews (with traces, diffs, benchmarks).',
    triggers: ['terminal review', 'cli review', 'agent review', 'honest review', 'dev tool review', 'benchmark review'],
    examplePrompt:
      'Use the html-ppt-hermes-cyber-terminal template for a CLI / agent review deck. Dark terminal style + scanlines + CLI titles + benchmark bars. First confirm: subject under review, 3-5 comparison axes, benchmark data.',
  },
  {
    slug: 'obsidian-claude-gradient',
    name: 'html-ppt-obsidian-claude-gradient',
    title: 'HTML PPT · GitHub Dark Purple Gradient',
    scenario: 'engineering',
    featured: 31,
    description:
      'GitHub dark-purple gradient deck — GitHub-dark #0d1117 + purple/blue radial ambient lighting + 60px grid mask, centered layout, purple pill badges, three-color gradient titles (#a855f7→#60a5fa→#34d399), GitHub-style code palette, purple left-border highlight blocks. Ideal for developer workflows / MCP / Agent / dev-tool tutorials, similar to GitHub Blog / Linear Changelog.',
    triggers: ['github dark', 'developer tutorial', 'mcp tutorial', 'agent tutorial', 'dev workflow', 'changelog deck'],
    examplePrompt:
      'Use the html-ppt-obsidian-claude-gradient template for a developer tutorial deck. GitHub dark-purple gradient + centered layout + purple pills + tri-color gradient titles + config / step code blocks. Confirm: what to teach, target audience, whether to include MCP / Agent config samples.',
  },
  {
    slug: 'testing-safety-alert',
    name: 'html-ppt-testing-safety-alert',
    title: 'HTML PPT · Red & Amber Safety Alert',
    scenario: 'engineering',
    featured: 32,
    description:
      'Red-and-amber safety-alert deck — top/bottom 45° red-black hazard stripes, red strikethrough negative headlines, L1/L2/L3 green/amber/red tier cards, dot-status alert boxes, policy-yaml code blocks (red left border + bad-keyword highlights), red-and-green checklists, Q1 incident stacked bar chart. Perfect for security / risk / incident reviews / red-team / pre-launch AI review / policy-as-code.',
    triggers: ['safety alert', 'incident', 'red team', 'risk review', 'security review', 'incident review', 'policy as code'],
    examplePrompt:
      'Use the html-ppt-testing-safety-alert template for an incident-review / security-review deck. Red-black hazard stripes + red strikethrough + L1/L2/L3 tier cards + policy-yaml code blocks. Tell me the incident timeline, root cause, and impact scope.',
  },
  {
    slug: 'xhs-pastel-card',
    name: 'html-ppt-xhs-pastel-card',
    title: 'HTML PPT · Soft Macaron Slow-Living',
    scenario: 'personal',
    featured: 33,
    description:
      'Soft macaron slow-living deck — cream #fef8f1 background + three soft-glow blobs, Playfair italic serif display headlines mixed with sans body text, 28px-radius macaron pastel cards (peach / mint / sky / lavender / lemon / rose), Playfair italic 01-04 numerals, SVG donut chart, chip+page top bar. Perfect for lifestyle / personal-growth / slow-living / emotional content with a "magazine, handcraft, low-tech" feel.',
    triggers: ['pastel', 'macaron', 'lifestyle', 'slow living', 'personal growth', 'wellbeing'],
    examplePrompt:
      'Use the html-ppt-xhs-pastel-card template for a slow-living-themed image post. Cream background + macaron rounded cards + Playfair italic numerals + donut chart. Tell me the topic (rest / pause / self-care…) and the 5-7 things you want to say.',
  },
  {
    slug: 'dir-key-nav-minimal',
    name: 'html-ppt-dir-key-nav-minimal',
    title: 'HTML PPT · 8-Color Minimalist Direction Keys',
    scenario: 'personal',
    featured: 34,
    description:
      '8-page minimalist direction-key keynote — every page on its own solid background (indigo / cream / crimson / emerald / gray / purple / white / charcoal) with matching palettes, 160px display headline + 4px short heavy accent line, Mono lists prefixed with arrow → markers, ← → kbd hints in the bottom-left + page number bottom-right, generous breathing whitespace. Perfect for "you have something to say but nothing to look at" keynote, launch, or public talks.',
    triggers: ['minimal keynote', 'minimalist deck', 'mono color', 'one idea per slide', 'public talk', 'launch keynote'],
    examplePrompt:
      'Use the html-ppt-dir-key-nav-minimal template for an 8-page minimalist keynote. One solid background per page + a single 160px display headline + a few arrow lists. Tell me the talk topic, then arrange 8 core ideas into 8 pages (one idea per page).',
  },
];

const SKILL_BODY = (t) => `# ${t.title}

A focused entry point into the [\`html-ppt\`](../html-ppt/SKILL.md) master skill that lands the user directly on the **\`${t.slug}\`** full-deck template.

## When this card is picked

The Examples gallery wires "Use this prompt" to the example_prompt above. When you accept that prompt, this card is the right pick if the user wants exactly the visual identity of \`${t.slug}\` (see the upstream [full-decks catalog](../html-ppt/references/full-decks.md) for screenshots and rationale).

## How to author the deck

1. **Read the master skill first.** All authoring rules live in
   [\`skills/html-ppt/SKILL.md\`](../html-ppt/SKILL.md) — content/audience checklist,
   token rules, layout reuse, presenter mode, the keyboard runtime, and the
   "never put presenter-only text on the slide" rule.
2. **Start from the matching template folder:**
   \`skills/html-ppt/templates/full-decks/${t.slug}/\` — copy \`index.html\` and
   \`style.css\` into the project, keep the \`.tpl-${t.slug}\` body class.
3. **Bring the shared runtime with the template.** The upstream
   \`index.html\` links the shared CSS/JS via \`../../../assets/...\` because it
   sits three folders deep inside \`skills/html-ppt/templates/full-decks/\`.
   Once you copy \`index.html\` into the project, those parent-relative URLs
   no longer resolve and \`base.css\`, \`animations.css\`, and \`runtime.js\`
   will 404 — meaning the deck never activates and slide navigation is
   dead. Pick one of these two recipes per project:
   - **Recipe A — copy + rewrite (preferred):** copy
     \`skills/html-ppt/assets/fonts.css\`, \`skills/html-ppt/assets/base.css\`,
     \`skills/html-ppt/assets/animations/animations.css\`, and
     \`skills/html-ppt/assets/runtime.js\` into a project-local
     \`assets/\` (with \`assets/animations/animations.css\`), then rewrite the
     four \`<link>\`/\`<script>\` tags in \`index.html\` from
     \`../../../assets/...\` to the matching project-local paths
     (\`assets/fonts.css\`, \`assets/base.css\`,
     \`assets/animations/animations.css\`, \`assets/runtime.js\`).
   - **Recipe B — inline:** read the same four files and replace each
     \`<link rel="stylesheet" href="../../../assets/...">\` with a
     \`<style>...</style>\` containing the file's contents, and the
     \`<script src="../../../assets/runtime.js">\` with a
     \`<script>...</script>\` containing \`runtime.js\`. Yields a single
     self-contained \`index.html\`.
   Either way, do not ship the upstream \`../../../assets/...\` URLs
   verbatim into a project artifact — they only work in-tree.
4. **Pick a theme.** Default tokens look fine; if the user wants a different
   feel, swap in any of the 36 themes from \`skills/html-ppt/assets/themes/*.css\`
   via \`<link id="theme-link">\` and let \`T\` cycle.
5. **Replace demo content, not classes.** The \`.tpl-${t.slug}\` scoped CSS only
   recognises the structural classes shipped in the template — keep them.
6. **Speaker notes go inside \`<aside class="notes">\` or \`<div class="notes">\`** — never as visible text on the slide.

## Attribution

Visual system, layouts, themes and the runtime keyboard model come from
the upstream MIT-licensed [\`lewislulu/html-ppt-skill\`](${UPSTREAM_URL}). The
LICENSE file ships at \`skills/html-ppt/LICENSE\`; please keep it in place when
redistributing.
`;

function frontmatter(t) {
  const triggers = t.triggers
    .map((s) => `  - "${s.replace(/"/g, '\\"')}"`)
    .join('\n');
  return [
    '---',
    `name: ${t.name}`,
    `description: ${t.description}`,
    'triggers:',
    triggers,
    'gd:',
    '  mode: deck',
    `  scenario: ${t.scenario}`,
    `  featured: ${t.featured}`,
    `  upstream: "${UPSTREAM_URL}"`,
    '  preview:',
    '    type: html',
    '    entry: index.html',
    '  design_system:',
    '    requires: false',
    '  speaker_notes: true',
    '  animations: true',
    `  example_prompt: ${JSON.stringify(t.examplePrompt)}`,
    '---',
    '',
  ].join('\n');
}

let wrote = 0;
for (const t of TEMPLATES) {
  const dir = path.join(SKILLS, `html-ppt-${t.slug}`);
  await mkdir(dir, { recursive: true });
  const skillMd = frontmatter(t) + SKILL_BODY(t);
  await writeFile(path.join(dir, 'SKILL.md'), skillMd, 'utf8');
  wrote++;
}
console.log(`[scaffold] wrote ${wrote} html-ppt-* SKILL.md files`);
