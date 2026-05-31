# Settings module

## Coverage

- Configure execution page
- Orbit page
- Language page
- Pets page
- API protocol migration and switch regression
- I18n content registration completeness

## Test files

- `e2e/ui/settings-api-protocol.test.ts`
- `e2e/tests/localized-content.test.ts`
- `apps/web/tests/components/App.connectors.test.tsx`
- `apps/web/tests/components/App.mediaProviders.test.tsx`
- `apps/web/tests/components/SettingsDialog.test.ts`
- `apps/web/tests/components/SettingsDialog.execution.test.tsx`
- `apps/web/tests/components/SettingsDialog.orbit.test.tsx`

## Automated

| ID | Scenario | Source |
| --- | --- | --- |
| SET-001 | The BYOK page shows protocol tabs and the core `Quick fill provider / API key / Model / Base URL` fields | `SettingsDialog.execution.test.tsx` |
| SET-002 | BYOK `Show / Hide` toggles the API key between plain and obfuscated rendering | `SettingsDialog.execution.test.tsx` |
| SET-003 | Switching `Quick fill provider` updates `Model` and `Base URL` to the matching preset | `SettingsDialog.execution.test.tsx`, `settings-api-protocol.test.ts` |
| SET-004 | Manually editing `Base URL` returns the current provider to a custom state | `SettingsDialog.execution.test.tsx` |
| SET-005 | Drafts under different protocols are isolated; `apiKey` does not leak across protocols | `SettingsDialog.execution.test.tsx`, `SettingsDialog.test.ts` |
| SET-006 | A historical OpenAI-compatible known provider switching to Anthropic lands on the matching sibling preset | `settings-api-protocol.test.ts`, `SettingsDialog.test.ts` |
| SET-007 | A historical custom provider keeps its custom `Base URL` and `Model` across protocol switches | `settings-api-protocol.test.ts`, `SettingsDialog.test.ts` |
| SET-008 | BYOK only autosaves with valid required fields; an invalid `Base URL` blocks save | `SettingsDialog.execution.test.tsx`, `settings-api-protocol.test.ts` |
| SET-009 | After BYOK autosave, the configuration writes to local state and is restored when settings reopen | `settings-api-protocol.test.ts` |
| SET-010 | Azure's `apiVersion` stays inside the Azure draft and does not pollute other protocols | `SettingsDialog.test.ts` |
| SET-011 | The Settings dialog supports the top-right close button and overlay close; closing does not trigger an extra save | `SettingsDialog.execution.test.tsx` |
| SET-012 | The Azure OpenAI page surfaces the `Deployment name / API version` fields and saves Azure config | `SettingsDialog.execution.test.tsx` |
| SET-013 | BYOK supports switching to the `Custom model id` input path and saving a custom model | `SettingsDialog.execution.test.tsx` |
| SET-014 | In Local CLI mode only installed agents can be selected; selection autosaves as the current execution CLI | `SettingsDialog.execution.test.tsx` |
| SET-015 | Local CLI shows an empty state when no agents are installed and does not trigger an invalid save | `SettingsDialog.execution.test.tsx` |
| SET-016 | `Rescan` shows a loading state, blocks repeated clicks, and shows the available agent count on success | `SettingsDialog.execution.test.tsx` |
| SET-017 | A failed `Rescan` shows an error notice without breaking the page state | `SettingsDialog.execution.test.tsx` |
| SET-018 | The Configure execution page persists `CLAUDE_CONFIG_DIR` and `CODEX_HOME` to config | `SettingsDialog.execution.test.tsx`, `SettingsDialog.test.ts` |
| SET-019 | When the daemon is offline, `Local CLI` mode is disabled and shows the offline copy | `SettingsDialog.execution.test.tsx` |
| SET-020 | After saving a Local CLI selection, the bottom-left execution-status pill on the home page reflects the active agent and version | `settings-api-protocol.test.ts` |
| SET-021 | Media providers list stably as `configured first -> Integrated first -> by name`; configured providers show a `Configured` badge | `SettingsDialog.execution.test.tsx` |
| SET-022 | Unsupported media providers render as disabled rows and cannot edit the unsupported provider config | `SettingsDialog.execution.test.tsx` |
| SET-023 | Media providers persist API key / Base URL / custom model and `Clear` removes that provider from the save payload | `SettingsDialog.execution.test.tsx` |
| SET-024 | Media providers support the top-right close button and overlay close; closing does not trigger an extra save | `SettingsDialog.execution.test.tsx` |
| SET-025 | At app start, configured local media providers (with a live daemon) auto-sync to the daemon | `App.mediaProviders.test.tsx` |
| SET-026 | Saving media providers from Settings triggers a daemon sync with `force: true` and persists `onboardingCompleted` | `App.mediaProviders.test.tsx` |
| SET-027 | The Connectors page shows the saved Composio key tail, replacement placeholder, help text, and `Get API Key` external link | `SettingsDialog.execution.test.tsx` |
| SET-028 | The Connectors page can replace the saved Composio key and shows a pending hint while unsaved | `SettingsDialog.execution.test.tsx` |
| SET-029 | The Connectors page can clear the saved Composio key and removes the saved-state flag from the save payload | `SettingsDialog.execution.test.tsx` |
| SET-030 | The Connectors page supports top-right close and overlay close without triggering a save | `SettingsDialog.execution.test.tsx` |
| SET-031 | At app start, when no pending key exists locally, the Composio saved-state from the daemon is used to render the tail | `App.connectors.test.tsx` |
| SET-032 | When Settings saves a Connectors key, the local store keeps only `apiKeyConfigured/apiKeyTail` while the raw key is sent to the daemon | `App.connectors.test.tsx` |
| SET-033 | After clearing a saved Connectors key, the cleared composio config syncs to the daemon | `App.connectors.test.tsx` |
| SET-034 | Once the daemon returns install info, the MCP server page renders Claude Code's install command, restart hint, and capability summary by default | `SettingsDialog.execution.test.tsx` |
| SET-035 | Switching MCP server clients refreshes the install instructions and snippet body | `SettingsDialog.execution.test.tsx` |
| SET-036 | The MCP server page can copy the current snippet to the clipboard and shows a `Copied` confirmation | `SettingsDialog.execution.test.tsx` |
| SET-037 | When the daemon cannot return install info, the MCP server page shows an error notice and a fallback snippet copy | `SettingsDialog.execution.test.tsx` |
| SET-038 | After saving a Connectors key in Settings, the Entry-page connectors gate unlocks immediately and the local store keeps only the tail flag | `entry-configuration-flows.test.ts` |
| SET-039 | When the Language page dropdown opens, the full locale list renders and the current language is marked | `SettingsDialog.execution.test.tsx` |
| SET-040 | Switching languages on the Language page updates the trigger label, writes locale to `localStorage`, and syncs `html[lang]` | `SettingsDialog.execution.test.tsx` |
| SET-041 | Switching to an RTL locale like `fa` updates `html[dir=rtl]` and the language menu can be closed with `Escape` | `SettingsDialog.execution.test.tsx` |
| SET-042 | The Language page does not depend on the global save button — language switches apply immediately and survive Settings close | `SettingsDialog.execution.test.tsx` |
| SET-043 | I18n content resources render non-empty skill, design-system, and prompt-template displays via translation dictionaries or English fallback | `localized-content.test.ts` |
| SET-044 | Design-system / prompt-template categories and tags fall back to source values when locale entries are missing; existing entries still localise | `localized-content.test.ts` |
| SET-045 | Notifications default to `offline`; enabling completion sound reveals success/failure pickers and previews the default success sound | `SettingsDialog.execution.test.tsx` |
| SET-046 | Notifications support switching success / failure sounds and persist the selection to the notification config | `SettingsDialog.execution.test.tsx` |
| SET-047 | Desktop notifications switch to `active` after permission is granted; the test send button works and surfaces a result | `SettingsDialog.execution.test.tsx` |
| SET-048 | When desktop notification permission is denied, it stays disabled, shows a browser-blocked hint, and hides the test button | `SettingsDialog.execution.test.tsx` |
| SET-049 | Notifications support top-right close and overlay close without triggering a save | `SettingsDialog.execution.test.tsx` |
| SET-050 | The Appearance page reflects `System` as the current mode — meaning "follow system", not a fixed light/dark theme | `SettingsDialog.execution.test.tsx` |
| SET-051 | Switching the Appearance page from `Light/Dark` back to `System` removes the explicit `html[data-theme]` and restores follow-system | `SettingsDialog.execution.test.tsx` |
| SET-052 | The Appearance live theme preview rolls back to the saved theme when closed without save, preventing leaked previews | `SettingsDialog.execution.test.tsx` |
| SET-053 | Saving `theme=system` does not pin a hard theme and preserves the current accent color | `SettingsDialog.execution.test.tsx` |
| SET-054 | The Pets page defaults to the Built-in tab and separates bundled pets from community pets | `SettingsDialog.execution.test.tsx` |
| SET-055 | The Pets page edits `Name / Glyph / Greeting / Accent color` in the Custom tab with live preview, saved as the current custom pet | `SettingsDialog.execution.test.tsx` |
| SET-056 | An adopted pet's `Wake / Tuck away` toggle updates the page immediately and persists `pet.enabled` on save | `SettingsDialog.execution.test.tsx` |
| SET-057 | The Community tab supports `Refresh` and `Download community pets` and shows sync-complete copy | `SettingsDialog.execution.test.tsx` |
| SET-058 | The Community tab's hatch prompt carries the current concept, can be copied to clipboard, and shows a `Copied!` confirmation | `SettingsDialog.execution.test.tsx` |
| SET-059 | The Skills & Design Systems page defaults to the Skills library, supports filtering by mode, and combines with search | `SettingsDialog.execution.test.tsx` |
| SET-060 | The Skills library can expand a preview and toggle a skill into `disabledSkills` on save | `SettingsDialog.execution.test.tsx` |
| SET-061 | After switching to the Design Systems library, category filtering, expanded preview, and `disabledDesignSystems` saving all work | `SettingsDialog.execution.test.tsx` |
| SET-062 | A no-match search in Skills & Design Systems shows an empty-results hint | `SettingsDialog.execution.test.tsx` |
| SET-063 | The About page renders `Version / Channel / Runtime / Platform / Architecture` as five read-only fields | `SettingsDialog.execution.test.tsx` |
| SET-064 | When `appVersionInfo` is missing, the About page shows a version-info-unavailable empty state | `SettingsDialog.execution.test.tsx` |
| SET-065 | About is read-only; close button or overlay close does not trigger a save or dirty state | `SettingsDialog.execution.test.tsx` |
| SET-066 | The Settings autosave status covers `Saving… / All changes saved / Couldn't save changes` | `SettingsDialog.execution.test.tsx` |
| SET-067 | The BYOK `Test` button enables only after required fields are valid and shows the provider connection test result | `SettingsDialog.execution.test.tsx` |
| SET-068 | The Local CLI `Test` button uses the currently selected installed agent for a connection test and surfaces the agent response | `SettingsDialog.execution.test.tsx` |
| SET-069 | Appearance supports preset accent colors and custom values; switching previews live and autosaves `accentColor` | `SettingsDialog.execution.test.tsx` |
| SET-070 | The Orbit page locks Run / toggles / time / template controls when no connector is available, and the gate CTA jumps to Connectors | `SettingsDialog.orbit.test.tsx` |
| SET-071 | When a connector is available, Orbit can toggle daily summary, edit run time, switch prompt template, and autosave the schedule | `SettingsDialog.orbit.test.tsx` |
| SET-072 | The Orbit page surfaces the latest run receipt, stats, the live-artifact entry, and supports copying the markdown result | `SettingsDialog.orbit.test.tsx` |

## Automation candidates

| ID | Scenario | Reason |
| --- | --- | --- |
| SET-C03 | End-to-end regression that downstream image / video / audio generation actually consumes media-provider config | Fits automation but needs additional mocking around the generation pipeline |
| SET-C05 | MCP server Cursor deeplink / multi-platform path differences (macOS / Linux / Windows) | Fits automation but needs finer environment mocks or scheme behavior assertions |
| SET-C06 | Whether ProjectView plays the right success/failure sound and sends a desktop notification on real task-complete events | Fits automation but needs deeper coupling between streaming completion state and window focus |
| SET-C07 | Whether `theme=system` follows OS light/dark preference live via `matchMedia` or the host environment | Fits automation but first needs to confirm the implementation actually listens to system theme changes |
| SET-C08 | Pets page sprite uploads, Codex atlas import, single-row crop, or full-atlas-preserve file handling | Fits automation but depends on file input, image read, canvas crop, and atlas pre-processing — higher maintenance |
| SET-C09 | Built-in / Community pet one-click adopt path: download spritesheet, prepare atlas, write to custom slot, and apply in overlay | Fits automation but needs fetch/blob/image-level mocks or browser-level coupling |
| SET-C10 | Real-world consumption of Skills / Design Systems after app start — disabled items don't appear in entry / new project / runtime libraries | Fits automation but needs full Settings ↔ Entry / ProjectView / runtime cross-page coupling |

## Manual retained

| ID | Scenario | Reason |
| --- | --- | --- |
| SET-M01 | Whether the overall feel works across themes | Subjective visual; manual acceptance is more reasonable |
| SET-M02 | Whether multi-language tone reads natural and locally idiomatic | Semantic-quality judgment still needs a human reviewer |

## Notes

- The API protocol cases matter because historical config migration and protocol switching regress silently; unit tests alone are not stable enough.
- `localized-content.test.ts` is not a browser flow, but it does protect Settings / Entry display completeness across locales — it lives here for that reason.
