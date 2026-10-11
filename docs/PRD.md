# Galyarder Design — Product Requirements

**Status**: Draft
**Scope**: A local-first design engine that turns natural-language briefs into editable, previewable design artifacts (prototypes, decks, landing pages, dashboards, mobile screens) by orchestrating the code-agent CLI already installed on the user's machine.

## Problem

Design tools usually put AI in a chat box beside a canvas. That leaves the agent without context: it does not know the brand's design language, it invents colors and type on every turn, and it has no durable place to write its output. The result is disposable mockups and a human who becomes the integration point between the model and the design system.

The harder problem is structural: an agent that produces production-grade visual work needs a governed environment — an on-disk design language it must read, deterministic palettes and font stacks it may not improvise, a self-critique checklist it runs before emitting, and a working filesystem it writes real files into. Galyarder Design packages that environment and wires it to the local coding agents a developer already has, so design output is reproducible, inspectable, and lives in the user's own directories rather than a vendor cloud.

## Who it is for

- **Founders and solo developers** who need prototypes, landing pages, decks, and dashboards but do not run a design team.
- **Developers who already use a coding-agent CLI** (Claude Code, Codex, Cursor, Devin, Gemini, OpenCode, and others) and want that same engine to produce design artifacts.
- **Small teams that think in systems** and want a shared, file-based design language (`DESIGN.md`) rather than a locked canvas.
- **Skill and plugin authors** who want to add design capability as a forkable `SKILL.md` folder.
- **Automation builders** who want to drive the engine headlessly from scripts, CI, or chat bots.

## Goals

- Turn a brief into a real, editable artifact on disk with minimal ceremony.
- Give the agent a structured design environment: on-disk design systems, deterministic visual directions, and universal craft rules.
- Integrate the user's existing agent CLI instead of owning the model or the agent loop.
- Keep everything local-first: files in the user's directories, an embedded local store, no required account.
- Make the whole engine scriptable through a headless CLI.
- Keep the skill catalog, design systems, and plugin surface extensible by third parties.

## Non-goals

- Not a hosted SaaS product; the primary path runs on the user's machine.
- Not a proprietary model or a bundled agent runtime; it delegates to external CLIs and BYOK.
- Not a proprietary skill format; skills stay file-based `SKILL.md` folders.
- Not a pixel-level vector editor or a Figma replacement.
- Not a closed plugin store; the registry surface is inspectable and forkable.

## Requirements

### Workspace and runtime

- **R1 — Local daemon plus web client.** The product should run as a long-running local daemon that owns the API, agent spawning, and artifact serving, with a browser client on top. `[implemented]` — `apps/daemon` (owns `/api/*`) and `apps/web` (Next.js App Router); default daemon URL `http://127.0.0.1:7456` in `apps/daemon/src/daemon-url.ts`.
- **R2 — Workspace with optional desktop shell.** A user should be able to run the web client alone or with an Electron desktop shell that discovers the web URL over sidecar IPC. `[implemented]` — `apps/desktop` (Electron shell) and `apps/packaged` (packaged runtime entry); `packages/sidecar` provides the IPC transport.
- **R3 — Embedded local persistence.** Project state should persist locally without an external database server. `[implemented]` — `better-sqlite3` used across `apps/daemon/src/db.ts` and feature stores; POSIX IPC sockets in `packages/sidecar/src/index.ts`.
- **R4 — Zero-config local start.** A developer should clone, install, and start everything with one command. `[implemented]` — `pnpm tools-dev start` via `tools/dev`; documented in `README.md` and `QUICKSTART.md` (requires Node ~24, pnpm 10.33.2).

### Agent integration

- **R5 — Detect installed agent CLIs on PATH.** The daemon should discover which coding-agent executables the user has installed. `[implemented]` — `apps/daemon/src/runtimes/executables.ts` and `detection.ts` scan `PATH` plus common toolchain directories.
- **R6 — Broad built-in agent support.** A range of agent CLIs should be supported out of the box, with the ability to swap the engine. `[implemented]` — 17 definitions in `apps/daemon/src/runtimes/registry.ts` (Claude Code, Codex, Devin, Gemini, OpenCode, Hermes, Grok Build, Kimi, Cursor Agent, Qwen, Qoder, Copilot CLI, Pi, Kiro, Kilo, Mistral Vibe, DeepSeek).
- **R7 — Custom local agent profiles.** A user should be able to add their own agent profile beyond the built-in set. `[implemented]` — `apps/daemon/src/runtimes/local-profiles.ts` merged into `AGENT_DEFS`.
- **R8 — Per-agent capability gating.** Features that a given agent cannot support should be gated rather than failing silently. `[partial]` — capability metadata exists (`apps/daemon/src/runtimes/capabilities.ts`) but per-adapter gating is not surfaced consistently across the UI.
- **R9 — BYOK API fallback.** When no local agent is installed, the product should still be usable through a direct API mode with the user's own key. `[implemented]` — BYOK tooling in `apps/daemon/src/byok-tools.ts`; the README and QUICKSTART describe API mode from Settings.

### Skills, templates, and craft

- **R10 — File-based skills.** Design capability should be packaged as forkable, drop-in skill folders with a manifest. `[implemented]` — `skills/` (132 folders, each with `SKILL.md`); protocol in `docs/skills-protocol.md`.
- **R11 — Rendering templates.** A catalog of rendering templates should cover decks, prototypes, and image/video/audio outputs. `[implemented]` — `design-templates/` (110 folders with `SKILL.md`).
- **R12 — Brand-agnostic craft rules.** Universal design rules that apply regardless of brand should be injectable into the agent prompt. `[implemented]` — `craft/` (12 rulebooks incl. `typography.md`, `color.md`, `anti-ai-slop.md`, `accessibility-baseline.md`), injected per skill via `craft.ts`.
- **R13 — Multiple user-facing modes.** The product should expose distinct modes (Prototype, Deck, Template, Design System), each with its own workflow. `[implemented]` — `docs/modes.md`; mode semantics enforced in the skills protocol.
- **R14 — Self-critique before emit.** The agent should be able to run a structured design review on its own output. `[implemented]` — 5-dimension critique skill (`design-templates/critique/SKILL.md`, `plugins/_official/examples/critique/`) scoring Philosophy / Visual hierarchy / Detail / Functionality / Innovation.

### Design systems and visual directions

- **R15 — On-disk design systems in a fixed schema.** Brand design languages should be authored as `DESIGN.md` files following a documented section schema. `[implemented]` — `design-systems/` (150 `DESIGN.md` files) against the 9-section schema in `docs/design-systems.md`.
- **R16 — Deterministic visual directions.** When no brand exists, the user should pick from a fixed set of directions that map to deterministic palettes and font stacks, with no model improvisation. `[implemented]` — five directions in `apps/daemon/src/prompts/directions.ts` (and `packages/contracts/src/prompts/directions.ts`), each with an OKLch palette and font stacks bound into the seed `:root`.
- **R17 — Direction picker with accent override.** The direction step should render as a rich picker and allow an accent override. `[implemented]` — `renderDirectionFormBody()` emits a `direction-cards` question plus an `accent_override` text field.
- **R18 — Design-system picker wired into generation.** The active design system should be read by every skill as part of its system prompt. `[implemented]` — `design-systems/README.md` and `apps/daemon/src/design-systems.ts`.

### Artifacts, preview, and export

- **R19 — Sandboxed preview.** Generated output should render inside a sandboxed iframe. `[implemented]` — `sandbox="allow-scripts"` iframes in `apps/web/src/components/FileWorkspace.tsx`, `DesignFilesPanel.tsx`, `FileViewer.tsx`.
- **R20 — Live, refreshable artifacts.** Beyond one-off files, the product should support artifacts backed by data sources that can be refreshed later. `[implemented]` — `apps/daemon/src/live-artifacts/` (store, render, refresh-service) and `specs/2026-04-29-live-artifacts/spec.md`.
- **R21 — Connectors as a data source.** Live artifacts should be feedable from external connectors with safety metadata. `[implemented]` — `apps/daemon/src/connectors/catalog.ts` (side-effect and approval fields per tool) and `connectors/service.ts`.
- **R22 — Multi-format export.** Artifacts should be exportable to portable formats (HTML, PDF, ZIP, and presentation formats). `[partial]` — `apps/daemon/src/pdf-export.ts`, `import-export-routes.ts`, and `artifact-manifest.ts` exist; PPTX is referenced in `artifact-manifest.ts` and `projects.ts`, but the older `docs/roadmap.md` still lists PPTX/PDF as future work, so the shipped state is mixed.

### Media and motion

- **R23 — Image, video, and audio generation.** The product should generate media assets through configured providers. `[implemented]` — `apps/daemon/src/media-models.ts` and `media-config.ts` register Fal.ai, Leonardo.ai, Replicate, MiniMax, ElevenLabs, FishAudio, and SenseAudio; `gd media generate` in `apps/daemon/src/cli.ts`.
- **R24 — HTML-to-video (HyperFrames) path.** HTML-based motion generation should be a first-class media surface. `[implemented]` — `hyperframes-html` carve-out in `apps/daemon/src/prompts/media-contract.ts`; `skills/video-hyperframes/`.

### Headless CLI, MCP, and automation

- **R25 — Headless CLI covering the capability surface.** The engine should be fully drivable from a command line. `[implemented]` — `gd` binary (`bin.gd` → `apps/daemon/src/cli.ts`) exposing `research`, `media`, `mcp`, `plugin`, `automation`, `memory`, `ui`, `diagnostics`, `tools`, `artifacts`.
- **R26 — MCP server for external agents.** An external coding agent should be able to pull project files and create project-scoped artifacts over MCP. `[implemented]` — `gd mcp` and `gd mcp live-artifacts` (`apps/daemon/src/mcp.ts`, `mcp-live-artifacts-server.ts`).
- **R27 — Automation surface with review gates.** Scheduled routines and proposals should be reviewable before they change memory, skills, or design systems. `[partial]` — `gd automation` and the `/api/automation-proposals` surface exist, and the SE0–SE5 milestones in `docs/roadmap.md` describe the target, but the track is only partly wired.

### Plugins and registry

- **R28 — Portable plugin contract.** A plugin should be a portable skill folder with a manifest, publishable and installable. `[implemented]` — `plugins/spec/SPEC.md`, `plugins/README.md`, and manifest schema `docs/schemas/galyarder-design.plugin.v1.json`.
- **R29 — Official and community registry.** First-party plugins should ship bundled, with a community catalog and a generated marketplace manifest. `[implemented]` — `plugins/_official/`, `plugins/community/`, and `plugins/registry/official/galyarder-design-marketplace.json` (400 entries; 177 `SKILL.md` files under `plugins/`).
- **R30 — Plugin install/upgrade/publish CLI.** Users should manage plugins headlessly. `[implemented]` — `gd plugin <list|install|upgrade|uninstall|publish|publish-repo|doctor|trust|…>` in `apps/daemon/src/cli.ts`.

### Governance, docs, and localization

- **R31 — Scored critique subsystem.** The product should support an automated, scored design-review pipeline with rollout control. `[implemented]` — `apps/daemon/src/critique/` (orchestrator, ratchet, conformance, scoreboard, persistence).
- **R32 — Localization.** The web client should be usable in multiple languages. `[implemented]` — 17 locale files in `apps/web/src/i18n/locales/`; CJK font fallback referenced in `apps/daemon/src/prompts/system.ts`.
- **R33 — Attribution and license hygiene.** The derivative lineage should be disclosed and upstream copyright retained. `[implemented]` — `NOTICE` and the README "Lineage and attribution" section on the live `main`; `LICENSE` is Apache-2.0. (Note: the local checkout at commit `af191be` predates both; the live remote head `68d548d` contains them.)

## Success signals

- A user with an agent CLI installed can go from clone to a generated prototype and a deck without leaving their own machine.
- Generated work respects the active `DESIGN.md` and a chosen visual direction instead of inventing a palette each turn.
- Artifacts are plain files in the user's directories that `git` can track and a reviewer can read.
- The same capability is reachable from the web UI and from the `gd` CLI headlessly.
- Third parties can add a skill or a plugin without a maintainer in the loop.

## Open questions

- **Which export formats are actually shipped?** PPTX is referenced in `artifact-manifest.ts`/`projects.ts` but listed as future work in `docs/roadmap.md`. The current true export matrix needs a single authoritative statement.
- **How far does per-adapter capability gating go?** Capability metadata exists; the plan for surfacing it consistently (and for the fallback chain) is undecided.
- **What is the state of the self-evolution track?** SE1–SE5 are specified in `docs/roadmap.md`; which of them are actually consumed by a later agent run without extra prompting is not verified here.
- **Is `docs/roadmap.md` still authoritative?** It frames the product as pre-MVP while the repo ships `1.0.0`, so its phase plan should be reconciled or replaced.
- **Remote access timing.** RA0 (LAN) is documented as working; RA1/RA2 depend on a configurable daemon base URL and a relay that do not exist yet. When these become a priority is unresolved.
- **README vs code naming drift.** The README's "Warm Soft" direction does not match the code id `human-approachable`; the canonical label needs a decision.

## License note

Galyarder Design is licensed **Apache-2.0**, a permissive license that permits modification and redistribution provided the license, copyright notices, and a statement of changes are preserved. It is **not** AGPL-3.0, so there is no network-copyleft obligation here. However, because this repository is a derivative of open-design (Apache-2.0), the upstream `LICENSE` and the `NOTICE` statement of changes must be kept intact in any redistribution.
