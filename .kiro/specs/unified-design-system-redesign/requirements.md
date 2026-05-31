# Requirements Document

## Introduction

This feature replaces the visual surface of every shipped app in the Galyarder Design monorepo with a single, coherent, agent-native design system. Three apps are in scope: the web client (`apps/web`), the marketing landing page (`apps/landing-page`), and the desktop chrome (`apps/desktop`). The redesign is a from-scratch visual rewrite, not a polish pass: every screen is rebuilt against one token layer and one component library, light and dark mode are first-class, layout reflows correctly for RTL and CJK locales, and WCAG AA contrast holds throughout. The redesigned surface preserves all existing functionality and does not change the daemon HTTP contract or `packages/contracts` shapes.

The design direction is editorial-modern and founder-grade — Linear × Stripe × Anthropic × Things 3. It uses an OKLch palette, strong typographic hierarchy, generous negative space, monospaced numerals for runtime telemetry, and deliberate motion that respects the repo's existing UI animation philosophy (ease-out cubic-bezier(0.23, 1, 0.32, 1), asymmetric durations, grid-row accordion, no animation from `scale(0)`).

## Glossary

- **Galyarder_Design**: The product as a whole; brand name "Galyarder Design" with tagline "The aesthetic, agent-native design engine for the 1-Man Army."
- **Design_System**: The unified visual layer (tokens + component library + iconography + motion conventions) shared across `apps/web`, `apps/landing-page`, and `apps/desktop`.
- **Token_Layer**: The CSS custom properties and tailwind/postcss bridge that defines color, typography, spacing, radius, shadow, motion, z-index, and density tokens.
- **Component_Library**: The set of primitive React components under `apps/web/src/components/ds/` consumed by all three apps (directly in web, via React islands in landing-page, via the desktop renderer process in `apps/desktop`).
- **Web_App**: The web client at `apps/web`; the primary surface owning approximately 90% of the redesigned UX.
- **Landing_Page**: The marketing site at `apps/landing-page` (Astro + React).
- **Desktop_Chrome**: The presentation layer of `apps/desktop` — title bar, updater popup, and window-size behavior; excludes Electron main-process logic.
- **Daemon**: The local privileged HTTP service at `apps/daemon` that owns `/api/*`; out of scope for visual changes and not allowed to change in shape.
- **Project_Picker**: The Entry view shown before any project is selected.
- **Home_View**: The active-project view with chat composer on the left and sandboxed iframe preview on the right.
- **Project_View**: The in-project workspace view (file viewer, design system picker, skill picker, tweaks panel).
- **Chat_Composer**: The composer surface in `Home_View` and `Project_View` including the pinned `TodoCard`, `AskUserQuestionCard`, and tool-result rendering.
- **Iframe_Preview**: The sandboxed preview iframe with zoom controls, device frame, render-mode toggle, comment side panel, and tweaks panel.
- **Settings_Dialog**: The web settings surface for privacy, execution mode, model, locale, and telemetry.
- **Plugin_Gallery**: The plugin browse-and-detail surface in the web app.
- **Design_System_Gallery**: The design-system browse-and-preview surface in the web app.
- **Skill_Picker**: The skill browse-and-detail surface in the web app.
- **File_Workspace**: The web surface for browsing generated files, opening the file viewer, and triggering hand-off.
- **Memory_Section**: The web surface for saved facts including search and prune actions.
- **Connectors_Rail**: The web surface for connectors and automations.
- **Updater_Popup**: The desktop release-notes popup rendered by `UpdaterPopup.tsx`.
- **Empty_State**: A rendered placeholder shown when a list has no items.
- **Error_State**: A rendered placeholder shown when an operation fails (daemon down, API key missing, agent CLI not found, build failed).
- **Density_Multiplier**: The single CSS custom property `--density-multiplier` controlling the comfortable/compact density modes.
- **RTL_Locale**: A locale whose script flows right-to-left; the supported set is `ar` and `fa`.
- **CJK_Locale**: A locale using Chinese, Japanese, or Korean script; the supported set is `ja` and `ko`.
- **Reduced_Motion**: The `prefers-reduced-motion: reduce` user-agent setting.
- **Web_Test_Suite**: The vitest suite at `apps/web/tests/`.
- **Plan_Artifact**: The audit-and-plan document at `.tmp/redesign/plan.md`.
- **Deps_Note**: The new-dependency justification document at `.tmp/redesign/deps.md`.

## Requirements

### Requirement 1: Unified Token Layer

**User Story:** As a Galyarder_Design developer, I want one source of design tokens consumed by all three apps, so that visual changes propagate consistently and theme drift is impossible.

#### Acceptance Criteria

1. THE Token_Layer SHALL define color tokens as a 12-step neutral ramp indexed `0`..`11` (where `0` is the lightest in light mode and the darkest in dark mode, inverted in dark mode) plus accent (primary), accent-2 (secondary), success, warning, danger, and info families, each family with light-mode and dark-mode values for every step or role it defines.
2. THE Token_Layer SHALL express each color token as an OKLch value AND a hex fallback, so that the token resolves to the OKLch value in browsers that support OKLch and to the hex value in browsers that do not.
3. THE Token_Layer SHALL define typography tokens for display, h1, h2, h3, h4, body-lg, body, body-sm, caption, code, and mono-numeral styles, where each style declares font-family, font-size, line-height, font-weight, and letter-spacing, mapped to a sans family chosen from Inter, Geist, or General Sans and a mono family chosen from JetBrains Mono or Geist Mono.
4. THE Token_Layer SHALL define a 4px-base spacing scale comprising the discrete values 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, and 96 px, AND SHALL expose the semantic aliases `gutter`, `section-gap`, and `card-padding`, each pointing at one of the discrete scale values.
5. THE Token_Layer SHALL define radius tokens at sizes `sm` (between 2 px and 4 px), `md` (between 4 px and 8 px), `lg` (between 8 px and 16 px), and `full` (≥ 9999 px), with a default radius for component primitives between 4 px and 8 px.
6. THE Token_Layer SHALL define three shadow tokens named `resting`, `raised`, and `floating`, where `floating` produces a stronger perceived elevation than `raised`, `raised` produces a stronger perceived elevation than `resting`, and each token has separately tuned light-mode and dark-mode values.
7. THE Token_Layer SHALL define motion duration tokens of exactly 100 ms (snap), 180 ms (base), and 240 ms (gentle), AND an easing token equal to `cubic-bezier(0.23, 1, 0.32, 1)`.
8. THE Token_Layer SHALL define a named z-index scale comprising `base`, `dropdown`, `sticky`, `overlay`, `modal`, and `toast` tiers, in strictly increasing numeric order.
9. IF a redesigned source file in `apps/web`, `apps/landing-page`, or `apps/desktop` declares a `z-index` numeric literal that does not resolve through the Token_Layer's named z-index scale, THEN `pnpm guard` SHALL fail with an error identifying the file, line, and offending literal.
10. THE Token_Layer SHALL be defined in a single source location, AND SHALL be consumed without redefinition by Web_App, Landing_Page, and Desktop_Chrome such that changing a token value in the source location changes the resolved value in every consuming surface.
11. IF a token referenced in a redesigned source file is not defined in the Token_Layer, THEN the build of the consuming app SHALL fail with an error identifying the missing token name and the consuming file.

### Requirement 2: Shared Component Library

**User Story:** As a Galyarder_Design developer, I want one reusable component library, so that every screen in every app uses the same primitives with the same accessibility and styling guarantees.

#### Acceptance Criteria

1. THE Component_Library SHALL provide, under `apps/web/src/components/ds/`, the following primitives, each exported by its exact PascalCase name from a single index module: Button, IconButton, ToggleGroup, Switch, Checkbox, Radio, TextInput, Textarea, Select, Combobox, Slider, Tabs, Segmented, Card, Sheet, Dialog, Drawer, Popover, Tooltip, Toast, Banner, Badge, Tag, Chip, Avatar, Kbd, Spinner, Progress, Skeleton, EmptyState, Pagination, MenuList, ContextMenu, Breadcrumbs, NavRail, NavItem, ScrollArea.
2. THE Component_Library SHALL forward refs on every primitive that wraps a focusable or measurable DOM element, such that a `ref` passed by a caller resolves to the underlying DOM node.
3. THE Component_Library SHALL drive every primitive's visual styling from Token_Layer custom properties, AND SHALL NOT contain hardcoded literal values for color, spacing, radius, or shadow inside primitive sources.
4. IF a primitive source under `apps/web/src/components/ds/` contains a hardcoded color, spacing, radius, or shadow literal, THEN `pnpm guard` SHALL fail with an error identifying the file and offending literal.
5. THE Component_Library SHALL ship JSDoc on each primitive's exported declaration containing at least one `@example` block whose content compiles as a valid TypeScript usage of the primitive.
6. THE Component_Library SHALL ship a unit test file for every primitive under `apps/web/tests/components/ds/`, named after the primitive, AND each test file SHALL include at least one ref-forwarding assertion; the Web_Test_Suite SHALL pass with those tests included.
7. WHEN Landing_Page renders a Component_Library primitive, THE Landing_Page SHALL import the primitive from the canonical `apps/web/src/components/ds/` source via Astro React islands, without duplicating the primitive's source.
8. WHEN Desktop_Chrome's renderer process renders a Component_Library primitive, THE Desktop_Chrome SHALL import the primitive from the canonical `apps/web/src/components/ds/` source, without duplicating the primitive's source.

### Requirement 3: Iconography Standard

**User Story:** As a Galyarder_Design designer, I want one icon system across the product, so that visual weight stays consistent.

#### Acceptance Criteria

1. THE Design_System SHALL use `lucide-react` as the sole icon import source across Web_App, Landing_Page, and Desktop_Chrome, with zero icon imports from any other package.
2. WHEN a redesigned source file renders an icon, THE Design_System SHALL render it at exactly one of 16 px, 20 px, or 24 px, with no other pixel size permitted.
3. WHEN a redesigned source file renders an icon, THE Design_System SHALL apply a 1.5 px stroke width on the rendered SVG output.
4. IF a redesigned source file imports an icon from any package other than `lucide-react`, THEN `pnpm guard` SHALL fail with an error identifying the file and offending import, AND the change SHALL NOT merge.
5. IF a redesigned source file renders an icon at any pixel size other than 16, 20, or 24, OR with any stroke width other than 1.5 px, THEN `pnpm guard` SHALL fail with an error identifying the file, line, and violation, AND the change SHALL NOT merge.

### Requirement 4: Light and Dark Theming

**User Story:** As a Galyarder_Design user, I want light and dark mode to be equally polished, so that I can pick whichever fits my environment.

#### Acceptance Criteria

1. THE Token_Layer SHALL define a non-null light-mode value AND a non-null dark-mode value for every color token, shadow token, border token, and surface token.
2. IF any token in the categories color, shadow, border, or surface is missing a value for either light mode or dark mode, THEN `pnpm guard` SHALL fail with an error identifying the missing token and mode.
3. WHEN the active theme switches between light and dark, THE Web_App SHALL update every visible surface to use the new theme values within 500 ms without page reload.
4. WHEN the active theme switches between light and dark, THE Landing_Page SHALL update every visible surface to use the new theme values within 500 ms without page reload.
5. WHEN the active theme switches between light and dark, THE Desktop_Chrome SHALL update the title bar and Updater_Popup to use the new theme values within 500 ms without window restart.
6. THE Design_System SHALL maintain a contrast ratio of at least 4.5:1 for body text and at least 3:1 for interactive borders, icons, and focus indicators in both light and dark modes.
7. WHEN the user selects a theme via Settings_Dialog, THE Web_App SHALL persist the selection across browser sessions of the same browser profile.
8. IF no persisted theme selection exists for the current browser profile, THEN THE Web_App SHALL set the initial active theme to match the operating system color-scheme preference.

### Requirement 5: Density Mode

**User Story:** As a Galyarder_Design user, I want to switch between comfortable and compact density, so that I can fit more content on small screens or relax spacing on large displays.

#### Acceptance Criteria

1. THE Token_Layer SHALL expose a single CSS custom property named `--density-multiplier` whose comfortable value is `1.0` and whose compact value is `0.85`.
2. WHEN the user activates compact density, THE Web_App SHALL apply Density_Multiplier-derived spacing within 100 ms, preserve the document DOM structure, and produce no per-element layout shift greater than 2 px caused by structural change.
3. WHEN the user activates comfortable density, THE Web_App SHALL apply Density_Multiplier-derived spacing within 100 ms, preserve the document DOM structure, and produce no per-element layout shift greater than 2 px caused by structural change.
4. THE Component_Library SHALL derive interactive component padding and gap values from `--density-multiplier`, such that a single change to the variable propagates through one style recalculation with no hard-coded bypass values in primitive sources.
5. IF the active `--density-multiplier` value is set outside the inclusive range 0.75 to 1.25, THEN THE Web_App SHALL clamp the value into that range and emit a development-only console warning identifying the rejected value.
6. WHEN the user reloads the Web_App, THE Web_App SHALL restore the previously selected density before the first interactive component renders.

### Requirement 6: Motion System

**User Story:** As a Galyarder_Design user, I want motion that confirms intent without being distracting, so that the product feels responsive but calm.

#### Acceptance Criteria

1. THE Design_System SHALL apply `cubic-bezier(0.23, 1, 0.32, 1)` as the easing function for every UI transition declared in redesigned source files, except where an inline code comment at the declaration site documents an alternate easing.
2. THE Design_System SHALL use enter transition durations of 200 ms (±10 ms) and exit transition durations of 140 ms (±10 ms) for redesigned conditional UI.
3. WHEN a redesigned disclosure expands or collapses, THE Web_App SHALL animate the change using the `grid-template-rows: 0fr -> 1fr` pattern (reversed for collapse) paired with an opacity transition between 0 and 1.
4. THE Design_System SHALL NOT animate any redesigned element from `transform: scale(0)`, AND SHALL start scale-based entrances at `scale(0.9)` or higher paired with `opacity: 0`.
5. WHILE Reduced_Motion is set, THE Web_App, Landing_Page, and Desktop_Chrome SHALL render all decorative transitions (transitions whose sole purpose is visual polish, including disclosure animations, hover effects, and entrance animations) as instantaneous state changes with a 0 ms duration.

### Requirement 7: RTL and CJK Layout Reflow

**User Story:** As a Galyarder_Design user reading in Arabic, Persian, Japanese, German, or other long-form locales, I want the layout to reflow correctly, so that nothing is clipped or mis-aligned.

#### Acceptance Criteria

1. WHEN the active locale is an RTL_Locale, THE Web_App SHALL mirror layout direction across navigation rails, chat composer, iframe preview chrome, and dialog actions, with no horizontal clipping at viewport widths between 1024 px and 1920 px.
2. WHEN the active locale is an RTL_Locale, THE Landing_Page SHALL mirror layout direction across header, hero, grid sections, and footer, with no horizontal clipping at viewport widths between 1024 px and 1920 px.
3. WHEN the active locale is a CJK_Locale, THE Web_App SHALL apply CJK-aware line-height and word-break rules so that no glyph rendered inside a card extends beyond that card's inner padding box at viewport widths between 320 px and 1920 px.
4. WHEN the active locale renders text whose pixel width exceeds the English equivalent by more than 10 percent (verified with German), THE Web_App SHALL allow the affected control to grow or wrap rather than truncate without indication.
5. IF a redesigned control truncates text, THEN THE Web_App SHALL display a visible truncation indicator (such as an ellipsis and a tooltip exposing the full string on focus or hover).
6. THE Web_App SHALL preserve the existing CJK detection patterns in `HomeView.tsx`, `ProjectView.tsx`, `HomeHero.tsx`, `projectName.ts`, and `pointer.ts` verbatim including their English annotations.

### Requirement 8: Accessibility Compliance

**User Story:** As a Galyarder_Design user with assistive technology, I want every redesigned surface to be accessible, so that I can use the product without barriers.

#### Acceptance Criteria

1. THE Design_System SHALL maintain a contrast ratio of at least 4.5:1 for body text below 18 pt, at least 3:1 for body text at or above 18 pt, and at least 3:1 for interactive controls and focus indicators, in both light and dark modes.
2. WHEN a focusable Component_Library primitive receives focus via keyboard navigation, THE primitive SHALL render a focus ring at least 2 CSS pixels thick with at least 3:1 contrast against the adjacent background.
3. WHEN a user navigates the Web_App, Landing_Page, or Desktop_Chrome using only the keyboard, THE redesigned surface SHALL allow every primary action to be reached using Tab and Shift+Tab in a visible logical order, AND activated using Enter or Space.
4. THE Component_Library SHALL apply ARIA roles, names, and states appropriate to each primitive (buttons, dialogs, menus, tabs, switches, popovers) reflecting the current interaction status.
5. IF a Component_Library primitive renders without a visible label, THEN THE primitive SHALL expose a programmatic accessible name via `aria-label` or `aria-labelledby`.
6. WHILE Reduced_Motion is set, THE Design_System SHALL disable or substantially reduce non-essential animation per Requirement 6.

### Requirement 9: Performance Budget

**User Story:** As a Galyarder_Design user, I want Home_View to feel fast, so that the product reads as premium rather than heavy.

#### Acceptance Criteria

1. WHEN a user opens Home_View on a cold Web_App session (first session load with no retained bundle, cache, or session state), THE Web_App SHALL produce First Contentful Paint within 1200 ms, measured on a reference machine with at least 8 logical CPU cores, 16 GB RAM, and localhost connection to the Daemon.
2. WHEN a user re-opens Home_View on a warm Web_App session (subsequent navigation with retained bundle in memory and retained session state), THE Web_App SHALL produce First Contentful Paint within 600 ms, measured on the same reference machine.
3. WHILE an agent stream is rendering tokens into Home_View, THE Web_App SHALL NOT cause geometry, size, or position changes on surfaces outside the streaming message container, AND SHALL contribute zero Cumulative Layout Shift from those surfaces during the stream.

### Requirement 10: Web App — Entry View

**User Story:** As a user opening the web client without an active project, I want a focused project picker, so that I can start or resume work without distraction.

#### Acceptance Criteria

1. WHEN the Web_App finishes initial route resolution and detects no active project in session state, THE Web_App SHALL render the redesigned Project_Picker as the entry view within 500 ms.
2. THE Project_Picker SHALL be implemented in `apps/web/src/views/EntryView.tsx` (or the existing equivalent file), AND SHALL preserve the exported component name and the public prop signature (names, types, optionality, defaults) of the pre-redesign component, with no removed or renamed props.
3. THE Project_Picker SHALL surface project creation as a single visually primary control, AND SHALL list existing projects as a scrollable secondary list ordered most-recently-updated first.
4. WHEN the Project_Picker has zero existing projects, THE Project_Picker SHALL render the no-projects Empty_State per Requirement 23 in place of the secondary list, while keeping the create-project primary action visible and operable.
5. IF project state cannot be determined because the source is unavailable or errors, THEN THE Project_Picker SHALL render a non-destructive loading or error state with a retry control, AND SHALL NOT auto-create or auto-select a project.

### Requirement 11: Web App — Home View

**User Story:** As a user with an active project, I want a calm two-pane home view, so that I can drive the agent and watch the iframe preview at the same time.

#### Acceptance Criteria

1. WHEN the Web_App loads an active project, THE Web_App SHALL render Home_View as a two-pane layout with Chat_Composer on the leading side occupying between 30 and 70 percent of the viewport width and Iframe_Preview on the trailing side occupying the remaining width, with each pane no narrower than 320 CSS pixels.
2. THE Home_View SHALL be implemented in `apps/web/src/views/HomeView.tsx` (or the existing equivalent file).
3. THE Home_View SHALL preserve the exported component name, prop names, and prop type signatures of the pre-redesign component, such that existing callers compile without source changes.
4. THE Home_View SHALL preserve the existing CJK detection patterns in `HomeView.tsx` and `HomeHero.tsx` verbatim including their English annotations.
5. WHILE the user drags the Home_View pane divider, THE Web_App SHALL adjust both pane widths continuously, AND SHALL retain the Iframe_Preview's loaded document, scroll position, and JavaScript runtime state for the duration of the drag.
6. IF a drag would shrink either pane below 320 CSS pixels, THEN THE Web_App SHALL clamp the divider at the 320 px boundary while keeping Iframe_Preview mounted.

### Requirement 12: Web App — Project View

**User Story:** As a user inside a project, I want one workspace surface to view files, switch design system, switch skill, and adjust tweaks, so that I do not jump across modal stacks.

#### Acceptance Criteria

1. WHEN the user opens a project workspace, THE Web_App SHALL render the redesigned Project_View such that the file viewer, Design_System_Gallery picker, Skill_Picker, and tweaks panel are each reachable from controls rendered inside the same Project_View chrome without opening any modal dialog.
2. THE Project_View SHALL be implemented in `apps/web/src/views/ProjectView.tsx` (or the existing equivalent file).
3. THE Project_View SHALL preserve the exported component name and the public prop signature (names, types, optionality, defaults) of the pre-redesign component, with no removed or renamed props.
4. THE Project_View SHALL preserve the existing CJK detection patterns in `ProjectView.tsx` verbatim including their English annotations.
5. IF the file viewer, Design_System_Gallery picker, Skill_Picker, or tweaks panel fails to load its data, THEN THE Project_View SHALL render a non-blocking error state inside that surface with a retry control, AND SHALL keep the other three surfaces interactive.

### Requirement 13: Web App — Settings Dialog

**User Story:** As a user, I want one Settings_Dialog with privacy, execution mode, model, locale, and telemetry sections, so that I can configure the product without hunting for switches.

#### Acceptance Criteria

1. WHEN the user activates the settings entry control by pointer click or by pressing Enter or Space on the focused control, THE Web_App SHALL render Settings_Dialog within 500 ms with five visibly labeled sections titled privacy, execution mode, model, locale, and telemetry.
2. THE Settings_Dialog SHALL be implemented in `apps/web/src/components/SettingsDialog.tsx` (or the existing equivalent file), AND SHALL preserve the same public prop names and TypeScript prop types as the pre-redesign component so that existing callers compile without source modification.
3. THE Web_App SHALL make Settings_Dialog reachable using the keyboard alone from the entry view onward, such that the settings entry control is focusable through sequential Tab navigation in no more than 10 Tab presses from the first focusable element of the entry view, AND opens Settings_Dialog when the user presses Enter or Space on that focused control.
4. WHILE Settings_Dialog is open, THE Web_App SHALL constrain keyboard focus to interactive controls inside the dialog using Tab and Shift+Tab, place initial focus on the first interactive control when the dialog opens, AND return focus to the control that opened it when the dialog closes.
5. WHEN the user presses the Escape key while Settings_Dialog is open, THE Web_App SHALL close Settings_Dialog.

### Requirement 14: Web App — Plugin Gallery and Detail Modal

**User Story:** As a user, I want to browse plugins and read their detail before installing, so that I make informed choices.

#### Acceptance Criteria

1. WHEN the user opens the plugins surface, THE Web_App SHALL render Plugin_Gallery as a responsive grid that displays each available plugin as a card showing plugin name, summary, and category indicator within 500 ms of surface activation.
2. WHEN the user activates a plugin card, THE Web_App SHALL render the plugin detail modal through the Component_Library `Dialog` primitive, displaying plugin name, description, version, and an install control within 500 ms of activation.
3. THE Plugin_Gallery SHALL be implemented in `apps/web/src/views/PluginsView.tsx` (or the existing equivalent file), AND SHALL preserve the exported component name and public prop signature of the pre-redesign component.
4. IF plugin metadata fails to load, THEN THE Web_App SHALL display an error indicator on the plugins surface, retain any previously loaded plugin list, AND expose a retry control.
5. IF no plugins are available to display, THEN THE Web_App SHALL render the no-plugins Empty_State per Requirement 23.
6. WHEN the user dismisses the plugin detail modal, THE Web_App SHALL return focus to the plugin card that opened it.

### Requirement 15: Web App — Design System Gallery and Preview

**User Story:** As a user, I want to browse design systems with previews, so that I can pick one for my project before committing.

#### Acceptance Criteria

1. WHEN the user opens the design-systems surface, THE Web_App SHALL render Design_System_Gallery within 500 ms as a grid of cards each showing design-system name and a preview rail thumbnail.
2. WHEN the user activates a design-system card, THE Web_App SHALL render its full preview within 500 ms while keeping the gallery grid visible.
3. THE Design_System_Gallery SHALL be implemented in `apps/web/src/components/DesignSystemFlow.tsx` (or the existing equivalent file), AND SHALL preserve the exported component name and public prop signature of the pre-redesign component.
4. IF design-system metadata fails to load, THEN THE Web_App SHALL display an error indicator with a retry control AND retain any previously loaded entries.
5. IF no design systems are available to display, THEN THE Web_App SHALL render the no-design-systems Empty_State per Requirement 23.

### Requirement 16: Web App — Skill Picker and Detail

**User Story:** As a user, I want to browse skills and inspect their detail before applying, so that I can choose the right capability for the next agent turn.

#### Acceptance Criteria

1. WHEN the user opens the skills surface, THE Web_App SHALL render Skill_Picker as a responsive grid that displays each available skill as a card showing skill name, summary, and category indicator within 500 ms of surface activation.
2. WHEN the user activates a skill from Skill_Picker, THE Web_App SHALL render the skill detail surface displaying the skill name, full description, input parameters, and an apply control within 500 ms of activation.
3. IF skill metadata fails to load, THEN THE Web_App SHALL display an error indicator on the skills surface, retain any previously loaded skill list, AND expose a retry control.
4. IF no skills are available to display, THEN THE Web_App SHALL render the no-skills Empty_State per Requirement 23.
5. WHEN the user dismisses the skill detail surface, THE Web_App SHALL return focus to Skill_Picker with the previously activated skill card focused.

### Requirement 17: Web App — File Workspace

**User Story:** As a user, I want to browse generated files, open the file viewer, and hand off to disk, so that artifact discovery and export feel like one flow.

#### Acceptance Criteria

1. WHEN the user opens the file workspace, THE Web_App SHALL render File_Workspace within 500 ms with a browseable file list, a viewer surface, and a hand-off control.
2. WHEN the user activates a file in the list, THE File_Workspace viewer SHALL render the file's contents within 500 ms.
3. WHEN the user activates the hand-off control on a file, THE Web_App SHALL initiate the hand-off action against the existing daemon API and surface a success or failure indicator within 2 s of completion.
4. THE File_Workspace viewer SHALL be implemented in `apps/web/src/components/FileViewer.tsx` (or the existing equivalent file), AND SHALL preserve the exported component name and public prop signature of the pre-redesign component.
5. THE File_Workspace SHALL preserve the URL-load vs srcDoc render-mode decision logic in `apps/web/src/components/file-viewer-render-mode.ts` verbatim.
6. IF the file list or a selected file fails to load, THEN THE File_Workspace SHALL render an inline error state with a retry control AND retain other interactive surfaces.

### Requirement 18: Web App — Updater, Privacy Consent, and Dialog System

**User Story:** As a user, I want updater, privacy consent, and other dialogs to share one consistent shell, so that the product feels engineered rather than assembled.

#### Acceptance Criteria

1. WHEN the Web_App displays an updater message, a privacy consent prompt, or any other modal dialog, THE Web_App SHALL render it through the Component_Library `Dialog` primitive, above all page content with a single backdrop overlay and with page scroll locked while open.
2. WHEN the Web_App renders the privacy consent modal, THE Web_App SHALL display exactly one primary accept action labeled with an affirmative verb, exactly one decline action labeled with a negative verb, AND one link that opens detailed privacy information in a new browser tab, with all three controls reachable by keyboard tab order in that sequence.
3. WHEN the Web_App is loaded for the first time on a browser profile that has no recorded privacy consent decision, THE Web_App SHALL render the privacy consent modal before any other dialog, AND WHEN the user activates the accept or decline action, THE Web_App SHALL persist the decision in browser-local storage, close the modal, and not display the privacy consent modal again on subsequent loads of the same browser profile until the stored decision is cleared.
4. WHILE any dialog rendered through the `Dialog` primitive is open, THE Web_App SHALL trap keyboard focus within the dialog AND return focus to the element that opened the dialog when it closes; AND IF the user presses Escape, THEN THE Web_App SHALL close the dialog without committing any pending action, except for the privacy consent modal which SHALL ignore Escape and require an explicit accept or decline action.
5. IF a second dialog is requested while another `Dialog`-rendered dialog is already open, THEN THE Web_App SHALL queue the new dialog and display it only after the currently open dialog closes, so that no more than one dialog is visible at a time.

### Requirement 19: Web App — Chat Composer

**User Story:** As a user, I want a calm composer with one pinned TodoCard, well-rendered AskUserQuestion forms, and consistent tool-result rendering, so that the agent's mid-task state is legible.

#### Acceptance Criteria

1. THE Chat_Composer SHALL be implemented in `apps/web/src/components/ChatComposer.tsx` (or the existing equivalent file), AND SHALL preserve the exported component name, prop names, and prop type signatures of the pre-redesign component.
2. THE Chat_Composer SHALL render exactly one TodoCard pinned above the composer using the existing `PinnedTodoSlot` mechanism in `ChatPane.tsx`, sourced from `latestTodoWriteInputFromMessages`.
3. THE Chat_Composer SHALL render the TodoCard progress count in the format `<completed+in_progress>/<total>`, where the numerator includes both `completed` and `in_progress` items.
4. WHEN the agent emits an `AskUserQuestion` tool call AND the run is active, THE Chat_Composer SHALL render `AskUserQuestionCard` AND submit the user's answer through `onAnswerToolUse(toolUseId, content)` within 200 ms of activation.
5. IF the run has terminated when the user submits an `AskUserQuestion` answer, THEN THE Chat_Composer SHALL fall back to `onSubmitForm(text)` AND preserve the user's selected chips in the rendered card.
6. IF `onAnswerToolUse(toolUseId, content)` fails, THEN THE Chat_Composer SHALL retain the user's selection, display an error indicator on the card, AND keep the submit control enabled for retry.
7. THE Chat_Composer SHALL collapse identical `AskUserQuestion` retries into one card keyed on unique input retaining the latest `tool_use_id`, AND SHALL render only the most recent `TodoWrite` snapshot per `dedupeSnapshotToolRetries` semantics.
8. THE Chat_Composer SHALL render tool result blocks with a single typographic scale, monospaced code, AND copy-to-clipboard affordances using Component_Library primitives, where each copy affordance confirms success within 1500 ms via a transient indicator.

### Requirement 20: Web App — Memory Section

**User Story:** As a user, I want to see, search, and prune saved facts, so that the agent's memory stays clean.

#### Acceptance Criteria

1. WHEN the user opens the memory surface, THE Web_App SHALL render Memory_Section within 500 ms with a saved-facts list, a search field (maximum 200 characters), AND a prune action.
2. WHEN Memory_Section has zero saved facts, THE Web_App SHALL render the no-memory Empty_State per Requirement 23 in place of the list, AND keep the search field disabled and the prune action disabled.
3. WHEN the user types in the search field, THE Web_App SHALL filter the saved-facts list to entries whose contents contain the query as a case-insensitive substring, debounced at 300 ms.
4. WHEN the user activates the prune action, THE Web_App SHALL render a confirmation dialog showing the count of facts that will be pruned, AND SHALL only perform the prune after the user confirms.
5. IF the prune operation fails, THEN THE Web_App SHALL preserve the saved-facts list state, display an error indicator, AND offer a retry control within 2 s.

### Requirement 21: Web App — Connectors and Automations Rail

**User Story:** As a user, I want connectors and automations in one rail, so that I can find integrations and routines without context switching.

#### Acceptance Criteria

1. WHEN the user opens the connectors-and-automations surface, THE Web_App SHALL render Connectors_Rail within 500 ms with two visibly labeled sections titled connectors and automations.
2. THE Connectors_Rail SHALL render each connector entry with a name, status indicator, and primary action, AND each automation entry with a name, last-run indicator, and primary action.
3. WHEN the user navigates Connectors_Rail using only the keyboard, THE Web_App SHALL allow the user to move focus through every section heading and every entry primary action using Tab and Shift+Tab in visual order, with a visible focus indicator on the focused element.
4. WHEN the focused element is an entry primary action AND the user presses Enter or Space, THE Web_App SHALL activate that primary action.
5. IF a connector or automation list fails to load within 5 s, THEN THE Web_App SHALL render a per-section error state with a keyboard-reachable retry control, AND keep the other section interactive.
6. IF a section has zero entries, THEN THE Web_App SHALL render the matching Empty_State per Requirement 23 inside that section.

### Requirement 22: Web App — Iframe Preview Chrome

**User Story:** As a user, I want a polished preview chrome with zoom, device frame, render-mode toggle, comment side panel, and tweaks panel, so that I can review agent-generated artifacts in context.

#### Acceptance Criteria

1. WHEN the Web_App renders an artifact, THE Iframe_Preview SHALL display, in a single control bar, independently operable affordances for zoom, device frame, render-mode toggle, comment side panel, and tweaks panel.
2. THE Iframe_Preview SHALL support zoom levels from the set {50%, 75%, 100%, 125%, 150%, 200%} with a default of 100%, AND device frame presets {desktop 1280×800, tablet 768×1024, mobile 375×667} with a default of desktop.
3. THE Iframe_Preview SHALL preserve the dual-iframe simultaneous-mount behavior described in `apps/web/src/components/file-viewer-render-mode.ts` such that toggling render mode SHALL NOT cause an iframe reload, an iframe network refetch, or any visible flash, AND SHALL swap CSS visibility only.
4. THE Iframe_Preview SHALL preserve the existing `isOurIframe(ev.source)` and `ev.source === iframeRef.current?.contentWindow` message-receive filters.
5. IF a `postMessage` event fails the `ev.source === iframeRef.current?.contentWindow` active-iframe check, THEN THE Iframe_Preview SHALL discard the event AND preserve current state.
6. WHEN the user changes zoom, device frame, or render mode, THE Iframe_Preview SHALL apply the change within 200 ms without re-mounting either iframe, while keeping `iframeRef.current` aligned to the active iframe via the existing `useEffect`.
7. WHEN the user toggles the comment side panel or the tweaks panel, THE Iframe_Preview SHALL show or hide that panel within 200 ms without re-mounting either iframe.

### Requirement 23: Web App — Empty States

**User Story:** As a user encountering a list with nothing in it, I want a helpful empty state, so that I understand what to do next.

#### Acceptance Criteria

1. WHEN a list-based view (Projects, Skills, Design Systems, Plugins, or Memory) finishes loading and contains zero items, THE Web_App SHALL render the Empty_State that matches that view within 200 ms of load completion.
2. THE Web_App SHALL render every Empty_State using the Component_Library `EmptyState` primitive, without wrapping it in alternative container components.
3. THE Web_App SHALL include in each Empty_State a title (maximum 60 characters), a descriptive message (maximum 200 characters) explaining the view's purpose, AND at least one primary action that initiates creation of the first item for that view.
4. WHEN the underlying data source for a list-based view fails to load, THE Web_App SHALL render an error state distinct from the Empty_State, indicating load failure and offering a retry control, AND SHALL NOT render the Empty_State in place of the error.
5. WHEN the user adds the first item to a list-based view, THE Web_App SHALL replace the Empty_State with the populated list within 200 ms of the item becoming available.

### Requirement 24: Web App — Error States

**User Story:** As a user encountering an environment problem, I want a clear error state with the next action, so that I can recover instead of guessing.

#### Acceptance Criteria

1. IF the Web_App receives no successful response from the daemon health endpoint within 5 seconds OR receives a connection-refused result, THEN THE Web_App SHALL render the daemon-down Error_State containing a title, a description of the connectivity failure, AND a retry control that re-issues the health check on activation.
2. IF a required API key for the active operation is absent or empty in stored configuration, THEN THE Web_App SHALL render the API-key-missing Error_State containing the name of the missing key AND a control that opens Settings_Dialog focused on the corresponding key field.
3. IF the configured agent CLI cannot be resolved on the system PATH at the time of invocation, THEN THE Web_App SHALL render the agent-CLI-not-found Error_State containing the configured CLI name, a statement that it was not found on PATH, AND a control that opens Settings_Dialog at the agent CLI configuration field.
4. IF artifact generation terminates with a non-success status, THEN THE Web_App SHALL render the build-failed Error_State containing the failure message returned by the build process truncated to a maximum of 2000 characters AND a re-run control that resubmits the same build request with the original parameters.
5. WHEN the user activates the retry or re-run control in any Error_State, THE Web_App SHALL dismiss the current Error_State AND reflect the outcome of the new attempt by rendering either the success view or the corresponding Error_State for the new failure.

### Requirement 25: Landing Page — Hero

**User Story:** As a first-time visitor, I want a calm, founder-grade hero, so that I understand what Galyarder_Design is in seconds.

#### Acceptance Criteria

1. WHEN a visitor loads the Landing_Page, THE Landing_Page hero SHALL render a single-sentence positioning statement of 40 to 140 characters, exactly one demo asset (one static image OR one video, mutually exclusive), AND exactly two primary calls to action labeled "Download Desktop" and "Browse Skills".
2. THE Landing_Page hero SHALL produce Largest Contentful Paint within 2500 ms on a reference network with 10 Mbps downlink and 50 ms round-trip time.
3. THE Landing_Page hero SHALL NOT include any element, text, image, link, or class name attributable to the previous "Atelier Zero" layout, branding, or copy.
4. THE Landing_Page hero SHALL NOT include emoji, exclamation marks, OR any of the marketing-superlative words "best", "amazing", "revolutionary", "world-class", "cutting-edge", "game-changing", or "unparalleled".
5. WHEN a visitor activates either CTA, THE Landing_Page SHALL navigate to the corresponding destination within 2 s under nominal network conditions.
6. IF the demo asset fails to load, THEN THE Landing_Page SHALL render a placeholder preserving the hero layout AND keep both CTAs operable.

### Requirement 26: Landing Page — Capabilities Section

**User Story:** As a visitor, I want to see what the product can do with one example each, so that I can evaluate fit quickly.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a capabilities section as a structured grid of between 3 and 8 cells, where each cell includes a short label of 1 to 40 characters AND exactly one concrete example of 1 to 140 characters.
2. WHEN a visitor activates the capabilities anchor link OR scrolls past the hero, THE Landing_Page SHALL bring the capabilities section heading into the viewport within 500 ms.
3. IF the capabilities content fails to load OR returns zero cells, THEN THE Landing_Page SHALL render a fallback message preserving the section's anchor target so anchor navigation continues to work.
4. WHEN the viewport width is at or below 768 px, THE Landing_Page SHALL render the capabilities grid as a single column.

### Requirement 27: Landing Page — Index Pages for Plugins, Skills, and Design Systems

**User Story:** As a visitor, I want to browse plugins, skills, and design systems before installing the product, so that I can preview value.

#### Acceptance Criteria

1. WHEN a visitor requests the plugins index page, THE Landing_Page SHALL render a list of published plugins where each entry shows the plugin name, a description of at most 200 characters, AND a preview thumbnail image, within 3 s under normal network conditions.
2. WHEN a visitor requests the skills index page, THE Landing_Page SHALL render a list of published skills where each entry shows the skill name, a description of at most 200 characters, AND a preview thumbnail image, within 3 s under normal network conditions.
3. WHEN a visitor requests the design-systems index page, THE Landing_Page SHALL render a list of published design systems where each entry shows the design-system name, a description of at most 200 characters, AND a preview thumbnail image, within 3 s under normal network conditions.
4. WHEN a visitor activates a plugin, skill, or design-system index entry, THE Landing_Page SHALL render its detail page served from the public web AND SHALL NOT invoke or require the desktop app.
5. IF an index page has zero published entries, THEN THE Landing_Page SHALL render an empty-state message indicating no entries are available AND keep the page's navigation interactive.
6. IF a detail page slug does not resolve to a published entry, THEN THE Landing_Page SHALL render a not-found state with a link back to the corresponding index page.

### Requirement 28: Landing Page — Tutorials and Blog

**User Story:** As a visitor, I want a readable tutorials and blog list with a generous reading column, so that I can learn the product.

#### Acceptance Criteria

1. WHEN a visitor requests the tutorials-and-blog list page, THE Landing_Page SHALL render the list within 2 s, where each entry shows a title (maximum 80 characters), a publish date, AND a summary (maximum 200 characters).
2. WHEN a visitor opens a tutorial or blog post, THE Landing_Page SHALL render the post in a reading column whose measure stays between 60 and 75 characters per line at the body type token across viewport widths from 320 px to 1920 px.
3. WHEN a tutorial or blog post contains more than five top-level sections, THE Landing_Page SHALL render an in-page table of contents with anchor links that scroll to the corresponding heading on activation.
4. IF the tutorials-and-blog list has zero published entries, THEN THE Landing_Page SHALL render an empty-state message indicating no entries are available.
5. IF a post slug does not resolve to a published entry, THEN THE Landing_Page SHALL render a not-found state with a link back to the list page.

### Requirement 29: Landing Page — Footer

**User Story:** As a visitor, I want a minimal footer with the essentials, so that I can find the repo, license, contact, and locale switcher without noise.

#### Acceptance Criteria

1. WHEN the Landing_Page is rendered, THE Landing_Page footer SHALL display exactly five elements: a brand mark, a repository link, a license indicator, a contact link, AND a locale switcher control.
2. THE Landing_Page footer SHALL NOT include marketing content unrelated to the five required elements, including promotional banners, newsletter signup forms, social media feeds, advertisements, or testimonials.
3. WHEN a visitor activates the repository link, the license indicator, or the contact link, THE Landing_Page SHALL navigate to the corresponding destination within 2 s under nominal network conditions.
4. IF any of the five required footer elements fails to load or resolve, THEN THE Landing_Page SHALL render a visible fallback indicator for that element AND keep the remaining elements operable.

### Requirement 30: Landing Page — Header

**User Story:** As a visitor scrolling the landing page, I want the header to behave predictably, so that navigation stays available without dominating the hero.

#### Acceptance Criteria

1. WHILE the hero is in the viewport, THE Landing_Page header SHALL render fixed at the top of the viewport with a transparent background (alpha 0).
2. WHEN the visitor scrolls such that the hero leaves the viewport, THE Landing_Page header SHALL transition within 200 ms to a solid background (alpha 1) using the Design_System surface token AND remain fixed at the top of the viewport.
3. WHEN the visitor scrolls back such that the hero returns into the viewport, THE Landing_Page header SHALL transition within 200 ms back to a transparent background (alpha 0).
4. WHEN the viewport width is at or below the mobile breakpoint defined in the Design_System, THE Landing_Page header SHALL render a hamburger menu disclosure for navigation links, with the disclosure expanded-state indicator initially set to collapsed.
5. IF the user activates the hamburger disclosure while collapsed, THEN THE Landing_Page header SHALL expand the navigation panel AND set the expanded-state indicator to expanded.
6. IF the user activates the hamburger disclosure while expanded, OR activates a navigation link inside the expanded panel, THEN THE Landing_Page header SHALL collapse the navigation panel AND set the expanded-state indicator to collapsed.

### Requirement 31: Desktop Chrome — Title Bar

**User Story:** As a desktop user, I want a title bar that respects each platform's conventions, so that the app feels native.

#### Acceptance Criteria

1. WHEN Desktop_Chrome runs on macOS, THE Desktop_Chrome SHALL render a frameless window with a vibrancy-blurred title bar background, traffic-light controls in the leading corner, AND the title text "Galyarder Design" centered horizontally in the title bar.
2. WHEN Desktop_Chrome runs on Windows, THE Desktop_Chrome SHALL render a title bar that includes minimize, maximize, AND close controls in the trailing corner, AND the title text "Galyarder Design" leading-aligned in the title bar.
3. WHEN Desktop_Chrome runs on Linux, THE Desktop_Chrome SHALL render a title bar appropriate to the active desktop environment's window-manager conventions, AND the title text "Galyarder Design" leading-aligned in the title bar.
4. WHILE the Desktop_Chrome window is unfocused, THE title bar SHALL render in a visibly de-emphasized style that maintains at least a 3:1 contrast ratio for the title text.
5. IF the host operating system cannot be identified as macOS, Windows, or Linux, THEN THE Desktop_Chrome SHALL fall back to the Linux-style title bar AND display the title text "Galyarder Design".
6. THE Desktop_Chrome SHALL NOT change Electron main-process logic except where presentation requires it.

### Requirement 32: Desktop Chrome — Updater Popup

**User Story:** As a desktop user, I want a clean release-notes popup, so that I can scan what changed and act.

#### Acceptance Criteria

1. WHEN the desktop updater surfaces a new release, THE Desktop_Chrome SHALL render Updater_Popup within 500 ms displaying the version identifier, the release date, AND the release notes content.
2. THE Updater_Popup SHALL render headings, paragraphs, AND list structures in the release notes with visibly distinct typographic styles drawn from the Token_Layer typography tokens.
3. THE Updater_Popup SHALL be implemented in `apps/desktop/src/UpdaterPopup.tsx` (or the existing equivalent file), AND SHALL preserve the same public prop names, types, and required/optional status as the pre-redesign component.
4. WHEN the user activates the Updater_Popup dismiss control or presses Escape, THE Desktop_Chrome SHALL close Updater_Popup AND return focus to the element that opened it.
5. IF release notes are empty or fail to parse, THEN THE Updater_Popup SHALL display a fallback message indicating release notes are unavailable AND still display the version identifier and dismiss control.

### Requirement 33: Desktop Chrome — Window Sizing

**User Story:** As a desktop user resizing the window, I want a sensible minimum size and graceful narrow-width behavior, so that the UI does not collapse into unreadable layouts.

#### Acceptance Criteria

1. THE Desktop_Chrome SHALL set a minimum window size of 1024 × 720 CSS pixels, sufficient to render Home_View at the comfortable density without horizontal overflow or horizontal scrollbars.
2. WHILE the desktop window width is above the narrow breakpoint defined in the Design_System, THE Web_App rendered inside Desktop_Chrome SHALL display the secondary navigation rail in expanded form.
3. WHEN the desktop window width is at or below the narrow breakpoint defined in the Design_System, THE Web_App rendered inside Desktop_Chrome SHALL collapse the secondary navigation rail AND render primary content with no horizontal clipping or horizontal scrollbars.
4. IF the user attempts to resize the desktop window below the minimum width or height, THEN THE Desktop_Chrome SHALL prevent the resize and retain the last valid dimensions.

### Requirement 34: Functional Non-Regression

**User Story:** As an existing user, I want every shipping feature to keep working after the redesign, so that the visual rewrite is not a regression.

#### Acceptance Criteria

1. WHEN the user creates a project in the redesigned Web_App against the existing daemon HTTP API, THE Web_App SHALL display the created project in the project list within 5 s.
2. WHEN the user sends a prompt in the redesigned Web_App, THE Web_App SHALL render incoming response chunks as they stream from the daemon AND display the final response within the run's observed completion time.
3. WHEN the user requests artifact rendering, THE Web_App SHALL render the artifact in Iframe_Preview within 5 s of the daemon completing the build.
4. WHEN the user activates the hand-off action on an artifact, THE Web_App SHALL save the artifact to disk via the existing daemon path AND display a confirmation indicating the on-disk save location within 5 s.
5. WHEN the user selects a different skill, THE Web_App SHALL reflect the newly selected skill as active in the UI within 2 s.
6. WHEN the user selects a different design system, THE Web_App SHALL reflect the newly selected design system as active in the UI within 2 s.
7. WHEN the user installs a plugin, THE Web_App SHALL reflect the plugin as installed in the UI within 10 s.
8. WHEN the user runs an automation, THE Web_App SHALL reflect run progress as the daemon emits progress events AND display the final run status within the daemon's reported completion time.
9. IF any of the flows in criteria 1 through 8 fails, THEN THE Web_App SHALL render an error indicator inline with that flow AND preserve any user input that drove the failed flow.

### Requirement 35: Daemon and Contract Boundary

**User Story:** As a maintainer, I want the redesign to stay on the web/landing/desktop side of the contract, so that the daemon and shared contract layers stay stable.

#### Acceptance Criteria

1. THE redesign SHALL produce zero net changes to file paths, HTTP methods, request shapes, response shapes, or status semantics declared in `apps/daemon/src/*-routes.ts`.
2. THE redesign SHALL produce zero net changes to field names, field types, enum values, optionality, or default values for shapes exported from `packages/contracts`.
3. WHEN the redesigned Web_App, Landing_Page, or Desktop_Chrome renders a daemon payload with different layout, styling, grouping, or composition, THE consuming surface SHALL derive the presentation solely from existing response fields, AND SHALL NOT add new request parameters or expect new response fields.
4. IF the redesign discovers that a redesigned surface requires a new daemon route or a new contract field, THEN the redesign SHALL stop on that surface AND flag the gap as a separate change rather than modifying `apps/daemon/src/*-routes.ts` or `packages/contracts` inside the redesign.

### Requirement 36: i18n Key Discipline

**User Story:** As a maintainer of 17 locales, I want i18n keys to flow through the typed dictionary, so that no locale silently regresses.

#### Acceptance Criteria

1. THE redesign SHALL NOT modify existing translated string values in `apps/web/src/i18n/locales/*`, `apps/landing-page/app/_lib/i18n.ts`, or `apps/landing-page/app/_lib/home-copy.ts` except to add, rename, or remove keys.
2. WHEN the redesign adds a new key to `apps/web/src/i18n/types.ts`, THE redesign SHALL define a non-empty string value for that key in each of the 17 locale files (`ar`, `de`, `en`, `es-ES`, `fa`, `fr`, `hu`, `id`, `it`, `ja`, `ko`, `pl`, `pt-BR`, `ru`, `th`, `tr`, `uk`) within the same change set, with no locale entry left undefined, null, or empty.
3. WHEN the redesign adds a new key to `apps/landing-page/app/_lib/i18n.ts` or `apps/landing-page/app/_lib/home-copy.ts`, THE redesign SHALL define a non-empty string value for that key in every locale already declared in the affected file within the same change set.
4. IF the redesign renames or removes a key in any of the listed i18n files, THEN THE redesign SHALL apply the identical rename or removal to every corresponding locale entry in the same change set such that no orphaned key remains in any locale file.

### Requirement 37: Dependency Discipline

**User Story:** As a maintainer, I want new top-level dependencies to be justified, so that the surface stays lean.

#### Acceptance Criteria

1. IF the redesign adds a top-level dependency to the repository root `package.json`, THEN the same change set SHALL append an entry to Deps_Note at `.tmp/redesign/deps.md` containing the dependency name, the pinned version, the rationale, AND a list of considered alternatives.
2. THE redesign SHALL add zero new top-level styling-only dependencies, defaulting to dependency-free CSS for styling decisions.
3. WHEN a new UI library is required, THE redesign SHALL select from {Radix Primitives, Vaul, Sonner} AND record the selection in Deps_Note.
4. IF the redesign adds Material UI, Chakra UI, or Mantine to any package, THEN `pnpm guard` SHALL fail with an error identifying the offending package and dependency.
5. IF the redesign adds a CSS-in-JS runtime such as styled-components, Emotion, or stitches, THEN `pnpm guard` SHALL fail with an error identifying the offending package and dependency.

### Requirement 38: Audit and Plan Artifact

**User Story:** As a maintainer reviewing the redesign, I want one plan document, so that the per-screen redesign sequence and inventory are auditable.

#### Acceptance Criteria

1. THE redesign SHALL produce Plan_Artifact at `.tmp/redesign/plan.md` before any redesigned screen source change is committed.
2. THE Plan_Artifact SHALL list every screen in scope, the current backing component file, the redesigned information architecture, the Token_Layer in use, the Component_Library inventory, AND the per-app delivery order.
3. WHEN a feature is proposed for removal during the redesign, THE redesign SHALL record the proposal under `.tmp/redesign/` with the feature name and rationale.
4. WHILE a removal proposal remains unaccepted, THE redesign SHALL keep that feature shipping in Web_App, Landing_Page, or Desktop_Chrome (as applicable) by preserving its entry points, props, and routes.

### Requirement 39: Per-Phase Validation Gate

**User Story:** As a maintainer, I want each phase to pass a known validation gate, so that regressions are caught at phase boundaries.

#### Acceptance Criteria

1. WHEN a redesign phase ends, THE redesign SHALL run `pnpm guard` AND `pnpm typecheck` at the repository root, AND each command SHALL exit with status code 0.
2. WHEN a redesign phase that modifies any file under `apps/web` ends, THE redesign SHALL run `pnpm --filter @galyarder-design/web test` AND the command SHALL exit with status code 0.
3. WHEN a redesign phase that modifies any file under `apps/landing-page` ends, THE redesign SHALL run `pnpm --filter @galyarder-design/landing-page build` AND the command SHALL exit with status code 0.
4. WHEN the redesign ends, THE redesign SHALL run the full repo-wide audit consisting of `pnpm guard`, `pnpm typecheck`, `pnpm --filter @galyarder-design/web build`, `pnpm --filter @galyarder-design/landing-page build`, `pnpm --filter @galyarder-design/desktop build`, `pnpm --filter @galyarder-design/daemon test`, AND the e2e test suite, AND each command SHALL exit with status code 0.
5. IF any per-phase validation command exits with non-zero status, THEN the phase SHALL be considered blocked AND no subsequent phase SHALL begin until the failure is resolved.
6. IF any final-audit command exits with non-zero status, THEN the redesign SHALL be considered incomplete AND the failure SHALL be addressed before declaring the redesign delivered.

### Requirement 40: Brand Tone in Product Chrome

**User Story:** As a product owner, I want every redesigned surface to hold the Galyarder_Design tone, so that copy reads as one product.

#### Acceptance Criteria

1. THE redesigned Web_App, Landing_Page, AND Desktop_Chrome SHALL render display headlines of at most 8 words AND body sentences of at most 20 words, written in declarative subject-verb-object form.
2. THE redesigned Web_App, Landing_Page, AND Desktop_Chrome SHALL NOT render emoji in any text surface, including buttons, headings, body, tooltips, notifications, empty states, and error states.
3. THE redesigned Web_App, Landing_Page, AND Desktop_Chrome SHALL NOT render exclamation marks in product chrome text, except where the exclamation appears inside a quotation block of user-authored content.
4. THE redesigned Web_App, Landing_Page, AND Desktop_Chrome SHALL NOT render the marketing-superlative words "best", "amazing", "revolutionary", "world-class", "cutting-edge", "game-changing", or "unparalleled" unless an on-surface citation or evidence reference accompanies the claim.

### Requirement 41: Stale Brand Removal

**User Story:** As a maintainer, I want every "Open Design" remnant scrubbed from redesigned surfaces, so that the rebrand is complete.

#### Acceptance Criteria

1. WHEN the redesigned Web_App boots at `http://127.0.0.1:17573/`, THE Web_App SHALL render Home_View with zero case-insensitive matches of the literal strings "Open Design", "open-design", or "Atelier Zero" in any product chrome surface (header, nav, sidebar, footer, page title, visible body text).
2. WHEN the redesigned Landing_Page renders any page, THE Landing_Page SHALL contain zero case-insensitive matches of "Open Design", "open-design", or "Atelier Zero" in any product chrome surface (header, nav, hero, footer, page title, visible body text).
3. WHEN the redesigned Desktop_Chrome renders the title bar, THE Desktop_Chrome SHALL display the exact string "Galyarder Design" AND contain zero case-insensitive matches of "Open Design" or "open-design" in the title bar.
4. WHEN the redesigned Web_App, Landing_Page, or Desktop_Chrome renders product chrome text, THE rendered text SHALL contain only Unicode Basic Latin (U+0000–U+007F) and Latin-1 Supplement (U+0080–U+00FF) characters in product chrome surfaces, with zero non-Latin characters (CJK, Cyrillic, Arabic, or other) in those surfaces.
5. IF any redesigned surface render contains a string remnant or non-Latin character forbidden by criteria 1 through 4, THEN the rebrand SHALL be considered incomplete AND the offending occurrence SHALL be removed before the redesign is declared delivered.
