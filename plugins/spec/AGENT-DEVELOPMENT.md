# Agent Development Handoff

Language: English

Give this file to a coding agent when you want it to create or improve an Galyarder Design plugin.

## Mission

Create a portable Galyarder Design plugin that can:

1. Run as a normal Agent Skill through `SKILL.md`.
2. Install into Galyarder Design through `galyarder-design.json`.
3. Be validated locally.
4. Be published as an independent open source repo or submitted as a PR to Galyarder Design.

## Required Reading

Read these files before editing:

- `plugins/spec/SPEC.md`
- `docs/schemas/galyarder-design.plugin.v1.json`
- `docs/plugins-spec.md` when you need deeper product semantics
- `plugins/spec/PUBLISHING-REGISTRIES.md` when the user asks to publish outside Galyarder Design
- A nearby example under `plugins/spec/examples/`

## Build Procedure

1. Choose a lowercase plugin id, for example `import-screenshot-to-prototype`.
2. Create a folder with at least:

```text
<plugin-id>/
  SKILL.md
  galyarder-design.json
  README.md
```

3. Keep the `SKILL.md` portable. It may mention Galyarder Design behavior, but the core workflow must still make sense in any Agent Skills compatible agent.
4. Put OD-specific display, `specVersion`, plugin `version`, inputs, preview, pipeline, atoms, connectors, and capabilities in `galyarder-design.json`.
5. Add `examples/`, `preview/`, `assets/`, or `references/` only when they materially help the agent produce better results.
6. Add `evals/evals.json` when the plugin has enough behavior to regress.
7. If publishing externally, prepare registry-safe README sections for skills.sh, ClawHub, and canonical GitHub source.

## Quality Bar

The plugin is not done until:

- `SKILL.md` has a clear "Use this plugin when..." description.
- The workflow states the expected output files or handoff result.
- `galyarder-design.json` validates against the v1 shape and carries explicit `specVersion` plus plugin `version`.
- The declared atoms are known first-party atoms or clearly marked future work.
- The declared capabilities are the minimum needed.
- Visual plugins include a preview or concrete example output.
- Share, deploy, connector, and network plugins require explicit confirmation before externally visible actions.

## Validation Commands

Run what is available in this environment:

```bash
pnpm guard
pnpm --filter @galyarder-design/plugin-runtime typecheck
```

If the daemon CLI is built:

```bash
gd plugin validate ./<plugin-id>
gd plugin install ./<plugin-id>
gd plugin apply <plugin-id> --input key=value
```

## PR Output

When opening or preparing a PR, include:

- Plugin id, spec version, plugin version, and lane.
- What user request should trigger it.
- Files changed.
- Validation commands and results.
- Capabilities requested.
- Screenshots, preview URLs, or example artifacts for visual plugins.
- Registry links and dry-run output when publishing to skills.sh, ClawHub, or another skill registry.
