# Project management module

## Coverage

- Home-page project cards
- Home-page search and view switching
- Design-system selection during design creation
- Project rename persistence
- Design-file deletion and home-page delete flows
- Pet customization at the home entry

## Test files

- `e2e/ui/project-management-flows.test.ts`

## Automated

| ID | Scenario | Source |
| --- | --- | --- |
| PM-001 | Prototype, live artifact, deck, and image tabs switch correctly and draft contents are preserved | `project-management-flows.test.ts` |
| PM-002 | Multi-select design system stores the primary system and inspiration metadata correctly | `project-management-flows.test.ts` |
| PM-003 | Single-select design system can switch the target system after a search | `project-management-flows.test.ts` |
| PM-004 | A renamed project title persists across reload; a blank title does not overwrite the original | `project-management-flows.test.ts` |
| PM-005 | Cancelling a design-file delete preserves both the file row and any open tabs | `project-management-flows.test.ts` |
| PM-006 | The home-page design-card delete covers both the cancel and confirm paths | `project-management-flows.test.ts` |
| PM-007 | The home designs view supports grid / kanban switching and survives reload | `project-management-flows.test.ts` |
| PM-008 | Home search filters project cards and recovers from an empty-results state | `project-management-flows.test.ts` |
| PM-009 | Change pet opens the pet settings and saves a custom companion | `project-management-flows.test.ts` |

## Automation candidates

| ID | Scenario | Reason |
| --- | --- | --- |
| PM-C02 | Additional design-system filter / sort / categorization behavior | Clear value, but assertions should solidify after the product-side interaction stabilises |

## Manual retained

| ID | Scenario | Reason |
| --- | --- | --- |
| PM-M01 | Whether the pet's look, expressions, and interactions feel "natural / fun" | Strongly subjective; not a fit for automation |
| PM-M02 | Whether the home cards' visual density and layout feel comfortable | Better as manual visual acceptance |

## Notes

- Home-page / project-management scenarios live in a single Playwright file because they share a similar project-init lifecycle.
- The design-system coverage simultaneously verifies metadata persistence and picker search behavior.
