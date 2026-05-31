# Entry module

## Coverage

- New-project entry panel
- Entry-side rail project-type switching with draft preservation
- Top-tab structure on the home page
- Examples gallery search, filter, preview, and export
- Prompt-template creation path
- Connector entry and connector gating
- Resource-driven project-creation happy path

## Test files

- `e2e/ui/entry-configuration-flows.test.ts`
- `e2e/ui/entry-chrome-flows.test.ts`
- `e2e/ui/app.test.ts`
- `apps/web/tests/components/ExamplesTab.test.tsx`

## Automated

### Entry configuration flows

| ID | Scenario | Source |
| --- | --- | --- |
| ENTRY-001 | After a prompt-template load failure, retrying writes the edited template body into project metadata | `entry-configuration-flows.test.ts` |
| ENTRY-002 | The empty-state connector CTA on a live artifact jumps to the protected connector setup path | `entry-configuration-flows.test.ts` |
| ENTRY-003 | The connector entry supports search, an empty-results state, and keyboard close on the detail drawer | `entry-configuration-flows.test.ts` |
| ENTRY-004 | After saving a Composio key in Settings, the Entry-page connectors gate unlocks immediately and search and cards are usable | `entry-configuration-flows.test.ts` |
| ENTRY-005 | When creating a prototype, switching to `Wireframe` keeps the `fidelity` choice across project-type switches and writes it into the create payload | `NewProjectPanel.test.tsx` |
| ENTRY-006 | When creating a prototype, switching back to `Unspecified — open-ended` in design-system multi-select clears the primary design system and inspiration metadata | `NewProjectPanel.test.tsx` |
| ENTRY-007 | When creating a prototype, an empty project name falls back to the auto-generated default title rather than submitting an empty name | `NewProjectPanel.test.tsx` |
| ENTRY-008 | Creating a live artifact writes `kind=prototype`, `intent=live-artifact`, and the current `fidelity` into the create payload | `NewProjectPanel.test.tsx` |
| ENTRY-009 | When creating a slide deck, enabling `Use speaker notes` writes `speakerNotes=true` into the create metadata | `NewProjectPanel.test.tsx` |
| ENTRY-010 | When creating from a template, no user templates means no accidental create; with templates, it submits with `templateId/templateLabel` | `NewProjectPanel.test.tsx` |
| ENTRY-011 | When creating an image project, the chosen `aspect` and trimmed `style notes` are written into the create payload | `NewProjectPanel.test.tsx` |
| ENTRY-012 | When creating a video project, the chosen `aspect` and `duration` are written into the create payload | `NewProjectPanel.test.tsx` |
| ENTRY-013 | When creating an audio project, the chosen `duration` and trimmed `voice` are written into the create payload | `NewProjectPanel.test.tsx` |
| ENTRY-014 | The top settings menu toggles the pet rail's visibility | `entry-chrome-flows.test.ts` |
| ENTRY-015 | At narrow desktop widths, the entry header and full page have no significant horizontal overflow | `entry-chrome-flows.test.ts` |
| ENTRY-016 | The home top tabs are pinned to `Designs / Examples / Design systems / Image templates / Video templates`; the legacy `Connectors` tab no longer renders | `entry-chrome-flows.test.ts` |
| ENTRY-017 | When the Examples library is empty, a daemon/catalog-unavailable hint is shown | `ExamplesTab.test.tsx` |
| ENTRY-018 | Examples search matches by name, description, and prompt; an empty-results state shows when nothing matches | `ExamplesTab.test.tsx` |
| ENTRY-019 | Examples filters (Surface, Type, Scenario) narrow the card list correctly | `ExamplesTab.test.tsx` |
| ENTRY-020 | Clicking `Use this prompt` on an Examples card hands the selected skill to the fast-path creator | `ExamplesTab.test.tsx` |
| ENTRY-021 | After lazy-loading an Examples preview, the Share menu can trigger PDF, ZIP, and HTML exports | `ExamplesTab.test.tsx` |
| ENTRY-022 | The Examples fullscreen preview dialog supports Fullscreen / ESC / Exit, Share PDF/ZIP/HTML exports, Open in new tab, and close | `ExamplesTab.test.tsx` |
| ENTRY-023 | Clicking the `Docs & templates` Examples filter shows only template-style examples and `Use this prompt` uses the template prompt | `ExamplesTab.test.tsx` |

### Resource-driven create scenarios

| ID | Scenario | Source |
| --- | --- | --- |
| ENTRY-101 | A Prototype project can be created and the generated artifact previewed | `app.test.ts` via `prototype-basic` |
| ENTRY-102 | A Deck project can be created and the generated deck artifact previewed | `app.test.ts` via `deck-basic` |
| ENTRY-103 | Selecting a design system carries the right configuration into project creation | `app.test.ts` via `design-system-selection` |
| ENTRY-104 | Using an example prompt creates a project pre-filled with the draft prompt | `app.test.ts` via `example-use-prompt` |

## Automation candidates

| ID | Scenario | Reason |
| --- | --- | --- |
| ENTRY-C01 | More image-template / video-template entry-create flows | Business value is real, but entry coverage is currently main-path heavy; expand once template capabilities settle |

## Manual retained

| ID | Scenario | Reason |
| --- | --- | --- |
| ENTRY-M01 | Whether the entry-page visual style matches brand expectations | Subjective visual judgment; not a stable automation assertion |
| ENTRY-M02 | Whether entry animations, transitions, and micro-interactions feel natural | Better-suited to manual experience acceptance; low automation ROI |

## Notes

- Some `app.test.ts` scenarios come from `e2e/resources/playwright.ts`. When adding resource-driven cases, update both the resource file and this document.
- Mocked-SSE-dependent entry flows should stay stable, repeatable, and fast.
