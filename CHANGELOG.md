# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-05-31

First public release of Galyarder Design — a local-first design product that detects your installed coding-agent CLI, runs design skills + design systems, and streams artifacts into a sandboxed preview.

**Architecture:** **everything is a plugin**, **headless by default**, **plugins create plugins**. A small, boring engine plus a plugin surface — design systems, slices, prototypes, exports, and Figma itself all live in plugins. The desktop app is a thin wrapper around the GD CLI, so the same engine runs in Claude Code, OpenClaw, Hermes Agent, and chat bots in Lark / Discord / Slack. **Critique Theater** ships through **Phase 16** (rollout ratchet, conformance API, 9 Prometheus metrics, Grafana dashboard, M0 dark-launch by default). **149 design systems** ship with structured `tokens.css` + components manifests. **17 locales** + **CJK font fallback**. Media providers include **Leonardo.ai**, **ElevenLabs**, **SenseAudio**. **Packaged auto-update** on both **macOS and Windows**. Plus a **top-bar entry layout refresh**, **Quick-brief discovery**, **PostHog v2 analytics schema**, **manual edit UX** (focus mode, uploads, remove-element patch), **custom CLI agent profiles**, and an **HTML Anything** landing page.

### Added
- **Remote access plan** — `docs/plans/cloud-dashboard-local-daemon.md` lays out the end-to-end design for a cloud UI + local daemon, with LAN, tunnel, and Paseo-style relay+QR tiers.
- **Remote access roadmap track** — RA0 (LAN), RA1 (tunnel), RA2 (relay + QR) milestones plus a decision-log entry in `docs/roadmap.md`.

### Changed
- **Web UI/UX refresh** — top-bar entry layout, reworked home hero, updated design tokens, and locale string updates across all 17 locales.

### Fixed
- **Stale brand residue** — the footer mega kicker rendered `Open Design.`; it now reads `Galyarder Design.` across the landing templates, bundled examples, and `apps/landing-page`.

<details>
<summary>Capabilities included in 1.0.0 (detailed breakdown)</summary>

### Added

#### Plugin engine, registry & publishing
- **Plugin engine rebuild** with `packages/plugin-runtime`, `packages/registry-protocol`, and `packages/host` — the engine surfaces the plugin lifecycle through a small, neutral API so design systems, slices, prototypes, exports, and even Figma itself can live as plugins.
- **Plugin registry detail drawer** with trust badges and marketplace metadata. ([#2087])
- **GitHub rate-limit fallback for marketplace plugins** keeps install / refresh flows reliable when GitHub API is throttled. ([#2064])
- **Plugin Publish-repo flow creates the author's repo correctly.** ([#2332], [#2363])
- **CLI plugin publish reads manifest version** when the stored row is the `0.0.0` sentinel. ([#1903])
- **Block raw publish CLIs from the authoring summary** — keep agents on the GD publish path. ([#2380])
- **Demote Plugins + Integrations to the nav rail footer** so primary surface stays focused. ([#1806], [#2360], [#2397])

#### Critique Theater (Phases 9 – 16)
- **Phase 9** — drop-in mount wrapper, native i18n for `de` / `ja` / `ko` / `zh-TW`. ([#1315])
- **Phase 10** — daemon adapter conformance lab + degraded registry. ([#1316])
- **Phase 11** — Playwright stage suite (happy path, interrupt, 3 viewports, a11y). ([#1317], [#1483])
- **Phase 12** — 9 Prometheus metrics + 6 log events + OTel span + Grafana dashboard. ([#1485])
- **Phase 13** — reducer p99 benchmark + surface coverage walker. ([#1318])
- **Phase 15** — rollout resolver + Settings toggle hook. ([#1320])
- **Phase 16** — M-phase rollout ratchet + `/api/critique/conformance`. ([#1499])
- **Wireup with M0 dark-launch by default.** ([#1338])
- **Settings toggle** with dedicated section + i18n keys across 6 locales. ([#1484])

#### Design systems & tokens
- **Token channel default-on (PR-D)** so the new fixture pipeline is the default surface. ([#1544])
- **Structured `tokens.css` for 60+ new brands** across AI, devtool, SaaS, fintech, docs, consumer, hardware, cultural categories (Apple, Stripe, Airbnb, Vercel, Notion, Linear, GitHub, Figma, Slack, Discord, OpenAI, Shopify, Spotify, Uber, Cursor, and many more). ([#1652], [#1794], [#1841], [#2023], [#2028], [#2029], [#2033])
- **Token fixture catalog** — 20 brand + 20 product + remaining style fixtures, component-fixture coverage report. ([#2037], [#2040], [#2043], [#2049])
- **Component manifests** — extract + consume manifests for design systems. ([#2051])
- **Import design-system projects** via the discovery flow.
- **Perplexity design system.** ([#1747])

#### Agents, providers & media
- **Local custom CLI agent profiles** for arbitrary CLI agents. ([#378])
- **Leonardo.ai image provider.** ([#1123])
- **ElevenLabs audio support.** ([#1384])
- **SenseAudio TTS provider** + BYOK chat with image / video generation tools. ([#1633], [#2065])
- **User-configurable model alias for the media dispatcher.** ([#1277])
- **Cursor Agent live model id parsing** + auth diagnostics. ([#1538], [#2228])

#### Web UI
- **Manual edit UX overhaul** — focus mode, inline uploads, remove-element patch. ([#1516])
- **Manual edit inspector.** ([#1448])
- **Tweaks toolbar bound to the artifact panel** (toggle visibility from the panel chrome).
- **Custom select primitive** for cleaner dropdowns.
- **Collapsible comment side panel.**
- **Export as image** in the share menu.
- **Render GFM tables in markdown artifacts and chat.**
- **Surface saved Project instructions** for review and retrieval.
- **Copy-to-clipboard for user messages.**
- **Filter-by-kind dropdown** on the design-files viewer.

#### Discovery & onboarding
- **Quick-brief: collapse freeform clarification into a single form.** ([#2226])
- **Plugin inputs as authoritative Quick-brief answers.** ([#2243])
- **Stabilize discovery brand answers** in prompts. ([#1861])
- **Daemon surfaces discovery form answers to agents.** ([#2071])

#### Desktop & packaging
- **Packaged auto-update for both macOS and Windows.** ([#2362], [#2270], [#2403])
- **Updater hardening** through the preview cycle — release validation, deferred installer on Windows, applied-state clearing, download / install handoff hardening, smoke-recovery. ([#2565], [#2575], [#2592], [#2595], [#2677], [#2687], [#2700])
- **Desktop updater UI flow** — new in-app updater popup.
- **Packaged update apply observations** captured for telemetry / debugging. ([#2429])
- **Nightly + preview package identity** so beta installs don't collide with stable. ([#2437])
- **macOS Dock icon stays put** when desktop-pet window opens. ([#2413])
- **Refresh Galyarder Design app visuals** — new app icons, logo, brand glyphs. ([#2436])
- **Linux packaged client parity smoke coverage.**
- **Ensure node binary dir is on PATH for agent sub-processes on Windows.** ([#1989])

#### Internationalization
- **Italian (it) locale** — full UI translation, brings supported languages to 19. ([#1323])
- **CJK font fallback** for Chinese / Japanese / Korean. ([#2227])
- **Refresh + polish French UI locale.**
- **Translate template platform selection + Companion surfaces to Chinese.** ([#1491])
- **Localize accent controls in settings**, comment-panel strings ([#1390], [#1392]), and skill validation messages.

#### Analytics, observability & infra
- **PostHog v2 event schema.** ([#2285])
- **Unify `page_name` + onboarding / design-system page_views.** ([#2390])
- **Upgrade `posthog-node` 4 → 5 in the daemon.** ([#2309])
- **One-click log export from Settings → About.**

#### Templates, landing & tutorials
- **HTML Anything page + responsive landing header.** ([#2452])
- **Rebuild `/templates` catalog from `design-templates`.** ([#2369])
- **Refresh templates + add tutorials channel** on the landing site. ([#2409])
- **Blog routes** on the landing site.
- **Search Console reporting workflows** + GSC report opportunities. ([#2388])
- **WeRead year-in-review HyperFrames template.**

### Changed

- **Critique Theater dark-launched at M0 by default**, gated through the new rollout ratchet so phases can be promoted independently.
- **Plugin trust badges unified** across registry surfaces.
- Plugins and Integrations moved to the nav rail footer ([#1806], [#2360], [#2397]) — keep primary surface focused.

### Fixed

#### Web
- Block pitch-deck placeholder publishes and unbreak framework decks.
- Rename FileViewer "Share" button to "Export".
- Confirm before deleting a saved template in New Project.
- Restore consistent app header layout on the entry view. ([#1519])
- Refine preview and project dropdown controls. ([#1514])
- Pin chat during content growth.
- Auto-scroll feedback form.
- Routines history rows deep-link to their specific conversation. (Fixes [#1505])
- Hide resolved comments from preview overlays.
- Keep filter pill hover labels readable.
- Improve replace-modal button hover contrast.
- Freeze completed run durations across conversations.
- Align Home prompt overlay with textarea so caret lands on click.
- Restore release-light background. ([#1540])
- Allow downloads from preview iframes; fall back to srcDoc when HTML preview needs sandbox shim.
- Coalesce chokidar rewrite bursts before refreshing files.
- Reveal memory editor after edit click; distinguish expanded memory preview action.
- Auto-annotate imported HTML elements for Tweaks selection. ([#892])
- Stable shared frame screen paths from referrer.
- Restore custom dropdown chevron for timezone selector in dark mode.
- Daemon run recovery across reloads. ([#2374])

#### Desktop & packaging
- macOS Dock icon stays put when desktop-pet window opens. ([#2413])
- Align Windows smoke update root with portable installs. ([#2376])
- Nightly release smoke identity. ([#2446])
- Improve desktop updater ready UI. ([#2403])
- Forward proxy env vars to packaged sidecars.
- Detect mise-installed npm package bins.
- Launch Windows updater fixture via Node. ([#2364])
- Desktop "Export PDF" opens a direct "Save as PDF" file dialog and writes the PDF to disk, instead of opening the macOS system print dialog. (Fixes [#1774])
- macOS close exits fullscreen before hiding.
- Daemon's external-browser opener fixed on Windows.

#### Daemon, runtime & connectivity
- Surface discovery form answers to agents. ([#2071])
- Stabilize discovery brand answers in prompts. ([#1861])
- ACP model detection timeout is configurable.
- Wrap Claude smoke test stdin as stream-json.
- Preserve Claude tool inputs. ([#1476])
- Codex CLI path fallback UX. ([#1205])
- Treat Codex reconnect events as warnings, not fatal errors. ([#1482])
- ACP config options used for model selection. ([#1208])
- Remove OpenCode stdin dash sentinel; soft empty API response handling.
- Forward external MCP servers to OpenCode.

### Documentation

- Critique Theater Phase 14 user guide + 2 AGENTS module maps. ([#1319])
- Windows native setup notes in `AGENTS.md`.
- Comprehensive contributor guide in `TRANSLATIONS.md`.
- RTL_LOCALES UI guidance + `es-ES` alignment.
- Sync `zh-TW` README with the English version.
- Sync Windows troubleshooting link across locale READMEs.
- Refresh contributors wall + GitHub metrics SVG.
- Clarify Intel Mac ZIP packaging support (includes the Monterey verified path and the Finder `PATH` caveat for packaged CLI detection). (Fixes [#327])
- README inventory badges sync — skills 31 → 131, design-systems 72 → 149. ([#1899])
- 0.8.0-preview banner + Discussion #1727 pointer. ([#1781])
- Active 0.8.0 contributors point at `main`. ([#1846])

### Internal

- Critique Theater Playwright stage suite (happy, interrupt, 3 viewports, a11y). ([#1317], [#1483])
- Reducer p99 bench + surface coverage walker. ([#1318])
- Harden e2e extended coverage state assertions. ([#2245])
- Visual regression PR workflow (CI).
- Component manifest extraction + daemon consume path. ([#2051])
- GD CLI wraps GitHub CLI (so plugins create plugins).
- `pnpm i18n:coverage` informational report.
- Issue templates: bug, feature, preview/v0.8.0 + chooser config. ([#1708])

</details>

[Unreleased]: https://github.com/galyarderlabs/galyarder-design/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/galyarderlabs/galyarder-design/releases/tag/v1.0.0
