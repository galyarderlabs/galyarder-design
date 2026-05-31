# Magazine Web PPT Skill

> 🌏 **English version: [README.en.md](./README.en.md)**

A [Claude Code / Claude Agent Skills](https://agentskills.io/) skill for generating **single-file HTML horizontal-swipe slide decks**, with a visual tone of "**editorial magazine × electronic ink**" — *Monocle* with a layer of code on top.

> Distilled by [Guizang](https://x.com/op7418) from offline talks like "The One-Person Company: Organizations Folded by AI" and "A New Way of Working." Every pitfall encountered along the way is captured in `checklist.md`.

![Magazine Web PPT preview](https://github.com/user-attachments/assets/5dc316a2-401c-4e37-9123-ea081b6ae470)

## What it produces

- 🖋 Three-tier typography: **serif headlines + sans-serif body + monospace metadata**
- 🌊 **WebGL fluid / dispersion backgrounds** — visible on hero pages, restrained elsewhere
- 📐 **Horizontal swipe navigation**: keyboard ← → / scroll wheel / touch swipe / footer dots / ESC overview
- 🎨 **Five theme presets**: Ink Classic / Indigo Porcelain / Forest Ink / Kraft Paper / Dune
- 🧩 **Ten page layouts**: hero cover, act divider, big-numbers grid, text + image, image grid, pipeline, hero question, big quote, before/after, mixed media
- 📄 **Single-file HTML**: no build step, no server, opens directly in any browser

## When to use it (and when not to)

**✅ Good fit**: offline talks, internal industry sessions, private gatherings, AI product launches, demo days, presentations with a strong personal voice.

**❌ Poor fit**: dense tabular data, training material (information density too low), or anything that needs collaborative editing (this is static HTML).

## Installation

### Option 1: Send this prompt directly to your AI agent (recommended)

> Please install the `guizang-ppt-skill` Claude Code skill for me. Steps:
>
> 1. Make sure `~/.claude/skills/` exists (create it if not).
> 2. Run `git clone https://github.com/op7418/guizang-ppt-skill.git ~/.claude/skills/magazine-web-ppt`.
> 3. Verify: `ls ~/.claude/skills/magazine-web-ppt/` should show `SKILL.md`, `assets/`, and `references/`.
> 4. Tell me when it's installed. Afterwards, when I say something like "make me a magazine-style deck," this skill should trigger.

Paste this into Claude Code, Cursor, or any AI agent with shell access and it will handle installation.

### Option 2: Manual command line

```bash
git clone https://github.com/op7418/guizang-ppt-skill.git ~/.claude/skills/magazine-web-ppt
```

### How it triggers

Once installed, Claude Code will automatically discover and invoke the skill from conversation. Trigger phrases:

- "Make me a magazine-style deck"
- "Generate a horizontal swipe deck"
- "Editorial magazine style presentation"
- "Electronic-ink style talk slides"

## Workflow

The skill is structured as a six-step workflow that Claude walks through:

1. **Clarify requirements** — six-question checklist: audience, duration, source material, imagery, theme color, hard constraints
2. **Copy the template** — `assets/template.html` → project directory, update `<title>`, swap theme color
3. **Fill in content** — pick from the ten layout skeletons, paste, edit copy (preflight class names + plan the theme rhythm first)
4. **Self-check** — work through `references/checklist.md`; every P0 item must pass
5. **Preview** — open in a browser
6. **Iterate** — adjust font sizes, heights, and spacing via inline styles

See [`SKILL.md`](./SKILL.md) for full details.

## Directory layout

```
magazine-web-ppt/
├── SKILL.md              ← Skill entry point: workflow, principles, common mistakes
├── README.md             ← This file
├── assets/
│   └── template.html     ← Complete runnable seed HTML (CSS + WebGL + swipe JS pre-wired)
└── references/
    ├── components.md     ← Component reference (typography, color, grids, icons, callouts, stats, pipeline)
    ├── layouts.md        ← Ten page-layout skeletons (paste-ready)
    ├── themes.md         ← Five theme presets (pick one, no custom values)
    └── checklist.md      ← Quality checklist (graded P0 / P1 / P2 / P3)
```

## Theme presets

Pick one set from `references/themes.md` — **no custom hex values are allowed**. Protecting the aesthetic matters more than freedom of choice.

| Theme | Best for |
|------|---------|
| 🖋 Ink Classic | General default, business launches, when in doubt |
| 🌊 Indigo Porcelain | Tech / research / AI / technical launches |
| 🌿 Forest Ink | Nature / sustainability / culture / nonfiction |
| 🍂 Kraft Paper | Nostalgia / humanities / literary / indie magazines |
| 🌙 Dune | Art / design / creative / gallery |

To switch themes, replace just the six variables inside the `:root{}` block at the top of `template.html`. Every other CSS rule reads from `var(--...)`.

## Core design principles

1. **Restraint over flash** — WebGL backgrounds only break through on hero pages
2. **Structure over decoration** — information ranks via type size, font contrast, and grid whitespace; no shadows or floating cards
3. **Images come first** — only ever crop the bottom; top, left, and right stay intact
4. **Rhythm comes from hero pages** — alternating hero / non-hero pages keeps the eye fresh
5. **Consistent terminology** — Skills stays "Skills"; no half-translated mixed terms

## Visual references

- The page layouts of [*Monocle*](https://monocle.com)
- YC Garry Tan's "Thin Harness, Fat Skills"
- The Guizang offline talk deck series

## Contributing

Bugs, layout issues, new layout requests — open an issue or PR. When contributing, please:

- Define new classes inside `template.html` instead of letting `layouts.md` reference undefined classes
- Add lessons learned to the matching P0 / P1 / P2 / P3 section of `checklist.md`
- Add new theme colors to `themes.md` along with the scenarios they fit

## License

MIT © 2026 [op7418](https://github.com/op7418)
