# E2E status

This document records the current `e2e/` automation layering, the latest reinforcement work, and the known gaps we intentionally keep open.

## Current suite shape

The E2E suite is split clearly into three layers:

- `test:ui:critical`
  - Stays lightweight
  - Holds entry usability and the shortest, highest-confidence main paths only
  - Goal: fast, stable, easy to localise on failure
- `test:ui:extended`
  - Carries the heavier UI regression
  - Covers persistence, recovery, multi-project isolation, Design Files, connector config, keyboard flows, etc.
  - Most of the recent reinforcement landed here
- `vitest` system-level smoke
  - Validates daemon / API / artifact paths
  - Avoids the browser when UI isn't the focus

The current strategy is explicit: keep strengthening `extended` signal without turning `critical` into a slow grab-bag.

## What was reinforced recently

### 1. Contract assertions for resource-driven scenarios

Playwright resource scenarios now support explicit contracts:

- `expectedProjectMetadata`
- `expectedRunRequest`
- `expectedFiles`
- `expectedPreviewText`

Related files:

- `e2e/lib/playwright/resources.ts`
- `e2e/resources/playwright.ts`
- `e2e/ui/app.test.ts`

This means many flows in `app.test.ts` no longer stop at "element visible" — they verify persisted state too.

### 2. Real-daemon and system consistency

Deeper real-run validation lands in:

- `e2e/ui/real-daemon-run.test.ts`
- `e2e/tests/dialog/artifact-consistency.test.ts`

It now covers:

- real daemon follow-up turn
- empty-output failure convergence
- separate-project isolation
- fake runtime coverage
- run state, message, artifact manifest, project files, and raw file content consistency

### 3. Design Files persistence

`e2e/ui/app-design-files.test.ts` now has API-backed validation covering:

- upload persistence
- delete persistence
- active tab restoration
- uploaded image preview validity
- source preview persistence

### 4. Restoration and conversation recovery

`e2e/ui/app-restoration.test.ts` now adds stronger persisted-state assertions for:

- latest conversation selection after reload
- deleting the active conversation
- file / artifact deep-link restoration
- conversation retention after surface switching

The new assertions go beyond UI inspection — they also confirm:

- the current `conversationId`
- the remaining conversation set
- the persisted files for the surface

### 5. Project-management persistence

`e2e/ui/project-management-flows.test.ts` adds lightweight API checks for:

- rename persistence
- search recovery
- grid / kanban view persistence
- kanban open-flow integrity

### 6. Entry configuration and keyboard workflows

- `e2e/ui/entry-configuration-flows.test.ts`
  - Confirms the Composio key flow does not leave plaintext keys in saved config
  - Confirms the replacement draft key does not trigger premature global persistence
- `e2e/ui/workspace-keyboard-flows.test.ts`
  - Confirms quick-switcher scenarios keep the expected per-project file sets
  - Confirms a mixed artifact / file workspace stays intact across reload

## Capabilities now well-signalled

After this reinforcement pass, automated signal is markedly stronger across:

- media routing
- plugin import / apply flow
- question form persistence
- file mention flow
- generated artifact stability
- design files upload / delete / persistence
- conversation persistence and recovery
- project rename / delete / search / view toggle
- connector configuration persistence
- quick-switcher behavior across reload and project boundaries

## Known and intentional gaps

There is one product-level gap kept as a `fixme` in:

- `e2e/ui/real-daemon-run.test.ts`

The skipped scenario is:

- Refresh the page during a real daemon run and expect artifact persistence to land cleanly.

Today's actual behavior:

- Run state reattaches after reload
- The assistant turn looks like it can finish
- But artifact persistence may be lost after reattach

This is kept as a known product gap rather than weakened into a fake-green test.

## Validation commands

From the repo root:

```bash
pnpm --filter @galyarder-design/e2e typecheck
```

```bash
pnpm --filter @galyarder-design/e2e test -- e2e/tests/dialog/artifact-consistency.test.ts
```

```bash
pnpm --filter @galyarder-design/e2e exec playwright test -c playwright.config.ts ui/app.test.ts --project=chromium
```

```bash
pnpm --filter @galyarder-design/e2e exec playwright test -c playwright.config.ts ui/real-daemon-run.test.ts --project=chromium
```

```bash
pnpm --filter @galyarder-design/e2e exec playwright test -c playwright.config.ts ui/app-design-files.test.ts ui/app-restoration.test.ts ui/project-management-flows.test.ts ui/entry-configuration-flows.test.ts ui/workspace-keyboard-flows.test.ts --project=chromium
```

The latest grouped run for those five reinforced `extended` files reported `59 passed`.

## Recommended next steps

Don't expand `critical` for now.

The most valuable next moves:

- Continue to add cheap persisted-state checks under existing UI-only `extended` assertions.
- After each batch, run the grouped validation.
- Keep known product bugs as `fixme` — don't weaken the suite to turn green.
