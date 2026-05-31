# Workspace module

## Coverage

- Project-workspace conversation and file streams
- Design Files upload, delete, and tab persistence
- Quick switcher keyboard behavior
- Chat-pane width persistence
- Manual-edit-mode regression

## Test files

- `e2e/ui/app.test.ts`
- `e2e/ui/workspace-keyboard-flows.test.ts`

## Automated

### Resource-driven workspace scenarios

| ID | Scenario | Source |
| --- | --- | --- |
| WS-001 | Conversation history persists across reload and thread switching | `app.test.ts` via `conversation-persistence` |
| WS-002 | After uploading a file, the user can mention it in chat to send it back to the agent | `app.test.ts` via `file-mention` |
| WS-003 | A deep-link to a file opens the project at the correct preview tab | `app.test.ts` via `deep-link-preview` |
| WS-004 | The composer file picker uploads and sends a file alongside the prompt | `app.test.ts` via `file-upload-send` |
| WS-005 | An uploaded image in Design Files opens in the workspace and is previewable | `app.test.ts` via `design-files-upload` |
| WS-006 | Deleting an uploaded file in Design Files clears the list and any open tab | `app.test.ts` via `design-files-delete` |
| WS-007 | Open file tabs restore correctly after reload with the right active item | `app.test.ts` via `design-files-tab-persistence` |
| WS-008 | Deleting the active conversation falls back to the next remaining thread | `app.test.ts` via `conversation-delete-recovery` |
| WS-009 | Multi-select question forms enforce the max selection count | `app.test.ts` via `question-form-selection-limit` |
| WS-010 | Question-form answers enter the chat history and lock state survives reload | `app.test.ts` via `question-form-submit-persistence` |
| WS-011 | Without a new prompt, reload / idle does not generate extra files | `app.test.ts` via `generation-does-not-create-extra-file` |
| WS-012 | Preview comments attach to chat as structured context | `app.test.ts` via `comment-attachment-flow` |
| WS-013 | After a daemon send failure, error details remain visible for retry / triage | `app.test.ts` direct test |
| WS-014 | Manual edit mode supports content, style, and source patches plus undo / redo | `app.test.ts` direct test |
| WS-015 | A deck-shaped HTML keeps deck navigation in manual edit mode | `app.test.ts` direct test |

### Keyboard-first workspace flows

| ID | Scenario | Source |
| --- | --- | --- |
| WS-101 | The quick switcher can be opened via keyboard and activates the target file | `workspace-keyboard-flows.test.ts` |
| WS-102 | A no-match search in the quick switcher does not change the current file | `workspace-keyboard-flows.test.ts` |
| WS-103 | Arrow-key navigation in the quick switcher selects then opens a file | `workspace-keyboard-flows.test.ts` |
| WS-104 | Resizing the chat pane via keyboard persists across reload | `workspace-keyboard-flows.test.ts` |

## Automation candidates

| ID | Scenario | Reason |
| --- | --- | --- |
| WS-C01 | Source preview for non-HTML files like Python | Good fit for automation, but viewer capability still pending |
| WS-C02 | Fuller pure-keyboard navigation in the workspace sidebar | Strong automation value, but product-side shortcuts and focus rules need to settle first |
| WS-C03 | Multi-conversation rename / archive / restore flows | Worth automating once these capabilities are formally stable in the product |

## Manual retained

| ID | Scenario | Reason |
| --- | --- | --- |
| WS-M01 | Whether generated previews meet a "design quality" bar | Subjective content judgment; not a stable assertion |
| WS-M02 | Whether manual-edit visual details feel polished enough | Better as design / QA manual acceptance |

## Notes

- `app.test.ts` mixes resource-driven scenarios with a few centralised regressions; cases here are grouped by user behavior, not by helper or implementation structure.
- Resource-driven scenarios come from `e2e/resources/playwright.ts`.
