# Plugin Registry Evaluation Cases

This case set turns the registry product mental model into regression-ready
assertions: `Sources` only accepts `galyarder-design-marketplace.json`,
`Available` is the supply pool, `Installed` is the only set the agent can
actually consume, and official / community / self-hosted all enter the
system through the same registry-source model.

For the overall plugin-system progress, run order, and release acceptance
table, see [`plugin-system-test-suite.md`](./plugin-system-test-suite.md).
This document keeps only the registry / distribution / website /
multi-source-specific cases.

## Automated

| ID | Scenario | Core assertion | Coverage file |
| --- | --- | --- | --- |
| REG-001 | Sources accepts the raw `galyarder-design-marketplace.json`, not a GitHub tree page | A GitHub tree HTML page is rejected by the marketplace parser and returns 422 | `apps/daemon/tests/plugins-marketplaces.test.ts` |
| REG-002 | Default official-registry seed is a real catalog, not an empty array | `plugins/registry/official/galyarder-design-marketplace.json` ships bundled official entries with trust `official`, and `galyarder-design/build-test` resolves | `apps/daemon/tests/plugins-marketplaces.test.ts` |
| REG-003 | Default community-registry seed loads as a restricted source in the daemon | `plugins/registry/community/galyarder-design-marketplace.json` seeds, `community/registry-starter` resolves with trust `restricted` | `apps/daemon/tests/plugins-marketplaces.test.ts` |
| REG-004 | Checked-in registry entry points at a real, packageable plugin source | `community/registry-starter`'s source points at `plugins/community/registry-starter`, and the source `galyarder-design.json` carries `plugin.repo` | `apps/daemon/tests/plugins-marketplaces.test.ts` |
| REG-005 | Marketplace install preserves provenance and inherits trust | The installed record stores `sourceMarketplaceId`, entry name/version, resolved source/ref, and digest/integrity; official/trusted sources are trusted by default | `apps/daemon/tests/plugins-installer.test.ts` |
| REG-006 | Restricted marketplace install does not auto-elevate trust | A plugin installed from a restricted source remains `restricted` | `apps/daemon/tests/plugins-installer.test.ts` |
| REG-007 | Direct GitHub source import is a separate entry point from registry source | The Import dialog hands `github:galyarderlabs/galyarder-design@.../plugins/community/registry-starter` to the install API verbatim | `apps/web/tests/components/PluginsView.test.tsx` |
| REG-008 | A bundled official entry in Available shows `Use`, not `Install`, when already installed | Registry entry `galyarder-design/official-plugin` matches the installed bundled record and triggers `applyPlugin` | `apps/web/tests/components/PluginsView.test.tsx` |
| REG-009 | The Sources tab accepts raw GitHub `galyarder-design-marketplace.json` URLs | UI calls `addPluginMarketplace({ url, trust: "restricted" })` | `apps/web/tests/components/PluginsView.test.tsx` |
| REG-010 | "Create plugin" is the agent-assisted authoring entry point | `Create plugin` does not open the legacy import modal; it triggers the `onCreatePlugin` agent flow | `apps/web/tests/components/PluginsView.test.tsx` |
| REG-011 | A user plugin enters the GitHub registry workflow via publish/share actions | The Publish / Contribute action confirms, then creates an agent task carrying the source plugin id and action id | `apps/web/tests/components/PluginsView.test.tsx` |
| REG-012 | Version range / dist-tag / yank resolution | `vendor/plugin@1.0.0`, `@latest`, and `@^1.0.0` resolve; a yanked beta does not participate in new resolution | `apps/daemon/tests/plugins-marketplaces.test.ts` |
| REG-013 | Archive integrity fails closed | HTTPS / GitHub tarball downloads compute `sha256:`; mismatched entry integrity refuses extraction, a match (or absence) writes the installed record | `apps/daemon/tests/plugins-installer-archive.test.ts` |
| REG-014 | Registry backend parity | Static / GitHub / DB backends share the list/search/resolve/publish contract; GitHub publish emits stable PR mutation paths | `apps/daemon/tests/registry-backends.test.ts` |
| REG-015 | Install lockfile | An installed plugin emits a stable `.od/od-plugin-lock.json` entry with marketplace id, resolved ref, digest, integrity | `apps/daemon/tests/plugins-lockfile.test.ts`, `apps/daemon/tests/plugins-installer.test.ts` |
| REG-016 | Marketplace doctor | Invalid name, missing source, missing capability/license, yank reason, etc. are reported by doctor with strict warning-as-error support | `apps/daemon/tests/plugins-marketplace-doctor.test.ts` |
| REG-017 | Static marketplace-json publish | `gd plugin publish --to marketplace-json` runs a pure upsert that enforces `vendor/plugin-name`, derives reproducible source from a GitHub URL, and updates the catalog stably | `apps/daemon/tests/plugins-publish.test.ts` |
| REG-018 | Public plugin SEO / search renderer | `/plugins/search.json` and per-plugin detail pages build statically and include official / community registry entries | `apps/landing-page` `typecheck` + `build` |
| REG-019 | Registry protocol future hooks | The pure `RegistryBackend` interface requires vendor/plugin identity and accepts metrics/signatures, leaving room for DB / search / trust hardening | `packages/registry-protocol/tests/backend.test.ts` |

## Automation candidates

| ID | Scenario | Suggested approach |
| --- | --- | --- |
| REG-C01 | Full `od marketplace add/search/refresh/remove/trust` CLI flow | CLI harness + fake fetcher, asserting JSON output, exit code, SQLite source row |
| REG-C02 | `gd plugin login/whoami` reuses `gh` only and does not persist a GitHub token | Fake `GhClient` or fake `gh` bin, asserting stdout and that no token is persisted |
| REG-C03 | Full external `gh repo fork` / `gh pr create` flow | Fake `gh` bin + temp registry repo, asserting the real branch/commit/PR command sequence |
| REG-C04 | `galyarder-design-marketplace.json` generator | Given several `plugins/community/**/galyarder-design.json` inputs, output is sorted stably, passes schema, and has complete source/digest data |
| REG-C05 | Route-level lockfile replay behavior | Start the daemon, install `vendor/plugin@1.0.0` first to write the lock, then install plain `vendor/plugin` and assert it still resolves the locked exact version |
| REG-C06 | Enterprise database-backend HTTP/API parity | Run the same CLI/UI behavior set against static/GitHub and DB backends, not just backend unit parity |

## Manual acceptance retained

| ID | Scenario | Reason |
| --- | --- | --- |
| REG-M01 | galyarder-design.dev marketplace page visuals, SEO, plugin detail narrative | Heavy dependency on brand expression and real content quality; suits human acceptance |
| REG-M02 | Real third-party self-hosted registry onboarding experience | Involves external repos, GitHub permissions, network, and org workflow; fits a pre-release smoke pass |
