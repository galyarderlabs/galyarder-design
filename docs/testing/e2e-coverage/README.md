# E2E case library

This directory tracks the QA scenarios that today's automated tests cover. It primarily indexes the `e2e/` suite and notes the `apps/web` component tests that protect the same user flow when relevant.

## Document scope

- Records automated coverage that already lives under `e2e/`; when a user flow is mainly protected by `apps/web` component tests, that's noted as well.
- Describes scenarios from the user's perspective, not implementation details.
- When new test files or major scenarios land, the matching module document is updated in the same PR.
- Plugin-system overall acceptance lives in [`../plugin-system-test-suite.md`](../plugin-system-test-suite.md); registry / CLI / daemon cross-layer cases are in [`../plugin-registry-eval-cases.md`](../plugin-registry-eval-cases.md).

## Module index

| Module | Coverage focus | Test files |
| --- | --- | --- |
| [status.md](./status.md) | Current E2E layering, the latest reinforcement scope, grouped-run status, known intentional gaps | `e2e/ui/app.test.ts`, `e2e/ui/real-daemon-run.test.ts`, `e2e/ui/app-design-files.test.ts`, `e2e/ui/app-restoration.test.ts`, `e2e/ui/project-management-flows.test.ts`, `e2e/ui/entry-configuration-flows.test.ts`, `e2e/ui/workspace-keyboard-flows.test.ts`, `e2e/tests/dialog/artifact-consistency.test.ts` |
| [entry.md](./entry.md) | Entry-page creation paths, connector entry, prompt templates, resource-driven scenarios, top chrome | `e2e/ui/app.test.ts`, `e2e/ui/entry-configuration-flows.test.ts`, `e2e/ui/entry-chrome-flows.test.ts` |
| [project-management.md](./project-management.md) | Home / project management, design systems, project rename, delete flow, search and view switching | `e2e/ui/project-management-flows.test.ts` |
| [workspace.md](./workspace.md) | Workspace tabs, conversation, file stream, quick switcher, manual edit mode | `e2e/ui/app.test.ts`, `e2e/ui/workspace-keyboard-flows.test.ts` |
| [settings.md](./settings.md) | API protocol regression, i18n content completeness, key settings-form behavior, Orbit settings | `e2e/ui/settings-api-protocol.test.ts`, `e2e/tests/localized-content.test.ts`, `apps/web/tests/components/SettingsDialog.execution.test.tsx`, `apps/web/tests/components/SettingsDialog.orbit.test.tsx` |
| [desktop.md](./desktop.md) | Mac desktop smoke coverage and packaged-runtime smoke | `e2e/specs/mac.spec.ts` |

## Maintenance rules

1. When adding cases, append to the closest module doc; don't maintain a single oversized index.
2. Keep each scenario to one line so a reviewer can spot diffs quickly.
3. If a scenario depends on an environment variable or skips by default, flag that in the module doc.
4. When a test is deleted, renamed, or moved, update this docs structure in the same PR.

## Case-classification standard

### Automated

- A stable automated implementation exists.
- Lists the matching test file.
- If a special gate (e.g. an environment variable) is required, that's noted.

### Automation candidates

- Clear business value, fit for future automation.
- Currently held back by environment, cost, stability, or external dependencies.
- A short reason helps future readers judge when to promote it.

### Manual retained

- Better-suited to human acceptance; not a near-term automation target.
- Common cases: subjective experience, visual feel, complex real-credential flows, multi-device collaboration.
- A short reason avoids re-arguing later.

## Current suite shape

- `e2e/ui/*.test.ts`: Playwright UI regression for the browser surface.
- `e2e/specs/*.spec.ts`: runtime and platform-level smoke tests.
- `e2e/tests/*.test.ts`: lightweight Vitest invariants.
- `e2e/lib/**`: helpers only; no executable case entry points live here.
