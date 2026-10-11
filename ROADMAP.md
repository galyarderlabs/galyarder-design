# Galyarder Design — Roadmap

Galyarder Design is a local-first design engine that turns a natural-language brief into editable, previewable design artifacts — prototypes, landing pages, decks, dashboards, and mobile screens — by orchestrating the code-agent CLI already installed on the user's machine. It is for founders, solo developers, and small teams who think in systems and want design output as real files on disk rather than pixels locked inside a hosted canvas. The problem it addresses is the gap between a brief and a usable artifact: most design tools bolt an AI chat onto a canvas, but the leverage comes from giving the agent a structured environment — an on-disk design language, deterministic palettes, a critique checklist, and a filesystem it can write to.

## Where this comes from

Galyarder Design is a modified derivative of [open-design](https://github.com/nexu-io/open-design) (Apache-2.0). Substantial portions of the daemon, web runtime, skill catalog, design systems, design templates, and plugin surface originate from that project; Galyarder Labs renamed the product and package scopes, renamed the CLI binary (`od` to `gd`), replaced the bundled plugin manifest, and rebranded the documentation and desktop shell. The full statement of changes is in [`NOTICE`](NOTICE), and upstream copyright and license are retained in [`LICENSE`](LICENSE). The direction that is Galyarder's own is the product framing — "the design engine of your Agentic Company" — and the continued extension of the plugin surface, live artifacts, media generation, and headless `gd` CLI on top of that base.

## Where it is now

The repository is not a thin shell. It ships a large, real surface (verified against the live `main` tree and the local checkout):

- **Workspace layout.** pnpm workspace with `apps/*` (daemon, web, desktop, packaged, landing-page, telemetry-worker), `packages/*` (contracts, plugin-runtime, registry-protocol, host, sidecar, sidecar-proto, platform, download, diagnostics, agui-adapter), and `tools/*` (dev, pack, pr, serve). Root `package.json` is `galyarder-design@1.0.0`, Apache-2.0, private.
- **Two runtimes.** `apps/daemon` is a long-running Node daemon that owns `/api/*`, agent spawning, skills, design systems, and artifacts; `apps/web` is a Next.js App Router web client. The daemon listens on port **7456** by default (`apps/daemon/src/daemon-url.ts` — `DEFAULT_DAEMON_URL = "http://127.0.0.1:7456"`).
- **Agent detection.** The daemon scans `PATH` (plus common user toolchain dirs) for agent executables (`apps/daemon/src/runtimes/executables.ts`, `detection.ts`). The runtime registry defines 17 built-in agent definitions (`apps/daemon/src/runtimes/registry.ts`): Claude Code, Codex, Devin, Gemini, OpenCode, Hermes, Grok Build, Kimi, Cursor Agent, Qwen, Qoder, GitHub Copilot CLI, Pi, Kiro, Kilo, Mistral Vibe, and DeepSeek.
- **Skills and templates.** `skills/` holds **132** skill folders (each with a `SKILL.md`); `design-templates/` holds **110** rendering templates; `craft/` holds 12 brand-agnostic craft rulebooks. The README claims "130+ design skills" — the tree confirms 132.
- **Design systems.** `design-systems/` holds **151** folders, 150 of which contain a `DESIGN.md` in the 9-section schema (`docs/design-systems.md`).
- **Visual directions.** Five curated directions are defined in `apps/daemon/src/prompts/directions.ts` and mirrored in `packages/contracts/src/prompts/directions.ts`: `editorial-monocle`, `modern-minimal`, `human-approachable`, `tech-utility`, `brutalist-experimental`. Each carries an OKLch palette and font stacks. Note: the README names the third direction "Warm Soft", but the code id is `human-approachable` — the README label and the source diverge.
- **Modes.** `docs/modes.md` describes four modes — Prototype, Deck, Template, Design System.
- **Headless CLI.** The `gd` binary (`apps/daemon/src/cli.ts`, `bin.gd` → `apps/daemon/src/cli.ts`) exposes `gd research`, `gd media`, `gd mcp`, `gd plugin`, `gd automation`, `gd memory`, `gd ui`, `gd diagnostics`, `gd tools`, and `gd artifacts`.
- **Local persistence.** Embedded SQLite via `better-sqlite3` (`apps/daemon/src/db.ts`) and POSIX IPC sockets (`packages/sidecar/src/index.ts` uses `node:net`).
- **Live artifacts and connectors.** `apps/daemon/src/live-artifacts/` and `connectors/` implement refreshable, data-backed artifacts, specified in `specs/2026-04-29-live-artifacts/spec.md`.
- **Media generation.** Provider registry in `apps/daemon/src/media-models.ts` lists Fal.ai, Leonardo.ai, Replicate, MiniMax, ElevenLabs, FishAudio, and SenseAudio; `gpt-image-2`, `seedance`, and `hyperframes-html` models appear in `cli.ts` and `prompts/media-contract.ts`.
- **Plugins.** `plugins/_official/` (first-party), `plugins/community/`, and `plugins/registry/` with a generated marketplace manifest; 177 `SKILL.md` files live under `plugins/`.
- **Critique Theater.** `apps/daemon/src/critique/` implements a scored design-review subsystem (rollout, ratchet, conformance, persistence).
- **Docs and localization.** `docs/` carries spec, architecture, skills-protocol, agent-adapters, modes, and roadmap docs. The web client ships 17 locale files (`apps/web/src/i18n/locales/`). `e2e/` holds Playwright smoke tests.

Parts that are thin or in flux:

- **The README is ahead of the checkout.** The published `main` README includes a "Lineage and attribution" section and a `NOTICE` file that the local checkout at `/tmp/repo_intel/galyarder-design` (commit `af191be`) does not yet contain; the live remote head is `68d548d`.
- **`docs/roadmap.md` describes an earlier plan.** It is written as "spec-only today → usable MVP → v1", while the shipped product is already at `1.0.0`. The older phase plan and the current code have drifted apart.
- **Naming residue.** Some docs and the architecture file still reference `od` (the upstream binary name) where the product now uses `gd`, and the README direction names do not match the code ids (see above).

## Now

- **Reconcile the README, NOTICE, and checkout.** The published README and `NOTICE` are correct and public; make sure the working tree matches so contributors are not reading a different attribution story than the one shipped.
- **Rewrite `docs/roadmap.md` to match reality.** Replace the "spec-only → MVP" framing with a plan that starts from the shipped `1.0.0` and states what is next.
- **Fix direction-name drift.** Align the README's "Warm Soft" label with the `human-approachable` id (or rename the id), so the picker copy and the source agree.
- **Sweep `od` → `gd` in user-facing docs.** The CLI rename is done in code; finish it in the documentation surfaces that still say `od`.
- **Keep the plugin manifest regenerated.** The marketplace manifest is generated from `plugins/_official`; wire the regeneration into the same check the guard script runs so catalog and source cannot drift.

## Next

- **Finish the remote-access tiers.** `docs/roadmap.md` lays out RA0 (LAN), RA1 (tunnel via `gd daemon --expose`), and RA2 (relay + QR pairing). RA0 is documented as working today; the blocker for RA1 is the configurable daemon base URL and a bearer-auth fetch wrapper in `apps/web` (today every `fetch('/api/*')` is same-origin).
- **Grow the connector and live-artifact loop.** Turn the live-artifacts spec into more first-party connector skills so refreshable artifacts are routine rather than a demo.
- **Consolidate the self-evolution track.** The SE0–SE5 milestones (memory tree, automation template registry, design-system extraction, connector ingestion, token compression) are specified but only partly wired; land SE1 and SE2 end to end before adding more.
- **Broaden the agent adapter matrix with capability gates.** 17 definitions exist; make per-adapter capability flags and feature gating visible in-product so a weaker CLI degrades predictably.

## Later

- **Multi-device and shared use.** RA2 relay pairing is the long-horizon tier; it is the largest effort and is explicitly gated on multi-device need being real.
- **Skill marketplace with trust signals.** Plugin install, publish, and trust badges exist; the longer direction is a searchable, categorized marketplace with signing or checksums.
- **Design-system extraction and "freeze prototype as design system".** The automation track names design-system extraction proposals; the product-level version is promoting a finished artifact into a reusable `DESIGN.md`.

## Not planned

- **A hosted-only, closed-source service.** The product is local-first and Apache-2.0; there is no plan to relicense or to make a cloud the primary path.
- **Owning the model or the agent loop.** The design bet is to integrate the user's existing agent CLI and use BYOK, not to ship a proprietary model or reimplement the agent.
- **A proprietary skill format.** Skills stay file-based `SKILL.md` folders that third parties can fork and drop in.
- **Pushing the agent loop into edge runtimes.** The daemon must stay on the user's machine because it spawns local CLIs and touches the filesystem; only the UI and an optional relay move off-box.

## How to follow along

The repository is the record: `README.md` and `QUICKSTART.md` for onboarding, `docs/` for the product spec and architecture, `docs/roadmap.md` for the phased plan (until it is rewritten), `CHANGELOG.md` for what shipped, and `CONTRIBUTING.md` for the contribution bar. Issues and pull requests on the GitHub repository are the working surface.
