# Galyarder Design Plugin Spec Kit

Language: English

This folder is the shareable specification kit for Galyarder Design plugin authors. It is meant to work for a human reading the repo and for an external coding agent such as Claude Code, Codex, Cursor, OpenClaw, Hermes Agent, or another Agent Skills compatible tool.

Galyarder Design plugins follow the same portable shape as Agent Skills: a folder with `SKILL.md` plus optional assets, references, scripts, and examples. Galyarder Design adds `galyarder-design.json` as a sidecar so the same folder can appear in the GD plugin gallery, hydrate the home composer, declare inputs and GenUI surfaces, run an GD atom pipeline, and participate in publish or PR flows.

## Folder Map

- [`SPEC.md`](SPEC.md) - the portable plugin spec and taxonomy.
- [`AGENT-DEVELOPMENT.md`](AGENT-DEVELOPMENT.md) - copy this into an external agent session to build and validate a plugin.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) - PR standards for plugins that follow this spec.
- [`PUBLISHING-REGISTRIES.md`](PUBLISHING-REGISTRIES.md) - strategies for skills.sh, ClawHub, GitHub, and Galyarder Design publishing.
- [`templates/`](templates/) - blank starter files.
- [`examples/`](examples/) - complete example plugin folders and a sample marketplace index.

Chinese mirrors:

- [`SPEC.zh-CN.md`](SPEC.zh-CN.md)
- [`AGENT-DEVELOPMENT.zh-CN.md`](AGENT-DEVELOPMENT.zh-CN.md)
- [`CONTRIBUTING.zh-CN.md`](CONTRIBUTING.zh-CN.md)
- [`PUBLISHING-REGISTRIES.zh-CN.md`](PUBLISHING-REGISTRIES.zh-CN.md)
- [`examples/README.zh-CN.md`](examples/README.zh-CN.md)

## What To Build

Workflow lanes:

- Import - Figma, GitHub, code folders, URLs, screenshots, PDFs, PPTX, Framer, Webflow.
- Create - prototypes, slide decks, live artifacts, image assets, video prompts, HyperFrames compositions, audio assets.
- Export - PPTX, PDF, HTML, ZIP, Markdown, Figma handoff, Next.js, React, Vue, Svelte, Astro, Angular, Tailwind.
- Share - public links, GitHub PRs, Gists, Slack, Discord, Notion, Linear, Jira.
- Deploy - Vercel, Cloudflare Pages, Netlify, GitHub Pages, Fly.io, Render.
- Refine - critique, patch, tune, brand swap, A/B variants, stakeholder review.
- Extend - plugin authoring, marketplace publishing, internal catalog automation.

## Five Minute Start

1. Copy `templates/` to a new plugin folder.
2. Rename the folder and frontmatter `name` to a lowercase id such as `launch-deck`.
3. Write a pushy `description` in `SKILL.md`: "Use this plugin when..."
4. Fill `galyarder-design.json`: `specVersion`, title, plugin `version`, tags, `od.taskKind`, `od.mode`, `od.useCase.query`, `od.pipeline`, inputs, and capabilities.
5. Add a small `examples/` or `preview/` artifact if the plugin is visual.
6. Validate locally:

```bash
pnpm guard
pnpm --filter @galyarder-design/plugin-runtime typecheck
```

When the daemon CLI is built:

```bash
gd plugin validate ./path/to/plugin
gd plugin install ./path/to/plugin
gd plugin apply <plugin-id> --input key=value
```

## Compatibility Promise

A folder with `SKILL.md` can be used as a plain skill in Agent Skills compatible clients. Adding `galyarder-design.json` should never make the skill less portable; it only adds Galyarder Design product behavior.

References:

- Agent Skills overview: https://agentskills.io/home
- Agent Skills specification: https://agentskills.io/specification
- Galyarder Design plugin spec: ../../docs/plugins-spec.md
