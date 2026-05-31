# Plugin System Test Suite and Acceptance Guide

Status date: 2026-05-14

This document covers the plugin-system requirements in `docs/plugins-spec.md`,
`docs/plans/plugin-registry.md`, and `docs/plans/plugins-implementation.md`.
The goal is to keep requirement progress, automated tests, manual acceptance,
and the recommended run order in one place so a release can be validated
against a single checklist.

## 1. Current progress summary

| Module | Progress | Evidence | Release verdict |
| --- | --- | --- | --- |
| Plugin manifest / contracts | Mostly done | `packages/contracts/src/plugins/*`, `packages/contracts/tests/plugins-manifest.test.ts` | In regression maintenance |
| Plugin runtime parser / merge / digest | Mostly done | `packages/plugin-runtime/src/*`, `packages/plugin-runtime/tests/*` | In regression maintenance |
| Daemon install / apply / snapshot | Done | `apps/daemon/src/plugins/{installer,apply,snapshots,resolve-snapshot}.ts`, `apps/daemon/tests/plugins-dod-e2e.test.ts` | v1 main path acceptable |
| Pipeline / GenUI / devloop | Main path done | `apps/daemon/src/plugins/{pipeline,pipeline-runner,until}.ts`, `apps/daemon/src/genui/*` | Event-stream regression must continue |
| First-party atoms and scenarios | Phase 6/7/8 landed | `apps/daemon/src/plugins/atoms/*`, `plugins/_official/scenarios/*`, paired `plugins-*-e2e.test.ts` | Sample-based acceptance per scenario |
| Headless CLI loop | Main path done | `gd plugin install/run`, `gd project create`, `gd run start/watch`, `apps/daemon/tests/plugins-headless-run.test.ts` | v1 must-test |
| Federated registry | P0/P1/P3/P4 mostly done | `packages/registry-protocol`, `apps/daemon/src/registry/*`, `apps/daemon/tests/registry-backends.test.ts` | DoD still has open items |
| Web Plugins UI | Installed / Available / Sources usable, Team unfinished | `apps/web/src/components/PluginsView.tsx`, `apps/web/tests/components/PluginsView.test.tsx` | UI manual acceptance required |
| Plugin detail surface | Detail modal, provenance, capabilities, share menu shipped | `PluginDetailsModal.tsx`, `plugin-details/*` | P2.5 version dropdown still missing |
| Team / private marketplace UI | Unfinished | `TeamPanel()` is still coming soon | P2.6 not met |
| Trust badge consistency | Partial | cards/detail/source tab carry `official/trusted/restricted` copy | P2.7 needs unified visual + copy acceptance |
| Registry v1 DoD | Not closed | `docs/plans/plugin-registry.md` §4 still `[ ]` | Should not be marked registry v1 fully done |

### Currently open items

| ID | Open item | Test strategy |
| --- | --- | --- |
| GAP-001 | R1 / R3 in `plugin-registry.md` still unchecked | Add CLI/UI parity and SKILL.md publish-portability regression |
| GAP-002 | P2.5 plugin detail drawer missing version dropdown | Note as risk during manual acceptance and add UI tests later |
| GAP-003 | P2.6 Team / private marketplace UI not landed | Excluded from release pass; explicit out-of-scope |
| GAP-004 | P2.7 trust badge consistency not fully confirmed | Combined Playwright + visual manual acceptance |
| GAP-005 | Registry v1 DoD third-party fork workflow lacks e2e fixture | Use a local fixture catalog as a stand-in smoke; real third-party publisher kept as pre-release manual |
| GAP-006 | Scenario registry convergence is the next step | Does not block this plugin-system cycle, but Home chips / Plugins facets / composer search must be sample-aligned |

## 2. Recommended run order

### 2.1 Quick PR gate

From the repo root:

```bash
pnpm guard
pnpm typecheck
pnpm --filter @galyarder-design/contracts test
pnpm --filter @galyarder-design/plugin-runtime test
pnpm --filter @galyarder-design/registry-protocol test
pnpm --filter @galyarder-design/daemon test
pnpm --filter @galyarder-design/web test
```

Acceptance:

- Every command exits with code `0`.
- If `@galyarder-design/daemon test` shows pre-existing non-plugin failures,
  list the file names, failing cases, and known-failure status in the
  release notes; "daemon failed" alone is not enough.

### 2.2 Plugin-focused regression

When the focus is the plugin system only, run these higher-signal files first:

```bash
pnpm --dir apps/daemon exec vitest run -c vitest.config.ts \
  tests/plugins-dod-e2e.test.ts \
  tests/plugins-headless-run.test.ts \
  tests/plugins-e2e-fixture.test.ts \
  tests/plugins-apply.test.ts \
  tests/plugins-installer.test.ts \
  tests/plugins-installer-archive.test.ts \
  tests/plugins-marketplaces.test.ts \
  tests/plugins-marketplace-doctor.test.ts \
  tests/plugins-lockfile.test.ts \
  tests/plugins-upgrade.test.ts \
  tests/plugins-connector-gate.test.ts \
  tests/plugins-tool-token-gate.test.ts \
  tests/plugins-pipeline-runner.test.ts \
  tests/plugins-code-migration-e2e.test.ts \
  tests/plugins-figma-migration-e2e.test.ts \
  tests/registry-backends.test.ts
```

```bash
pnpm --dir apps/web exec vitest run -c vitest.config.ts \
  tests/components/PluginsView.test.tsx \
  tests/components/PluginDetailsModal.dispatch.test.tsx \
  tests/components/PluginInputsForm.test.tsx \
  tests/components/InlinePluginsRail.test.tsx \
  tests/components/HomeHero.plugin-picker.test.tsx \
  tests/components/HomeView.plugin-i18n.test.tsx \
  tests/components/plugins-home-section.test.tsx \
  tests/components/plugins-home-facets.test.ts \
  tests/components/MarketplaceView.test.tsx \
  tests/router-marketplace.test.ts \
  tests/runtime/plugin-source.test.ts
```

```bash
pnpm --filter @galyarder-design/landing-page build
```

Acceptance:

- For focused files, use `pnpm --dir <package> exec vitest ... <files>`. Do not use
  `pnpm --filter <package> test -- <files>` — in this repo it degrades to the full suite.
- The daemon focused regression covers install, marketplace, snapshot, pipeline, GenUI, trust gate, lockfile, archive integrity.
- The web focused regression covers the Plugins tab, detail dispatch, home / plugin picker, marketplace route, plugin source links.
- `landing-page` build passes, meaning the public marketplace / search renderer can still be statically generated.

### 2.3 User-level UI smoke

UI smoke is more expensive; recommended before release:

```bash
cd e2e
pnpm exec playwright test -c playwright.config.ts ui/app.test.ts --grep "plugin-create-import"
```

Acceptance:

- `Create plugin` enters the agent-assisted authoring prompt.
- `Import plugin` can install a local fixture.
- The user lands on the Installed tab after install.
- The Home `@query` selector picks up user-installed plugins.
- The project-create request carries the `pluginId` and the user's final prompt.

### 2.4 Local real-daemon smoke

Pick a free port:

```bash
pnpm tools-dev run web --daemon-port 17456 --web-port 17573
```

Then open `http://127.0.0.1:17573` in a browser and walk through:

1. Open Plugins.
2. Confirm official starters are visible under Installed.
3. Under Available, confirm installed official entries show `Use` and the rest show `Install`.
4. Add a raw `galyarder-design-marketplace.json` URL under Sources, refresh, change trust, remove.
5. Import a local fixture plugin, open its details, and confirm Source, Capabilities, Workflow, and the Share menu are all visible.
6. Search for the freshly imported plugin from Home using `@`, create a project, and confirm the plugin chip appears in the project messages.

## 3. Automation matrix

### A. Contract and Schema

| ID | Scenario | Core assertion | Coverage |
| --- | --- | --- | --- |
| PS-A01 | Plugin manifest schema | `galyarder-design.json` v1 fields, taskKind, inputs, pipeline, genui, capabilities all parse | `packages/contracts/tests/plugins-manifest.test.ts` |
| PS-A02 | Marketplace schema | `official/trusted/restricted` trust vocabulary; versions/integrity/publisher fields pass through | `packages/contracts/src/plugins/marketplace.ts` + package tests |
| PS-A03 | RegistryBackend protocol | static / GitHub / DB backends share list/search/resolve/publish semantics | `packages/registry-protocol/tests/backend.test.ts`, `apps/daemon/tests/registry-backends.test.ts` |
| PS-A04 | Plugin block renderer | The snapshot-rendered prompt block is stable; it doesn't drift between daemon and contracts copies | `packages/contracts/src/prompts/plugin-block.ts`, `apps/daemon/tests/plugins-dod-e2e.test.ts` |

### B. Runtime Parsing and Portability

| ID | Scenario | Core assertion | Coverage |
| --- | --- | --- | --- |
| PS-B01 | SKILL.md-only fallback | `SKILL.md` frontmatter synthesises a schema-valid `PluginManifest` | `packages/plugin-runtime/tests/adapter-agent-skill.test.ts` |
| PS-B02 | Claude plugin adapter | `.claude-plugin/plugin.json` is accepted as a compatible input | `packages/plugin-runtime/tests/parsers.test.ts`, `validate.test.ts` |
| PS-B03 | Sidecar manifest wins | `galyarder-design.json` overrides the adapter fallback and does not duplicate the SKILL.md body | `packages/plugin-runtime/tests/merge.test.ts` |
| PS-B04 | Deterministic digest | The same manifest/source produces a stable digest, and the digest changes after upgrade | `packages/plugin-runtime/tests/digest.test.ts`, `plugins-dod-e2e.test.ts` |
| PS-B05 | Metadata-only preset | A directory with only `galyarder-design.json` must be flagged non-runnable by doctor | `apps/daemon/tests/plugins-validate.test.ts`, `plugins-verify.test.ts` |

### C. Install, Apply, Snapshot

| ID | Scenario | Core assertion | Coverage |
| --- | --- | --- | --- |
| PS-C01 | Cold local install | Local-folder install lands under the user plugin root and writes the SQLite installed row | `apps/daemon/tests/plugins-e2e-fixture.test.ts` |
| PS-C02 | Archive install | HTTPS / GitHub archive checks `sha256:` before extracting; mismatches fail closed | `apps/daemon/tests/plugins-installer-archive.test.ts` |
| PS-C03 | Install safety | Traversal, symlink, and size guards block out-of-bounds writes | `apps/daemon/tests/plugins-installer.test.ts` |
| PS-C04 | Pure apply | Repeated apply calls keep the same digest, project cwd is unchanged, and apply itself doesn't write a snapshot | `apps/daemon/tests/plugins-dod-e2e.test.ts` |
| PS-C05 | Snapshot writer boundary | `applied_plugin_snapshots` is only written via the snapshot/resolver path | `apps/daemon/tests/plugins-snapshots.test.ts`, `plugins-dod-e2e.test.ts` |
| PS-C06 | Replay invariance | After plugin upgrade, the older snapshot's prompt block remains byte-equal | `apps/daemon/tests/plugins-dod-e2e.test.ts` |
| PS-C07 | Snapshot GC | Unreferenced snapshots GC by TTL while referenced snapshots are pinned | `apps/daemon/tests/plugins-snapshot-gc.test.ts` |
| PS-C08 | API fallback reject | When the daemon is not on the path, plugin-run via fallback must 409 | `apps/daemon/tests/proxy-routes.test.ts` |

### D. CLI and Headless Loop

| ID | Scenario | Core assertion | Coverage |
| --- | --- | --- | --- |
| PS-D01 | Headless install -> project -> run | HTTP and CLI paths both pin `appliedPluginSnapshotId` | `apps/daemon/tests/plugins-headless-run.test.ts` |
| PS-D02 | CLI prompt injection | `gd plugin run` injects query, inputs, and the local SKILL.md into the agent prompt | `apps/daemon/tests/plugins-headless-run.test.ts` |
| PS-D03 | Project / run / files basics | `gd project create`, `gd run start/watch/cancel/list/info`, and `od files read` all work | `apps/daemon/tests/plugins-headless-run.test.ts` + CLI tests |
| PS-D04 | Marketplace CLI | `od marketplace plugins/search/doctor/login` outputs are stable; login only invokes `gh` | `apps/daemon/tests/plugins-headless-run.test.ts`, `plugins-marketplace-doctor.test.ts` |
| PS-D05 | Plugin publish/share | A user plugin enters the publish/contribute workflow and the GitHub PR payload is stable | `apps/daemon/tests/plugins-headless-run.test.ts`, `plugins-publish.test.ts` |
| PS-D06 | Plugin upgrade/yank | Upgrade respects policy/lockfile and yank does not hard-delete a version | `apps/daemon/tests/plugins-upgrade.test.ts`, `plugins-publish.test.ts` |

### E. Registry and Federation

| ID | Scenario | Core assertion | Coverage |
| --- | --- | --- | --- |
| PS-E01 | Raw marketplace only | A GitHub tree HTML page is rejected by the parser | `apps/daemon/tests/plugins-marketplaces.test.ts` |
| PS-E02 | Official seed | The official registry is non-empty with trust `official` and bundled entries resolve | `apps/daemon/tests/plugins-marketplaces.test.ts` |
| PS-E03 | Community seed | The community registry loads as a `restricted` source | `apps/daemon/tests/plugins-marketplaces.test.ts` |
| PS-E04 | Version resolution | Exact, dist-tag, semver range, and yanked beta cases all resolve correctly | `apps/daemon/tests/plugins-marketplaces.test.ts` |
| PS-E05 | Provenance | Marketplace install preserves sourceMarketplaceId, entry name/version, resolved ref, integrity | `apps/daemon/tests/plugins-installer.test.ts` |
| PS-E06 | Lockfile replay | `.od/od-plugin-lock.json` can replay an exact install | `apps/daemon/tests/plugins-lockfile.test.ts` |
| PS-E07 | Marketplace doctor | Invalid name/source/capability/license/yank-reason cases are reported | `apps/daemon/tests/plugins-marketplace-doctor.test.ts` |
| PS-E08 | Public site renderer | `/plugins`, the detail route, and `/plugins/search.json` build | `pnpm --filter @galyarder-design/landing-page build` |

### F. Pipeline, GenUI, Atoms

| ID | Scenario | Core assertion | Coverage |
| --- | --- | --- | --- |
| PS-F01 | First pipeline event | The first batch of events from a plugin run includes `pipeline_stage_started` before any agent message chunk | `apps/daemon/tests/plugins-headless-run.test.ts` |
| PS-F02 | Devloop until | The `until` evaluator, max-iteration cap, and failure policy are stable | `apps/daemon/tests/plugins-until.test.ts`, `plugins-pipeline-runner.test.ts` |
| PS-F03 | GenUI persistence | A project-tier answer is reused across conversations and emits a cache response | `apps/daemon/tests/plugins-pipeline-runner.test.ts` |
| PS-F04 | GenUI renderer | form / choice / confirmation / oauth-prompt are rendered by the product components | `apps/web/tests/components/GenUISurfaceRenderer*.test.tsx` |
| PS-F05 | Auto diff review surface | When a stage carries `diff-review`, the choice surface auto-generates | `apps/daemon/tests/plugins-auto-surfaces.test.ts` |
| PS-F06 | Figma migration atoms | `figma-extract` and `token-map` produce stable fixture output | `apps/daemon/tests/plugins-figma-*.test.ts` |
| PS-F07 | Code migration atoms | `code-import`, `design-extract`, `rewrite-plan`, `patch-edit`, `diff-review`, `build-test` all chain together | `apps/daemon/tests/plugins-code-migration-e2e.test.ts` |
| PS-F08 | Handoff atom | The handoff manifest round-trips and the promotion ladder is legal | `apps/daemon/tests/plugins-handoff*.test.ts` |

### G. Trust, Capability, Security

| ID | Scenario | Core assertion | Coverage |
| --- | --- | --- | --- |
| PS-G01 | Restricted capability gate | A restricted plugin missing `connector:<id>` returns 409 / exit 66 on apply | `apps/daemon/tests/plugins-dod-e2e.test.ts` |
| PS-G02 | Tool token revalidation | A leaked token still cannot bypass the connector gate | `apps/daemon/tests/plugins-tool-token-gate.test.ts` |
| PS-G03 | Capability grant/revoke | The trust endpoint can grant/revoke capabilities; illegal capabilities are rejected | `apps/daemon/tests/plugins-trust.test.ts` |
| PS-G04 | Asset sandbox | The plugin asset route blocks path traversal and returns the right CSP / content-type | `apps/daemon/tests/plugins-asset-route.test.ts` |
| PS-G05 | API token guard | Public bind without `GD_API_TOKEN` is rejected; loopback skips bearer | `apps/daemon/tests/api-token-guard.test.ts` |
| PS-G06 | Origin/CORS | Daemon-route origin validation does not loosen | `apps/daemon/tests/origin-validation.test.ts`, `server-cors.test.ts` |

### H. Web Product Surface

| ID | Scenario | Core assertion | Coverage |
| --- | --- | --- | --- |
| PS-H01 | Plugins tabs | Installed / Available / Sources / Team tabs switch | `apps/web/tests/components/PluginsView.test.tsx` |
| PS-H02 | Available state | Installed official entries show `Use`; uninstalled show `Install`; mismatched versions show an upgrade state | `apps/web/tests/components/PluginsView.test.tsx` |
| PS-H03 | Sources operations | add/refresh/remove/trust route to the matching API wrapper | `apps/web/tests/components/PluginsView.test.tsx` |
| PS-H04 | Create plugin flow | Create plugin enters agent-assisted authoring; the legacy import modal is not opened | `apps/web/tests/components/PluginsView.test.tsx`, `e2e/ui/app.test.ts` |
| PS-H05 | Detail modal dispatch | The four detail entry points (media / html / design / scenario) dispatch correctly | `apps/web/tests/components/PluginDetailsModal.dispatch.test.tsx` |
| PS-H06 | Detail metadata | Source, capabilities, workflow, GenUI, connectors, author/provenance are all visible | Needs finer component tests; currently covered by detail component + manual acceptance |
| PS-H07 | Share menu | copy install command / id / link / markdown badge plus the source / homepage / marketplace links all work | `apps/web/tests/components/PluginShareMenu.test.tsx` |
| PS-H08 | Home/Composer apply | Home `@` picker, ChatComposer plugin rail, and input form can all apply a plugin | `HomeHero.plugin-picker.test.tsx`, `InlinePluginsRail.test.tsx`, `PluginInputsForm.test.tsx` |
| PS-H09 | Trust badge consistency | `official/trusted/restricted` copy is consistent across card / drawer / source / install confirmation | Automation insufficient; manual acceptance pre-release |

## 4. Manual acceptance checklist

### 4.1 Plugin detail drawer

| ID | Step | Expectation |
| --- | --- | --- |
| MAN-001 | Open the detail of an official scenario plugin | Title, version, trust, source, workflow, capabilities are all readable |
| MAN-002 | Open the detail of a marketplace-installed plugin | Provenance shows sourceMarketplaceId / entry name / source kind |
| MAN-003 | Open the Share menu, copy the install command | Clipboard reads `gd plugin install <plugin-or-source>`, not the marketplace id mistaken for the plugin id |
| MAN-004 | Open a plugin with inputs | Input type, required, default, options are all displayed |
| MAN-005 | Look for the version dropdown | Current expectation: missing; record as P2.5 not done |

### 4.2 Sources / Available / Team

| ID | Step | Expectation |
| --- | --- | --- |
| MAN-006 | Sources adds a raw marketplace JSON | Successfully joined as a restricted source; the list shows catalog name and plugin count |
| MAN-007 | Sources adds a GitHub tree page | Rejected; the error copy points at the marketplace JSON parse failure |
| MAN-008 | Switch a Source's trust to trusted, then refresh | Trust persists; Available cards inherit the new catalog trust semantics |
| MAN-009 | Available installs a remote entry | The installed record preserves marketplace provenance |
| MAN-010 | Team tab | Current expectation: shows coming soon; does not claim a private marketplace is done |

### 4.3 Headless real workflow

| ID | Command | Expectation |
| --- | --- | --- |
| MAN-011 | `gd plugin install <local-plugin>` | Outputs ok; `gd plugin list --json` shows the new plugin |
| MAN-012 | `gd plugin doctor <id> --json` | A valid plugin reports no errors; a metadata-only plugin reports a clear non-runnable diagnostic |
| MAN-013 | `gd project create --plugin <id> --inputs '{"topic":"qa"}' --json` | Returns a project id and `appliedPluginSnapshotId` |
| MAN-014 | `gd plugin run <id> --project <projectId> --follow` | Event stream contains pipeline stages, agent events, and an end status |
| MAN-015 | `od marketplace search "<query>" --json` | Searches the configured catalog without depending on the web UI |

### 4.4 Public registry / self-host

| ID | Step | Expectation |
| --- | --- | --- |
| MAN-016 | `pnpm --filter @galyarder-design/landing-page build` | Static `/plugins` and `search.json` generate successfully |
| MAN-017 | Copy `plugins/registry/community/galyarder-design-marketplace.json` to a temporary URL or local fixture server | The daemon can add/search/install |
| MAN-018 | Follow `docs/self-hosting-a-registry.md` to create a third-party catalog | Only the catalog name/url/source-style configuration changes — no daemon/web code edits |
| MAN-019 | Run `gd plugin publish --to marketplace-json --catalog <path>` | Catalog upserts stably and the source is reproducible |

## 5. Release pass criteria

The plugin system can be marked "plugin runtime v1 ready" when all of:

1. The 8 e2e gates in `plugins-implementation.md` §8 pass.
2. `pnpm guard` and `pnpm typecheck` pass.
3. The recommended commands for contracts / runtime / registry-protocol / daemon / web / landing-page pass.
4. At least one `plugin-create-import` Playwright smoke ran.
5. P2.5/P2.6/P2.7 statuses are confirmed manually: if done, the plan is checked; if not, the release notes list them as deferred.

Registry v1 is "fully done" only after these additional conditions:

1. `plugin-registry.md` §4 DoD is fully checked.
2. An e2e fixture catalog validates the third-party fork / self-host source flow.
3. Every UI Sources/Available action has an equivalent CLI command, with a parity test or script proving so.
4. At least one real third-party publisher has driven the publish flow via `gd plugin publish` without hand-written JSON.

## 6. Failure-triage order

| Symptom | Check first |
| --- | --- |
| manifest/schema test failure | `packages/contracts/src/plugins/*` and `packages/plugin-runtime/src/validate.ts` |
| Install succeeds but Available/Installed state is wrong | Installed record's `sourceMarketplaceEntryName`, `sourceMarketplaceId`, `marketplaceTrust` |
| Apply asks for input again, or snapshots are missing | `resolve-snapshot.ts` project-pinned fallback and `snapshots.ts` |
| Pipeline events missing | Whether `firePipelineForRun()` fires from the `POST /api/runs` path |
| Connector token bypass | `connector-gate.ts`, `tool-tokens.ts`, the second-pass check on `/api/tools/connectors/execute` |
| UI cannot find a freshly installed plugin | `PluginsView` tab/test id, `buildAvailablePlugins()` name matching |
| Public registry page missing entries | `plugins/registry/*/galyarder-design-marketplace.json`, `apps/landing-page/app/plugin-registry.ts` |

## 7. Maintenance rules

1. Every plugin-system PR that lands new capability or test files updates the matching matrix here.
2. When `docs/plans/plugins-implementation.md` or `docs/plans/plugin-registry.md` toggles a checkbox, sync the §1 progress summary.
3. Do not present subjective visual acceptance as automated pass-status. Visual and real third-party publish flows live in the MAN cases.
4. Automated tests live in their owners' directories: daemon behavior under `apps/daemon/tests/`, web components under `apps/web/tests/`, cross-app/user flows under `e2e/`.
