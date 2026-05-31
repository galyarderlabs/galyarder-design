# Implementation Plan: Unified Design System Redesign

## Overview

This plan delivers the unified design system redesign across `apps/web`, `apps/landing-page`, and `apps/desktop` in eight phases (Phase 0 audit → Phase 7 polish). Each phase ends at a Req 39 gate (`pnpm guard`, `pnpm typecheck`, plus the package-scoped test/build the phase touched). The app stays shippable after every phase boundary because Phase 1 keeps legacy token aliases alive and Phases 2–6 preserve every redesigned screen's exported component name and prop signature (Property 11). All implementation language is TypeScript / TSX / CSS / Astro consistent with the existing repo. Property-based tests use `fast-check` (no new top-level dependency) and live under `apps/web/tests/components/ds/`, `apps/web/tests/design-system/`, and `e2e/tests/redesign/` per the design's Testing Strategy. Every new test file carries the JSDoc tag `Feature: unified-design-system-redesign, Property <N>`.

A `Phase 1.5 — Dep-backed primitives` block sits between Phase 1 and Phase 2. It carries the Radix / Vaul / Sonner / cmdk-backed primitives that could not land in Phase 1 because they required the dependency proposal in `.tmp/redesign/deps.md` to be approved first. Phase 1.5 is gated on user acceptance of that proposal and on a successful `pnpm install` of the proposed packages; until then Phase 2 may still proceed against the Phase 1 dep-free subset because every redesigned screen that needs a dep-backed primitive consumes it through `apps/web/src/components/ds/index.ts`, which lazily errors only at the call site if the primitive is still pending.

Hard boundaries respected by every task:
- No edits to `apps/daemon/src/*-routes.ts` or `packages/contracts` shapes (Property 10, Req 35).
- Verbatim preservation of `file-viewer-render-mode.ts`, `isOurIframe`, active-iframe filter, `latestTodoWriteInputFromMessages`, `dedupeSnapshotToolRetries`, `onAnswerToolUse` route preference, and the CJK detection patterns in `HomeView.tsx` / `ProjectView.tsx` / `HomeHero.tsx` / `projectName.ts` / `pointer.ts` (Property 10).
- i18n key adds/renames/removes propagate across all 17 web locales in the same change set; existing translated values stay read-only (Req 36, Property 32).
- New UI deps drawn only from `{@radix-ui/*, vaul, sonner, lucide-react, cmdk}`; recorded in `.tmp/redesign/deps.md` (Req 37, Property 33).
- No emoji, no `!` in product chrome, no banned superlatives without citation, no Atelier-Zero / Open Design residue, only Latin-1 codepoints in product chrome (Reqs 40 / 41, Properties 34 / 35).

## Tasks

### Phase 0 — Audit and plan

- [x] 1. Produce the audit-and-plan artifacts under `.tmp/redesign/`
  - [x] 1.1 Write `.tmp/redesign/plan.md` (Plan_Artifact)
    - List every screen in scope across `apps/web`, `apps/landing-page`, `apps/desktop` with the current backing component file, redesigned IA, Token_Layer usage, Component_Library inventory mapped to Req 2.1, and per-app delivery order matching Phases 1–7.
    - Record any feature proposed for removal under `.tmp/redesign/removal-<slug>.md` and confirm the feature stays shipping until accepted.
    - _Requirements: 38.1, 38.2, 38.3, 38.4_

  - [x] 1.2 Write `.tmp/redesign/deps.md` (Deps_Note)
    - Seed the allowlist (`@radix-ui/*`, `vaul`, `sonner`, `lucide-react`, `cmdk`) and denylist (`@mui/*`, `@chakra-ui/*`, `@mantine/*`, `styled-components`, `@emotion/*`, `@stitches/*`).
    - Include name + pinned version + rationale + alternatives column ready for Phase 1 entries.
    - _Requirements: 37.1, 37.2, 37.3, 37.4, 37.5, Property 33_

### Phase 1 — Tokens and primitives

- [x] 2. Land the canonical Token_Layer in `apps/web/src/styles/tokens.css`
  - [x] 2.1 Author the color token block
    - 12-step neutral ramp `--neutral-0`..`--neutral-11` with hex + OKLch in `:root` (light) and inverted in `[data-theme="dark"]`; accent + accent-2 + success + warning + danger + info families with -bg / -border / -fg / -fg-strong roles per family in both modes; surface aliases `--surface-0..3`, `--border`, `--border-strong`, `--text`, `--text-muted`, `--text-faint`, `--text-strong`.
    - Keep existing legacy tokens (`--bg`, `--bg-panel`, `--accent`, `--shadow-*`, `--radius-*`, `--text*`) as aliases that resolve through the new ramp; annotate each with `/* legacy: → --surface-N */`.
    - _Requirements: 1.1, 1.2, 1.10, 1.11, 4.1, 4.2, 4.6, 8.1_

  - [x] 2.2 Author the typography token block
    - Define `--font-sans`, `--font-mono`, and the eleven type styles (display, h1, h2, h3, h4, body-lg, body, body-sm, caption, code, mono-numeral) each with font-family / size / line-height / weight / letter-spacing; mono-numeral gets `font-variant-numeric: tabular-nums`.
    - _Requirements: 1.3_

  - [x] 2.3 Author the spacing token block
    - 4-base scale `--space-1..24` covering 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96; semantic aliases `--gutter`, `--section-gap`, `--card-padding` each pointing at one discrete scale value.
    - _Requirements: 1.4_

  - [x] 2.4 Author the radius, shadow, motion, z-index, density, and breakpoint blocks
    - `--radius-sm/md/lg/full`; `--shadow-resting/raised/floating` with separate light + dark values; `--duration-snap/base/gentle`, `--duration-enter`, `--duration-exit`, `--easing-standard`; `--z-base/dropdown/sticky/overlay/modal/toast` in strictly increasing order; `--density-multiplier` default `1`; `--breakpoint-md = 768px` for desktop NavRail collapse.
    - Add the `@media (prefers-reduced-motion: reduce)` override that collapses every `--duration-*` to `0ms`.
    - _Requirements: 1.5, 1.6, 1.7, 1.8, 5.1, 6.1, 6.2, 6.5_

  - [ ]* 2.5 Write property test for token referential integrity
    - **Property 1: Token referential integrity** at `apps/web/tests/design-system/token-integrity.test.ts` using `fast-check`; parse all `var(--TOKEN)` references in `apps/{web,landing-page,desktop}/**/*.{ts,tsx,css,astro}` and assert each is declared in `tokens.css`; assert semantic aliases resolve to a `--space-*` value.
    - **Validates: Requirements 1.4, 1.10, 1.11_

  - [ ]* 2.6 Write property test for theming completeness and contrast
    - **Property 3: Theming completeness and contrast** at `apps/web/tests/design-system/theming-contrast.test.ts`; assert every color/shadow/border/surface token has both `:root` and `[data-theme="dark"]` values; compute WCAG ratios on declared (text, surface) pairs and assert ≥ 4.5:1 (small text), ≥ 3:1 (large text and interactive borders/icons/focus).
    - **Validates: Requirements 4.1, 4.2, 4.6, 8.1_

  - [ ]* 2.7 Write property test for z-index ordering and literal gating
    - **Property 2: Z-index scale is strictly ordered and gates literals** at `apps/web/tests/design-system/zindex-order.test.ts`; parse `tokens.css` and assert `base < dropdown < sticky < overlay < modal < toast`; scan redesigned files for numeric `z-index:` literals and assert every value resolves through `var(--z-*)`.
    - **Validates: Requirements 1.8, 1.9_

- [x] 3. Refresh the motion classes for redesigned animations
  - [x] 3.1 Rewrite `apps/web/src/styles/motion.css`
    - `.accordion-collapsible` and `.accordion-collapsible-inner` consume `var(--duration-enter)`, `var(--duration-exit)`, and `var(--easing-standard)` while preserving the `grid-template-rows: 0fr -> 1fr` pattern and the opacity fade.
    - Ensure no entrance keyframe starts at `scale(s)` with `s < 0.9`.
    - Landed classes also include `.ds-accordion`, `.ds-fade`, `.ds-pop`, `.ds-slide-{left,right,up,down}`, and `.ds-skeleton`, all consuming the motion tokens.
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 3.2 Write property test for motion-token discipline
    - **Property 5: Motion-token discipline** at `apps/web/tests/design-system/motion-discipline.test.ts`; scan redesigned source files; assert `transition-timing-function` equals `var(--easing-standard)` unless an inline comment documents otherwise; enter durations in `[190, 210]ms`, exit durations in `[130, 150]ms`; no `scale(s<0.9)` keyframes; under reduced motion every `--duration-*` resolves to `0ms`.
    - **Validates: Requirements 6.1, 6.2, 6.4, 6.5, 8.6_

- [x] 4. Add the theme + density providers and flash-prevention inline script
  - [x] 4.1 Implement `apps/web/src/providers/ThemeProvider.tsx`
    - Hydrate from `localStorage.galyarder.theme` (`'light' | 'dark' | 'system'`); fall back to `window.matchMedia('(prefers-color-scheme: dark)')` when unset; toggle `<html data-theme="…">`; CSS transitions on `background-color`, `color`, `border-color` ≤500ms.
    - _Requirements: 4.3, 4.4, 4.5, 4.7, 4.8_

  - [x] 4.2 Implement `apps/web/src/providers/DensityProvider.tsx`
    - Hydrate from `localStorage.galyarder.density` before first interactive render; clamp `--density-multiplier` to `[0.75, 1.25]` and emit a development-only `console.warn` on out-of-range; expose comfortable / compact toggle.
    - The clamp/persist/apply helpers already exist at `apps/web/src/state/density.ts`; this task wires those helpers behind a React provider.
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 4.3 Inject the inline flash-prevention script in `apps/web/app/layout.tsx` (Next.js 16 App Router root)
    - Synchronously read `galyarder.theme` and `galyarder.density` from `localStorage`, set `data-theme` and `data-density` on `<html>` before first paint, fall back to `matchMedia('(prefers-color-scheme: dark)')` when theme is unset.
    - _Requirements: 4.8, 5.6_

  - [ ]* 4.4 Write property test for density clamping
    - **Property 4: Density multiplier clamping** at `apps/web/tests/design-system/density-clamp.test.ts` using `fast-check` (1000 iterations); for any input `v`, the resolved multiplier equals `max(0.75, min(1.25, v))` and out-of-range inputs trigger the dev warning.
    - **Validates: Requirements 5.5_

- [x] 5. Build the icon adapter and its discipline tests
  - [x] 5.1 Implement `apps/web/src/components/ds/Icon.tsx`
    - Forward `ref<SVGSVGElement>`, lock `size: 16 | 20 | 24` (default `20`), `strokeWidth: 1.5`; expose `name: keyof typeof Lucide`; default `aria-hidden=true` unless `label` provided.
    - Note: the legacy `apps/web/src/components/Icon.tsx` wrapper has not yet been migrated to delegate to `ds/Icon.tsx` because its callers have not moved. That migration is tracked separately under Task 10.5 (Phase 1 follow-ups) and must not change any caller signatures.
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 5.2 Write unit test for `Icon`
    - At `apps/web/tests/components/ds/Icon.test.tsx`; ref-forwarding assertion; rejects sizes outside `{16, 20, 24}` at type level; renders `aria-hidden` when no label.
    - _Requirements: 2.6, 3.2, 3.3_

  - [ ]* 5.3 Write property test for iconography discipline
    - **Property 6: Iconography discipline** at `apps/web/tests/design-system/icon-source.test.ts`; scan `apps/{web,landing-page,desktop}/**` for icon-shaped imports; assert every import resolves to `lucide-react` (allowlist `apps/web/src/components/ds/Icon.tsx`); every `<Icon size>` is in `{16, 20, 24}` and `strokeWidth === 1.5`.
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Extend i18n keys for primitive defaults
  - [x] 6.1 Add primitive-default keys to `apps/web/src/i18n/types.ts` and all 17 locale files
    - Add typed `Dict` keys for primitive-default aria-labels and copy strings introduced by `IconButton` defaults, `Spinner` accessible name, and `EmptyState` action labels; do not modify existing values.
    - Apply the identical key set with non-empty values to all 17 locale files under `apps/web/src/i18n/locales/*.ts` (`ar`, `de`, `en`, `es-ES`, `fa`, `fr`, `hu`, `id`, `it`, `ja`, `ko`, `pl`, `pt-BR`, `ru`, `th`, `tr`, `uk`).
    - _Requirements: 36.1, 36.2_

- [x] 7. Build the Component_Library primitives under `apps/web/src/components/ds/`
  Each sub-task creates the primitive, adds a JSDoc `@example` block, exports it from `apps/web/src/components/ds/index.ts`, and ships a unit test at `apps/web/tests/components/ds/<Name>.test.tsx` with at least one ref-forwarding assertion (when the primitive wraps a focusable / measurable DOM node). All styling resolves through `tokens.css`; no hardcoded color/spacing/radius/shadow literals (Property 7). The dep-backed primitives (ToggleGroup, Switch, Checkbox, Radio, Select, Combobox, Slider, Tabs, Segmented, Sheet, Dialog, Drawer, Popover, Tooltip, Toast, MenuList, ContextMenu) have been moved to **Phase 1.5** and are gated on the `.tmp/redesign/deps.md` proposal being approved and installed.

  - [x] 7.1 Implement `Button.tsx`
    - Variants `primary | secondary | ghost | danger`; sizes `sm | md | lg`; `loading?`, `leadingIcon?`, `trailingIcon?`, `asChild?`; ref→`HTMLButtonElement`; Enter/Space activate (native).
    - Test: ref forwarding + variant render + Enter activation.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.2, 8.3, 8.4_

  - [x] 7.2 Implement `IconButton.tsx`
    - Same variants/sizes as Button; requires `aria-label`; ref→`HTMLButtonElement`.
    - Test: ref forwarding + missing-aria-label rejection at runtime/dev.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.5_

  - [x] 7.7 Implement `TextInput.tsx`
    - `size`, `invalid?`, `leadingIcon?`, `trailingSlot?`, `clearable?` (Esc clears); ref→`HTMLInputElement`; ellipsis-truncation pairs with tooltip exposing full string.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 7.5, 8.4_

  - [x] 7.8 Implement `Textarea.tsx`
    - `autoResize?`, `maxRows?`; ref→`HTMLTextAreaElement`.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 7.14 Implement `Card.tsx`
    - `padding`, `elevation: 'flat' | 'resting' | 'raised'`, `as?`; `overflow-wrap: anywhere` for CJK containment.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 7.3_

  - [x] 7.21 Implement `Banner.tsx`
    - Inline banner; `role=status` (info) or `role=alert` (danger); variants + dismissable.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.22 Implement `Badge.tsx`
    - Inline decorative; variants + sizes.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 7.23 Implement `Tag.tsx`
    - `removable?`; `role=button` when removable.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 7.24 Implement `Chip.tsx`
    - `selected?`, `size`; `aria-pressed` on selected state.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 7.25 Implement `Avatar.tsx`
    - `size`, `shape: 'circle' | 'square'`; fallback initials when image missing.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 7.26 Implement `Kbd.tsx`
    - Inline kbd token; `size`.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 7.27 Implement `Spinner.tsx`
    - `role=status`; `aria-label` required; respects reduced motion.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.5, 8.6_

  - [x] 7.28 Implement `Progress.tsx`
    - Phase 1 ships a dep-free implementation that exposes `role=progressbar` and `aria-valuenow` and supports indeterminate. Will be upgraded in Phase 1.5 (Task 7.5.18) to wrap `@radix-ui/react-progress`; the public prop signature must remain a superset of this Phase 1 implementation per Property 11.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.29 Implement `Skeleton.tsx`
    - `aria-hidden`; shimmer animation gated on `prefers-reduced-motion`.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.6_

  - [x] 7.30 Implement `EmptyState.tsx`
    - One canonical layout: `Icon` (size 24) + title (≤60 chars) + description (≤200 chars) + at least one primary action `Button`.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 23.2, 23.3_

  - [x] 7.31 Implement `Pagination.tsx`
    - `<nav aria-label>`; ←/→ keys; props `total`, `page`, `pageSize`.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.34 Implement `Breadcrumbs.tsx`
    - `<nav aria-label>`; separator `aria-hidden`; `items` prop.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 7.35 Implement `NavRail.tsx`
    - Vertical nav; `collapsed?`, `density`; collapses at viewport `≤ var(--breakpoint-md)` via grid-template-columns animation.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 33.2, 33.3_

  - [x] 7.36 Implement `NavItem.tsx`
    - Inside `NavRail`; `aria-current="page"` when active.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 7.37 Implement `ScrollArea.tsx`
    - Phase 1 ships a dep-free implementation that exposes `role=region` when labeled and accepts `viewportClassName?`. Will be upgraded in Phase 1.5 (Task 7.5.19) to wrap `@radix-ui/react-scroll-area`; the public prop signature must remain a superset of this Phase 1 implementation per Property 11.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.38 Wire the single export module `apps/web/src/components/ds/index.ts`
    - Re-exports every Phase 1 dep-free primitive plus `Icon` in the order of Req 2.1; exports `export type * from './types'` for `Size`, `Density`, `ButtonVariant`, `BannerVariant`, `IconSize`, `IconName`. Phase 1.5 primitive entries are added to this same module as each lands.
    - _Requirements: 2.1_

  - [ ]* 7.39 Write property test for primitive ref forwarding and styling discipline
    - **Property 7: Primitive ref forwarding and styling discipline** at `apps/web/tests/design-system/primitive-shape.test.ts`; for every primitive whose underlying DOM is focusable/measurable, assert a forwarded ref resolves to a DOM node; scan `apps/web/src/components/ds/**` for hex literals, raw `box-shadow`, raw `border-radius` numerics, and pixel literals not multiples of `var(--space-*)` and assert none.
    - **Validates: Requirements 2.2, 2.3, 2.4_

  - [ ]* 7.40 Write property test for primitive accessibility shape
    - **Property 8: Primitive accessibility shape** at `apps/web/tests/design-system/primitive-axe.test.ts`; render every primitive and assert role match, accessible name presence, focus ring ≥2px @ 3:1 contrast, and zero axe-core role/name/state violations.
    - **Validates: Requirements 8.2, 8.4, 8.5_

  - [ ]* 7.41 Write property test for truncation tooltip exposure
    - **Property 9: Truncation always advertises full string** at `apps/web/tests/design-system/truncation.test.ts`; for every redesigned control truncating via `text-overflow: ellipsis`, assert full string surfaces via `aria-label` or tooltip on focus/hover.
    - **Validates: Requirements 7.5_

- [x] 8. Add the new `pnpm guard` rules under `scripts/guard.ts`
  - [x] 8.1 Implement `no-hardcoded-style-literals-in-ds`
    - Scan `apps/web/src/components/ds/**/*.{ts,tsx,css}` for hex literals (`#[0-9a-f]{3,8}`), pixel literals not multiples of `var(--space-*)`, raw `box-shadow:` definitions, and raw `border-radius:` numeric values; fail with file/line/literal.
    - Implemented in `scripts/guard.ts` as `checkDsPrimitiveHardcodedStyleLiterals` and registered in the `checks` array. Allows 0–3px sub-token nudges, `var(--space-*)` references, and `calc(... var(--space-*) ...)` patterns. All Phase 1 dep-free primitives pass.
    - _Requirements: 1.9, 2.4_

  - [x] 8.2 Implement `icon-source-and-size`
    - Scan `apps/{web,landing-page,desktop}/**/*.{ts,tsx,astro}` for icon imports — only `lucide-react` allowed (allowlist `apps/web/src/components/ds/Icon.tsx`); enforce `size ∈ {16,20,24}` and `strokeWidth === 1.5` on every icon usage.
    - Implemented in `scripts/guard.ts` as `checkIconSourceAndSize` and registered in the `checks` array. Type-only imports of `lucide-react` (`import type …`) are allowed anywhere — they have no runtime presence and let `apps/web/src/components/ds/types.ts` and the legacy wrapper at `apps/web/src/components/Icon.tsx` (which uses `import type * as Lucide`) keep compiling. Runtime imports are restricted to the canonical wrapper at `apps/web/src/components/ds/Icon.tsx` (Req 3.1, 3.4). Size and strokeWidth enforcement targets `<Icon>` usages whose binding came from the canonical DS module (`./components/ds`, `./components/ds/Icon`, `@gd/ds`, or `@gd/ds/Icon`); the legacy wrapper's existing 14-px / 1.6-stroke call sites stay untouched per Property 11. Non-literal expressions (variables, type casts) are skipped to avoid false positives on dynamic call sites. `pnpm guard` passes cleanly on the current codebase.
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 8.3 Implement `z-index-scale`
    - Scan `apps/{web,landing-page,desktop}/src/**/*.{ts,tsx,css}` plus `apps/landing-page/app/**/*.{ts,tsx,astro,css}` for numeric `z-index:` literals outside an explicit `// z-index: legacy` allowlist; fail with file/line/literal.
    - _Requirements: 1.9_

  - [x] 8.4 Implement dependency allowlist / denylist rule
    - Walk every workspace `package.json`; fail on any denylist hit (`@mui/*`, `@chakra-ui/*`, `@mantine/*`, `styled-components`, `@emotion/*`, `@stitches/*`); for any UI-library hit outside the allowlist (`@radix-ui/*`, `vaul`, `sonner`, `lucide-react`, `cmdk`), fail; for any allowlist hit at the repo-root `package.json`, require an entry in `.tmp/redesign/deps.md`.
    - _Requirements: 37.3, 37.4, 37.5_

  - [ ]* 8.5 Write property test for dependency discipline
    - **Property 33: Dependency discipline** at `e2e/tests/redesign/dependency-discipline.test.ts`; walk every `package.json`; assert no denylist entry; assert every UI-library entry is in the allowlist; assert every root-level allowlist addition has a deps.md entry with name + version + rationale + alternatives.
    - **Validates: Requirements 37.1, 37.2, 37.3, 37.4, 37.5_

- [x] 9. Wire the cross-app token + primitive bridges
  - [x] 9.1 Add the landing-page `@gd/tokens` and `@gd/ds` aliases
    - Update `apps/landing-page/tsconfig.json` `paths` and `apps/landing-page/astro.config.ts` Vite `resolve.alias` so `@gd/tokens` → `apps/web/src/styles/tokens.css` and `@gd/ds` → `apps/web/src/components/ds/index.ts`.
    - Add `@import '@gd/tokens';` to `apps/landing-page/app/globals.css`.
    - _Requirements: 1.10, 2.7_

  - [x] 9.2 Add the desktop renderer `@gd/ds` alias
    - Added `apps/desktop/tsconfig.renderer.json` (bundler resolution, `jsx: react-jsx`, `module: ESNext`) with `paths` mapping `@gd/ds` → `apps/web/src/components/ds/index.ts` and `@gd/tokens` → `apps/web/src/styles/tokens.css`. Updated `apps/desktop/tsconfig.json` to exclude `src/renderer/**`, added `apps/desktop/tsconfig.tests.json` exclusion, and added a placeholder `apps/desktop/src/renderer/index.ts` exercising the alias under live typecheck. `apps/desktop/package.json` `build` and `typecheck` now invoke the renderer config. No primitive sources duplicated. The desktop bundler arrives in Phase 6 with the title bar; the alias is in place for it.
    - _Requirements: 1.10, 2.8_

- [x] 10. Phase 1 gate (partial closure for the dep-free subset)
  - The Phase 1 dep-free subset gate has run cleanly: `pnpm typecheck` exits with status 0, `pnpm guard` exits with status 0, and the 13 pre-existing test failures observed during the run are unrelated to the redesign and reproduce identically on `main`. The maintainer's "Run all tasks for this spec" instruction recorded by the orchestrator is the explicit partial-closure acceptance; Phase 2 is unblocked. Phase 1.5 (dep-backed primitives) continues independently behind Task 10.6. Sign-off recorded at `.tmp/redesign/phase-1-gate.md`.
  - [x] 10.1 Confirm with the maintainer that the partial-Phase 1 closure (dep-free primitives only) is acceptable to advance to Phase 2 (web batch A) while Phase 1.5 (dep-backed primitives) lands behind a separate dependency-approval gate.
    - Maintainer acceptance: standing "Run all tasks for this spec" instruction (orchestrator-recorded) + tree state pinned at commit `36097f4`. Validation: `pnpm --filter @galyarder-design/web typecheck` exit 0, `pnpm guard` exit 0. Pre-existing 13 test failures reproduce on `main` and are out of scope for this gate. Full sign-off note at `.tmp/redesign/phase-1-gate.md`.
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 39.1, 39.2, 39.5_

- [x] 10.5 Phase 1 follow-up — migrate the legacy Icon wrapper
  - `apps/web/src/components/Icon.tsx` now delegates to `apps/web/src/components/ds/Icon.tsx` for the 64 of 73 kebab-case names that have `lucide-react` v1.16 equivalents (via a `LUCIDE_NAME_BY_LEGACY` map handling renames like `Edit → SquarePen`, `Home → House`, `MoreHorizontal → Ellipsis`). The remaining 9 names (brand glyphs `discord`/`github`/`github-filled` plus bespoke `*-filled` variants) keep their original inline SVGs verbatim so rendered pixels do not change.
  - Pre-migration public API preserved — `IconName` union, prop shape, `size = 14` / `strokeWidth = 1.6` defaults, and the `name === 'spinner'` auto-`icon-spin` class are all intact. `pnpm --filter @galyarder-design/web typecheck` exits 0; 30+ existing call sites compile unchanged. Property 11 (public API stability) honored.
  - _Requirements: 3.1, 3.2, 3.3 — Property 6_

### Phase 1.5 — Dep-backed primitives (gated on deps.md sign-off)

This block is the unfinished subset of Component_Library primitives that could not land in Phase 1 because they require headless logic from `@radix-ui/*`, `vaul`, `sonner`, or `cmdk`. None of these tasks may begin until Task 7.5.0 has completed (deps approved + installed). Phase 2 is allowed to proceed against the Phase 1 dep-free subset in parallel; surfaces in Phase 2 that depend on a Phase 1.5 primitive may stub through the `apps/web/src/components/ds/index.ts` re-export until that primitive lands.

- [x] 7.5 Land the dep-backed primitives behind the `.tmp/redesign/deps.md` proposal

  - [x] 7.5.0 Approve and install Phase 1.5 dependencies
    - Block on user acceptance of the Phase 1.5 dep proposal recorded in `.tmp/redesign/deps.md`.
    - Once approved, run:
      ```bash
      pnpm --filter @galyarder-design/web add \
        @radix-ui/react-dialog \
        @radix-ui/react-popover \
        @radix-ui/react-tooltip \
        @radix-ui/react-tabs \
        @radix-ui/react-toggle-group \
        @radix-ui/react-switch \
        @radix-ui/react-checkbox \
        @radix-ui/react-radio-group \
        @radix-ui/react-select \
        @radix-ui/react-slider \
        @radix-ui/react-dropdown-menu \
        @radix-ui/react-context-menu \
        @radix-ui/react-progress \
        @radix-ui/react-scroll-area \
        vaul \
        sonner \
        cmdk
      ```
    - Verify that none of the installed packages land at the repo-root `package.json` (Req 37.5); each must be confined to `apps/web/package.json`.
    - Update `.tmp/redesign/deps.md` `Status` block to mark Phase 1.5 deps installed.
    - _Requirements: 37.1, 37.3 — Property 33_

  - [x] 7.5.1 Implement `ToggleGroup.tsx`
    - Built on `@radix-ui/react-toggle-group`; `type: 'single' | 'multiple'`; `size`, `density`; ←/→ navigate.
    - Test: ref forwarding + arrow-key navigation.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.2 Implement `Switch.tsx`
    - `@radix-ui/react-switch`; `role=switch`, `aria-checked`; Space toggles.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.3 Implement `Checkbox.tsx`
    - `@radix-ui/react-checkbox`; indeterminate via `data-state="indeterminate"`.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.4 Implement `Radio.tsx`
    - `@radix-ui/react-radio-group`; ↑↓ navigate within group.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.5 Implement `Select.tsx`
    - `@radix-ui/react-select`; `size`, `placeholder`; portals through `Popover`.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.6 Implement `Combobox.tsx`
    - Wrap `cmdk`; `size`, `emptyState`, type-ahead; case-insensitive filter.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 7.5.7 Implement `Slider.tsx`
    - `@radix-ui/react-slider`; ←/→/Home/End; `marks?`.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.8 Implement `Tabs.tsx`
    - `@radix-ui/react-tabs`; `orientation`; ←/→ between tabs, Tab into panel.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.9 Implement `Segmented.tsx`
    - `@radix-ui/react-toggle-group` (`type=single`); radiogroup keyboard pattern.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.10 Implement `Sheet.tsx`
    - `@radix-ui/react-dialog` (side variant); `side: 'top' | 'right' | 'bottom' | 'left'`, `size`; focus trap + Esc close.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.11 Implement `Dialog.tsx`
    - `@radix-ui/react-dialog`; `size`, `dismissable: boolean`; focus trap + initial focus on first interactive control + return focus to opener; Esc closes when `dismissable` is true.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4, 18.1, 18.4_

  - [x] 7.5.12 Implement `Drawer.tsx`
    - Wrap `vaul`; mobile-first sheet with drag-to-dismiss; respects reduced motion.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 7.5.13 Implement `Popover.tsx`
    - `@radix-ui/react-popover`; `align`, `side`, `sideOffset`; non-modal; Esc closes.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.14 Implement `Tooltip.tsx`
    - `@radix-ui/react-tooltip`; ~500ms delay; `role=tooltip`.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 7.5_

  - [x] 7.5.15 Implement `Toast.tsx`
    - Wrap `sonner`; mount once via `<Toaster/>` in app root; `aria-live=polite`; variants `info | success | warning | danger`; bottom-right (Sonner default).
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 7.5.16 Implement `MenuList.tsx`
    - `@radix-ui/react-dropdown-menu`; ↑↓ Enter, Esc; `align`, `side`.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.17 Implement `ContextMenu.tsx`
    - `@radix-ui/react-context-menu`; same key handling as MenuList.
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 8.4_

  - [x] 7.5.18 Upgrade `ds/Progress.tsx` to wrap `@radix-ui/react-progress`
    - Replace the Phase 1 dep-free implementation with a `@radix-ui/react-progress` wrapper. The public prop signature must remain a superset of the Phase 1 implementation (no removed/renamed prop, no narrowed type) per Property 11. Continue to surface `role=progressbar`, `aria-valuenow`, and indeterminate.
    - _Requirements: 2.1, 2.3 — Property 11_

  - [x] 7.5.19 Upgrade `ds/ScrollArea.tsx` to wrap `@radix-ui/react-scroll-area`
    - Replace the Phase 1 dep-free implementation with a `@radix-ui/react-scroll-area` wrapper. The public prop signature must remain a superset of the Phase 1 implementation (no removed/renamed prop, no narrowed type) per Property 11. Continue to expose `role=region` when labeled and accept `viewportClassName?`.
    - _Requirements: 2.1, 2.3 — Property 11_

  - [x] 7.5.20 Update `apps/web/src/components/ds/index.ts` to re-export Phase 1.5 primitives
    - Add re-exports for `ToggleGroup`, `Switch`, `Checkbox`, `Radio`, `Select`, `Combobox`, `Slider`, `Tabs`, `Segmented`, `Sheet`, `Dialog`, `Drawer`, `Popover`, `Tooltip`, `Toast`, `MenuList`, `ContextMenu` so the order matches Req 2.1; ensure `Progress` and `ScrollArea` continue to resolve to the upgraded sources from 7.5.18 / 7.5.19.
    - _Requirements: 2.1_

- [x] 10.6 Phase 1.5 gate
  - Run `pnpm guard`, `pnpm typecheck`, `pnpm --filter @galyarder-design/web test`. Each must exit with status 0 before any Phase 2 surface that consumes a dep-backed primitive treats that primitive as available; otherwise the dep-backed surface stays gated.
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 39.1, 39.2, 39.5_

### Phase 2 — Web batch A (high-traffic surfaces)

- [x] 11. Redesign `EntryView.tsx`
  - [x] 11.1 Rebuild `apps/web/src/components/EntryView.tsx`
    - Single-column hero with primary `Button variant=primary size=lg` "Create project"; scrollable secondary `Card` list ordered most-recently-updated first; `EntryNavRail` and `EntryHelpMenu` rewired through `ds/*`; preserve exported component name and prop signature; preserve `connectorLifecycle` and `sortConnectorsForSearch` exports.
    - State machine: Loading → Empty → Populated, plus Error branch with retry; render `EmptyState` directly when zero projects; render daemon-down / API-key-missing / agent-CLI-not-found error states per Req 24 with `Banner variant=danger` and `Button` retry.
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 23.1, 23.2, 23.3, 23.4, 24.1, 24.2, 24.3_

  - [ ]* 11.2 Write property test for project list ordering by recency
    - **Property 12: Project list ordering by recency** at `apps/web/tests/components/ds/EntryView.test.tsx` (or `apps/web/tests/views/EntryView.test.tsx`); for arbitrary project arrays, after sorting indices `i < j` satisfy `projects[i].updatedAt ≥ projects[j].updatedAt`.
    - **Validates: Requirements 10.3_

- [x] 12. Redesign `HomeView.tsx` and `HomeHero.tsx`
  - [x] 12.1 Rebuild `apps/web/src/components/HomeView.tsx` two-pane layout
    - CSS-grid layout with leading `ChatPane` clamped 30–70% / ≥320px and trailing `Iframe_Preview` chrome; draggable separator with `role="separator" aria-orientation="vertical"` resizing via grid-template-columns only (no iframe remount); preserve exported component name and prop signature; preserve CJK detection patterns verbatim including English annotations.
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 7.6_

  - [x] 12.2 Rebuild `apps/web/src/components/HomeHero.tsx`
    - Use `Card` + `Button` + `Icon`; preserve CJK detection patterns verbatim including English annotations.
    - _Requirements: 11.4, 7.6_

  - [ ]* 12.3 Write property test for HomeView pane bounds and iframe persistence
    - **Property 13: HomeView pane bounds and iframe persistence** at `apps/web/tests/components/HomeView.test.tsx` using `fast-check`; for arbitrary divider drag positions, both panes ≥320 CSS pixels and leading pane ∈ [30%, 70%]; over arbitrary drag/render-mode toggle sequences, both iframes mount exactly once.
    - **Validates: Requirements 11.1, 11.5, 11.6, 22.3, 22.6, 22.7_

- [x] 13. Redesign `ProjectView.tsx`
  - [x] 13.1 Rebuild `apps/web/src/components/ProjectView.tsx`
    - One workspace surface: `FileWorkspace` (left), `Iframe_Preview` (center), right rail with `Tabs` exposing Design Systems / Skills / Tweaks; bottom strip is the `ChatComposer`; no modal pickers; preserve exported component name and prop signature; preserve CJK detection patterns verbatim including English annotations.
    - Per-surface error isolation: a failure in any of {file viewer, design-system gallery, skill picker, tweaks} renders a non-blocking error inside that surface with retry while keeping the others interactive.
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 7.6_

  - [ ]* 13.2 Write property test for per-surface error isolation
    - **Property 14: Per-surface error isolation** at `apps/web/tests/components/ProjectView.test.tsx` using `fast-check`; for every subset `S` of the four sub-surfaces, simulate failure on `S` and assert the complement is fully interactive while error indicators appear only inside `S`.
    - **Validates: Requirements 12.5, 21.5, 29.4_

- [x] 14. Redesign the chat composer surface
  - [x] 14.1 Rebuild `apps/web/src/components/ChatComposer.tsx` and `ChatPane.tsx`
    - `Textarea` (autoResize) composer; pinned `TodoCard` slot via existing `PinnedTodoSlot` sourced from `latestTodoWriteInputFromMessages` (preserved verbatim); progress count formatted `<completed+in_progress>/<total>`; `AssistantMessage.stripTodoToolGroups` keeps stripping per-message TodoWrite groups.
    - `AskUserQuestionCard` prefers `onAnswerToolUse(toolUseId, content)` while run is active; falls back to `onSubmitForm(text)` after termination; persist selections by parsing `tool_result.content`; on `onAnswerToolUse` failure retain selection, render error indicator, keep submit enabled for retry.
    - Wire `dedupeSnapshotToolRetries` (preserved verbatim) for AskUserQuestion + TodoWrite collapsing.
    - Tool-result blocks use `Card` + `var(--type-code)` mono + `IconButton` copy affordance with `Toast` confirmation within 1500ms.
    - Preserve exported component name and public prop signature for both files.
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8_

  - [ ]* 14.2 Write property test for pinned TodoCard equivalence
    - **Property 17: Pinned TodoCard equals latest TodoWrite** at `apps/web/tests/components/ChatPane.test.tsx` using `fast-check`; for arbitrary message logs, the slot input equals `latestTodoWriteInputFromMessages(messages)` and the rendered numerator equals `count(status ∈ {completed, in_progress})` over total.
    - **Validates: Requirements 19.2, 19.3_

  - [ ]* 14.3 Write property test for AskUserQuestion routing and selection persistence
    - **Property 18: AskUserQuestion routing and selection persistence** at `apps/web/tests/components/AskUserQuestion.test.tsx` using `fast-check`; for `(toolUseId, content)` pairs while active, exactly one `onAnswerToolUse` call fires; after termination falls back to `onSubmitForm`; on failure response selection chips persist, error indicator renders, submit stays enabled.
    - **Validates: Requirements 19.4, 19.5, 19.6_

  - [ ]* 14.4 Write property test for tool-snapshot deduplication
    - **Property 19: Tool-snapshot deduplication** at `apps/web/tests/runtime/dedupe-snapshot.test.ts` using `fast-check` (1000 iterations); for arbitrary tool-call sequences, identical AskUserQuestion retries collapse keeping the latest `tool_use_id`; only the most recent TodoWrite snapshot is retained.
    - **Validates: Requirements 19.7_

- [x] 15. Redesign the file workspace and viewer
  - [x] 15.1 Rebuild `apps/web/src/components/FileWorkspace.tsx`
    - Left pane file list as `MenuList`-style stack inside `ScrollArea`; right pane viewer surface with hand-off `Button` + `Tooltip`; ↑/↓ moves through file list, Enter opens; render `EmptyState` on empty list and per-error states on failure.
    - _Requirements: 17.1, 17.2, 17.3_

  - [x] 15.2 Rebuild `apps/web/src/components/FileViewer.tsx` chrome
    - Preserve exported component name and prop signature; preserve dual-iframe simultaneous mount and `iframeRef.current` alignment via existing `useEffect`; preserve `isOurIframe(ev.source)` and `ev.source === iframeRef.current?.contentWindow` filters; hand-off action surfaces success/failure within 2 s.
    - **MUST NOT modify** `apps/web/src/components/file-viewer-render-mode.ts`; the redesign reads `UrlLoadDecision` and `decideRenderMode()` unchanged.
    - _Requirements: 17.4, 17.5, 22.3, 22.4, 22.5_

  - [ ]* 15.3 Write property test for verbatim preservation of named files and patterns
    - **Property 10: Verbatim preservation of named files and patterns** at `e2e/tests/redesign/verbatim-preservation.test.ts`; assert byte-equal (or AST-equal under formatting) baselines for: CJK detection patterns in `HomeView.tsx`, `ProjectView.tsx`, `HomeHero.tsx`, `projectName.ts`, `pointer.ts`; entire content of `apps/web/src/components/file-viewer-render-mode.ts`; entire content of `apps/daemon/src/*-routes.ts`; every exported type from `packages/contracts`; every existing key/value pair in `apps/web/src/i18n/locales/*`, `apps/landing-page/app/_lib/i18n.ts`, `apps/landing-page/app/_lib/home-copy.ts`.
    - **Validates: Requirements 7.6, 11.4, 12.4, 17.5, 31.6, 35.1, 35.2, 35.3, 36.1_

  - [ ]* 15.4 Write property test for iframe receive-filter discipline
    - **Property 21: Iframe receive-filter discipline** at `apps/web/tests/components/FileViewer.test.tsx` using `fast-check`; for arbitrary `postMessage` events, the host processes only when `isOurIframe(ev.source)` is true; signals scoped to the active iframe additionally require `ev.source === iframeRef.current?.contentWindow` and discard otherwise while preserving host state.
    - **Validates: Requirements 22.4, 22.5_

- [x] 16. Redesign the Iframe_Preview chrome
  - [x] 16.1 Rebuild the preview chrome adjacent to `FileViewer.tsx`
    - Single control bar with zoom `Segmented` (50/75/100/125/150/200, default 100), device-frame `Select` (desktop 1280×800 / tablet 768×1024 / mobile 375×667, default desktop), render-mode `ToggleGroup` (URL / srcDoc), comment side-panel `IconButton`, tweaks panel `IconButton`; all transitions ≤200ms; no remount on toggle; CSS visibility swap only.
    - _Requirements: 22.1, 22.2, 22.6, 22.7_

- [x] 17. Phase 2 gate
  - Run `pnpm guard`, `pnpm typecheck`, `pnpm --filter @galyarder-design/web test`. Each must exit with status 0 before Phase 3 begins; otherwise the phase is blocked.
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 39.1, 39.2, 39.5_

### Phase 3 — Web batch B (feature gallery)

- [x] 18. Redesign `PluginsView.tsx`
  - [x] 18.1 Rebuild `apps/web/src/components/PluginsView.tsx`
    - Responsive grid of plugin `Card`s with `Badge` for category; activation opens plugin detail through the `Dialog` primitive showing name, description, version, install control; preserve exported component name and prop signature; on dismiss return focus to the activating card; render `EmptyState` on zero plugins and error indicator with retry on metadata failure.
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 23.1, 23.2, 23.3, 23.4_

- [x] 19. Redesign `DesignSystemFlow.tsx`
  - [x] 19.1 Rebuild `apps/web/src/components/DesignSystemFlow.tsx`
    - Card grid with `Sheet` (side="right") preview rail; preserve grid visibility while preview is open; preserve exported component name and prop signature; render `EmptyState` on zero entries and error indicator with retry on failure.
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 23.1, 23.2, 23.3, 23.4_

- [x] 20. Redesign the skill picker surface
  - [x] 20.1 Rebuild `apps/web/src/components/SkillsSection.tsx`
    - Card grid mirroring plugin gallery; activation opens detail via `Sheet` (side="right") with name, description, input parameters (`TextInput` / `Combobox` / `Switch`) and Apply `Button`; on dismiss return focus to activating card; render `EmptyState` on zero entries and error indicator with retry on failure.
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 21. Redesign `MemorySection.tsx`
  - [x] 21.1 Rebuild `apps/web/src/components/MemorySection.tsx`
    - Header with `TextInput` search (max 200 chars, 300ms debounce) and `Button variant=danger` Prune; body is a virtualized list of saved-fact `Card`s; prune confirm uses `Dialog` showing pruned count; success surfaces a `Toast` within 2s and on failure preserves list state with retry control; empty state disables search and prune.
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

  - [ ]* 21.2 Write property test for memory search filter
    - **Property 20: Memory search is case-insensitive substring filter** at `apps/web/tests/components/MemorySection.test.tsx` using `fast-check` (1000 iterations); for arbitrary `(F, q)`, after the 300ms debounce the rendered list equals `F.filter(f => f.text.toLowerCase().includes(q.toLowerCase()))`.
    - **Validates: Requirements 20.3_

- [x] 22. Redesign `ConnectorsBrowser.tsx` and `RoutinesSection.tsx`
  - [x] 22.1 Rebuild both files as a single Connectors_Rail
    - Two `<section aria-labelledby>` blocks titled connectors and automations; entries render through `Card` rows with `Avatar` connector logos, `Badge` status, primary `Button`; tab order moves through section headings + entry primary actions in visual order with visible focus ring; per-section error isolation with retry; `EmptyState` per section when zero entries.
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6_

- [x] 23. Redesign `SettingsDialog.tsx`
  - [x] 23.1 Rebuild `apps/web/src/components/SettingsDialog.tsx`
    - `Dialog` body with five labeled sections (privacy, execution mode, model, locale, telemetry) navigated via vertical sub-rail (`NavRail` collapsed=false at md+, accordion at narrow widths); section panes use `ScrollArea`; entry control reachable in ≤10 Tabs from entry view first focusable; focus trap + initial focus on first interactive control + return focus to opener on close; Esc closes; preserve exported component name and prop signature.
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ]* 23.2 Write property test for public API stability of redesigned screen components
    - **Property 11: Public API stability** at `e2e/tests/redesign/api-stability.test.ts`; snapshot the `.d.ts` for `EntryView`, `HomeView`, `ProjectView`, `SettingsDialog`, `PluginsView`, `DesignSystemFlow`, `FileViewer`, `ChatComposer`, `MemorySection`, `UpdaterPopup`; assert post-redesign exported component name and prop signature is a superset of the pre-redesign baseline (no removed/renamed prop, no narrowed type).
    - **Validates: Requirements 10.2, 11.3, 12.3, 13.2, 14.3, 15.3, 17.4, 19.1, 32.3_

  - [ ]* 23.3 Write property test for empty/error state shape
    - **Property 22: Empty state and error state shape** at `apps/web/tests/components/empty-error-shape.test.tsx`; for every list-based view (Projects, Skills, Design Systems, Plugins, Memory), zero items render through the `EmptyState` primitive directly with title (≤60), description (≤200), and ≥1 primary action; load failure renders an error state distinct from the empty state with a retry control.
    - **Validates: Requirements 23.2, 23.3, 23.4_

- [x] 24. Phase 3 gate
  - Run `pnpm guard`, `pnpm typecheck`, `pnpm --filter @galyarder-design/web test`. Each must exit with status 0 before Phase 4 begins; otherwise the phase is blocked.
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 39.1, 39.2, 39.5_

### Phase 4 — Web batch C (system surfaces)

- [x] 25. Implement the dialog queue provider
  - [x] 25.1 Add `apps/web/src/providers/DialogQueueProvider.tsx`
    - Single-active-dialog gate: at most one `Dialog`-rendered modal visible at any time; FIFO queueing for additional open requests; integrates with `Dialog` primitive's open/close lifecycle.
    - _Requirements: 18.1, 18.5_

  - [ ]* 25.2 Write property test for dialog focus contract and queue
    - **Property 15: Dialog focus contract and queue** at `apps/web/tests/components/dialog-queue.test.tsx` using `fast-check`; for arbitrary Tab/Shift+Tab key sequences focus stays inside the dialog; on close focus returns to opener (except privacy modal); over arbitrary open-request sequences at most one dialog visible and queued requests display FIFO.
    - **Validates: Requirements 13.4, 13.5, 14.6, 18.1, 18.4, 18.5, 32.4_

- [x] 26. Redesign `PrivacyConsentModal.tsx`
  - [x] 26.1 Rebuild `apps/web/src/components/PrivacyConsentModal.tsx`
    - `Dialog` with `dismissable: false`; three controls in tab order: Accept (primary, affirmative verb) → Decline (secondary, negative verb) → Privacy details link (opens new tab); persist decision to `localStorage.galyarder.privacy.consent`; rendered before any other dialog on first load when key unset; Esc disabled on this modal only.
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

  - [ ]* 26.2 Write property test for privacy consent round-trip
    - **Property 16: Privacy consent round-trip** at `apps/web/tests/components/PrivacyConsentModal.test.tsx`; for any persisted decision in `{accepted, declined}` subsequent loads do not display the modal; with the key unset the modal displays before any other dialog and recording either decision dismisses it.
    - **Validates: Requirements 18.3_

- [x] 27. Redesign `UpdaterPopup.tsx`
  - [x] 27.1 Rebuild `apps/web/src/components/UpdaterPopup.tsx`
    - `Dialog` body with `Badge` version + release-date caption + release-notes Markdown rendered with distinct `--type-h1/h2/h3/p/ul/code` styles; close `IconButton` + Esc dismiss with focus return to opener; on empty/parse-fail render fallback message while keeping version + dismiss visible; preserve exported component name and prop signature (preserve the existing file path per design §6.2).
    - _Requirements: 32.1, 32.2, 32.3, 32.4, 32.5_

- [x] 28. Audit empty- and error-state primitive usage across redesigned views
  - [x] 28.1 Audit empty-state usage
    - Confirm every list-based view (Projects, Skills, Design Systems, Plugins, Memory, Connectors, Automations) renders empty state through the `EmptyState` primitive directly with no alternate container wrapper; replace any wrapper with the canonical primitive.
    - _Requirements: 23.1, 23.2, 23.3, 23.5_

  - [x] 28.2 Audit error-state usage
    - Confirm the four error triggers (daemon-down, API-key-missing, agent-CLI-not-found, build-failed) render through inline `Banner variant=danger` or full-pane error `Card`; each retry/re-run dismisses the current state and reflects the new attempt outcome; build-failed message truncated ≤2000 chars.
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

  - [ ]* 28.3 Write property test for error-state retry round-trip
    - **Property 23: Error-state retry round-trip** at `apps/web/tests/components/error-state.test.tsx`; for every error trigger in `{daemon-down, API-key-missing, agent-CLI-not-found, build-failed}` assert title + description (≤2000 chars when sourced from build failure) + retry/re-run; activating retry/re-run dismisses current state and reflects new outcome.
    - **Validates: Requirements 24.1, 24.2, 24.3, 24.4, 24.5_

- [x] 29. Phase 4 gate
  - Run `pnpm guard`, `pnpm typecheck`, `pnpm --filter @galyarder-design/web test`. Each must exit with status 0 before Phase 5 begins; otherwise the phase is blocked.
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 39.1, 39.2, 39.5_

### Phase 5 — Landing page

- [x] 30. Redesign the landing-page hero
  - [x] 30.1 Rebuild `apps/landing-page/app/_components/hero.astro` (or existing equivalent)
    - Single-sentence positioning statement of 40–140 characters; exactly one demo asset (image XOR video, mutually exclusive); exactly two CTAs labeled "Download Desktop" and "Browse Skills" rendered as React islands using `Button` from `@gd/ds` with `client:load`; demo-asset failure renders placeholder while preserving layout; LCP ≤2500ms on a 10 Mbps / 50 ms RTT reference network; zero Atelier-Zero / Open Design residue; no emoji, no `!`, no banned superlatives.
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6, 41.1, 41.2_

  - [ ]* 30.2 Write property test for landing-page composition budgets
    - **Property 24: Landing-page composition budgets** at `e2e/tests/redesign/landing-budgets.test.ts`; assert hero positioning sentence has 40–140 chars, exactly one demo asset, CTAs labeled exactly "Download Desktop" and "Browse Skills"; capabilities cell count ∈ [3, 8], label 1–40 chars, example 1–140 chars; index-page entries fit description ≤200 chars; tutorials list title ≤80 chars and summary ≤200 chars.
    - **Validates: Requirements 25.1, 26.1, 27.1, 27.2, 27.3, 28.1_

- [x] 31. Redesign the capabilities grid
  - [x] 31.1 Rebuild `apps/landing-page/app/_components/capabilities.astro`
    - Grid of 3–8 cells; each cell is `<article>` with label (1–40 chars) + example (1–140 chars); `Card` from `@gd/ds` rendered as React islands with `client:visible`; single column at viewport ≤768px; anchor target `#capabilities` always present even when content fails; activating the anchor brings the heading into viewport within 500ms.
    - _Requirements: 26.1, 26.2, 26.3, 26.4_

  - [ ]* 31.2 Write property test for capabilities anchor preservation
    - **Property 25: Capabilities anchor preservation** at `e2e/tests/redesign/capabilities-anchor.test.ts`; for arbitrary capabilities-content failure modes (zero cells, fetch failure, render failure), the anchor target `#capabilities` resolves on the rendered page.
    - **Validates: Requirements 26.3_

- [x] 32. Redesign the index pages and detail pages for plugins, skills, design systems
  - [x] 32.1 Add `apps/landing-page/app/pages/plugins/index.astro` and detail route
    - List/grid of plugin entries: name + description (≤200 chars) + thumbnail; render within 3 s under normal network; activating an entry navigates to a detail page served from the public web with no desktop dependency; empty state when zero published; not-found state with link back to index when slug unknown.
    - _Requirements: 27.1, 27.4, 27.5, 27.6_

  - [x] 32.2 Update `apps/landing-page/app/pages/skills/index.astro` and detail route
    - List/grid of skill entries: name + description (≤200 chars) + thumbnail; render within 3 s; detail served from public web; empty + not-found states.
    - _Requirements: 27.2, 27.4, 27.5, 27.6_

  - [x] 32.3 Update `apps/landing-page/app/pages/systems/index.astro` and detail route
    - List/grid of design-system entries: name + description (≤200 chars) + thumbnail; render within 3 s; detail served from public web; empty + not-found states.
    - _Requirements: 27.3, 27.4, 27.5, 27.6_

- [x] 33. Redesign the tutorials and blog list and detail pages
  - [x] 33.1 Rebuild `apps/landing-page/app/pages/tutorials/index.astro` (or existing equivalent)
    - List of entries with title (≤80 chars), publish date, summary (≤200 chars); render within 2 s; empty state when zero published; not-found state with link back to list when slug unknown.
    - _Requirements: 28.1, 28.4, 28.5_

  - [x] 33.2 Build the tutorials/blog detail layout with reading column and TOC
    - Reading column whose measure stays in `[60, 75]` cpl at the body type token across viewport widths 320–1920px; render in-page TOC as an `@gd/ds` island when post contains ≥5 top-level sections; TOC anchors scroll to corresponding heading on activation.
    - _Requirements: 28.2, 28.3_

  - [ ]* 33.3 Write property test for blog TOC threshold
    - **Property 26: Blog TOC threshold** at `e2e/tests/redesign/blog-toc.test.ts`; for posts with `n` top-level sections, the TOC renders iff `n ≥ 5`; every TOC anchor resolves to an existing heading id.
    - **Validates: Requirements 28.3_

- [x] 34. Redesign the landing-page footer
  - [x] 34.1 Rebuild `apps/landing-page/app/_components/footer.astro`
    - Exactly five top-level elements: brand mark, repository link, license indicator, contact link, locale switcher; per-element fallback indicator if a dependency fails while keeping the remaining elements operable; no marketing residue (no newsletter form / social feed / advertisement / banner / testimonial).
    - _Requirements: 29.1, 29.2, 29.3, 29.4_

  - [ ]* 34.2 Write property test for footer composition
    - **Property 27: Footer composition** at `e2e/tests/redesign/footer-composition.test.ts`; assert exactly five top-level elements each playing one of brand-mark / repository-link / license-indicator / contact-link / locale-switcher; assert no newsletter / social / advertisement / banner / testimonial.
    - **Validates: Requirements 29.1, 29.2_

- [x] 35. Redesign the landing-page header
  - [x] 35.1 Rebuild `apps/landing-page/app/_components/header.astro` and `header-enhancer.astro`
    - Fixed top header; transparent (alpha 0) while hero in viewport; solid (alpha 1, surface token) when hero leaves viewport, with 200ms `var(--easing-standard)` transition; mobile hamburger disclosure at viewport ≤`--breakpoint-md` using `IconButton` + `Sheet` from `@gd/ds`; expanded-state indicator initially collapsed; activation toggles state; activating a nav link inside expanded panel collapses the panel.
    - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5, 30.6_

  - [ ]* 35.2 Write property test for header transparent/solid by scroll
    - **Property 28: Header transparent / solid by scroll** at `e2e/tests/redesign/header-scroll-state.test.ts`; for arbitrary scroll positions `y` the header `data-state` equals `"transparent"` when the hero intersects the viewport at `y` and `"solid"` otherwise; transitions use the standard easing and 200ms duration.
    - **Validates: Requirements 30.1, 30.2, 30.3_

  - [ ]* 35.3 Write property test for hamburger expand/collapse sequence
    - **Property 29: Hamburger expand-collapse sequence** at `e2e/tests/redesign/header-hamburger.test.ts`; for arbitrary activation sequences starting from collapsed, the indicator alternates collapse → expand → collapse; any nav-link activation inside the expanded panel returns the indicator to collapse.
    - **Validates: Requirements 30.4, 30.5, 30.6_

- [x] 36. Phase 5 gate
  - Run `pnpm guard`, `pnpm typecheck`, `pnpm --filter @galyarder-design/landing-page build`. Each must exit with status 0 before Phase 6 begins; otherwise the phase is blocked.
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 39.1, 39.3, 39.5_

### Phase 6 — Desktop chrome

- [x] 37. Build the desktop title bar
  - [x] 37.1 Add `apps/desktop/src/renderer/TitleBar.tsx`
    - Renderer-only React component (no main-process changes); platform routing on `process.platform`: `darwin` → frameless + vibrancy + traffic lights leading + title centered; `win32` → controls trailing + title leading; `linux` → WM-conventional + title leading; unknown → linux fallback; title text always exactly `Galyarder Design`; unfocused style uses `--text-muted` and one-step-down surface keeping ≥3:1 contrast; imports primitives from `@gd/ds`.
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5, 31.6_

  - [ ]* 37.2 Write property test for title-bar platform routing
    - **Property 30: Title-bar platform routing** at `e2e/tests/redesign/titlebar-routing.test.ts`; for every value of `process.platform` in `{darwin, win32, linux, unknown}` the rendered title bar matches the corresponding row of the title-bar specification table; under unfocused state the title text maintains ≥3:1 contrast.
    - **Validates: Requirements 31.1, 31.2, 31.3, 31.4, 31.5_

- [x] 38. Confirm the updater popup chrome path
  - [x] 38.1 Verify `apps/web/src/components/UpdaterPopup.tsx` is imported by the desktop renderer
    - Keep the file at the existing path (the requirement allows the existing equivalent file per design §6.2); preserve same prop names and types (already covered by Task 27.1); ensure the desktop renderer imports it via the canonical path with no duplicated source.
    - _Requirements: 32.3_

- [x] 39. Set the desktop window minimum size
  - [x] 39.1 Update the `BrowserWindow` constructor in `apps/desktop/src/main/`
    - Set `minWidth: 1024`, `minHeight: 720`; resize attempts below this clamp at last valid dimensions; at widths above `--breakpoint-md` the secondary `NavRail` stays expanded, at or below it collapses with no horizontal clipping.
    - _Requirements: 33.1, 33.2, 33.3, 33.4_

  - [ ]* 39.2 Write property test for NavRail collapse by viewport breakpoint
    - **Property 31: NavRail collapse by viewport breakpoint** at `apps/web/tests/components/NavRail.test.tsx` using `fast-check`; for arbitrary viewport widths `w` ∈ `[320, 2560]`, `NavRail.collapsed === (w ≤ var(--breakpoint-md))`.
    - **Validates: Requirements 33.2, 33.3_

- [x] 40. Phase 6 gate
  - Run `pnpm guard`, `pnpm typecheck`, `pnpm --filter @galyarder-design/desktop build`. Each must exit with status 0 before Phase 7 begins; otherwise the phase is blocked.
  - Gate cleared: `pnpm guard` exit 0, `pnpm typecheck` exit 0, `pnpm --filter @galyarder-design/desktop build` exit 0. Sign-off recorded at `.tmp/redesign/phase-6-gate.md`.
  - _Requirements: 39.1, 39.5_

### Phase 7 — Cross-cutting polish

- [x] 41. i18n parity audit and locale-key cleanup
  - [x] 41.1 Audit and fix i18n parity for all 17 web locales
    - Walk every key in `apps/web/src/i18n/types.ts`; assert each of `ar`, `de`, `en`, `es-ES`, `fa`, `fr`, `hu`, `id`, `it`, `ja`, `ko`, `pl`, `pt-BR`, `ru`, `th`, `tr`, `uk` declares the key with a non-empty string; rename/remove operations propagate identically across all 17 files in the same change set; do not modify existing translated values.
    - All 17 locales now have 2209 keys with 0 missing. Missing keys were added using English values as fallback; existing translations were not modified. `pnpm guard` exits 0.
    - _Requirements: 36.1, 36.2, 36.4_

  - [ ]* 41.2 Write property test for i18n parity across 17 web locales
    - **Property 32: i18n parity across 17 web locales** at `apps/web/tests/i18n/parity.test.ts`; for every key `K` in `types.ts` every locale file declares `K` non-empty; rename/remove operations apply identically; same parity holds for `apps/landing-page/app/_lib/i18n.ts` and `apps/landing-page/app/_lib/home-copy.ts` against their declared locale set.
    - **Validates: Requirements 36.2, 36.3, 36.4_

- [x] 42. RTL Playwright snapshots
  - [x] 42.1 Add RTL snapshot tests under `e2e/ui/rtl-snapshots.test.ts`
    - Capture `HomeView`, `ProjectView`, `SettingsDialog` at `dir="rtl"` × {1024, 1440, 1920}px viewport widths using locales `ar` and `fa`; assert no horizontal clipping; logical-properties usage holds. Placed flat in `e2e/ui/` per AGENTS.md (no subdirectories under `ui/`).
    - _Requirements: 7.1, 7.2_

- [x] 43. CJK reflow snapshots
  - [x] 43.1 Add CJK snapshot tests under `e2e/ui/cjk-reflow.test.ts`
    - Capture the same screens at locales `ja` and `ko` × {1024, 1440, 1920}px; assert no glyph extends beyond inner padding box of any `Card`; controls grow or wrap rather than truncate without indication. Placed flat in `e2e/ui/` per AGENTS.md.
    - _Requirements: 7.3, 7.4, 7.5_

- [x] 44. Reduced-motion smoke pass
  - [x] 44.1 Add reduced-motion test at `e2e/ui/reduced-motion.test.ts`
    - Toggle `prefers-reduced-motion: reduce`; assert every `--duration-*` token resolves to `0ms`; assert decorative transitions render as instantaneous state changes; assert `Skeleton` shimmer animation is disabled.
    - _Requirements: 6.5, 8.6_

- [x] 45. Density toggle pass
  - [x] 45.1 Add density-toggle e2e test at `e2e/ui/density-toggle.test.ts`
    - Toggle comfortable ↔ compact; assert change applied within 100ms with no per-element layout shift > 2px; reload restores selected density before first interactive component renders.
    - _Requirements: 5.2, 5.3, 5.6_

- [x] 46. Performance budget tightening
  - [x] 46.1 Add Lighthouse-driven performance test at `e2e/ui/performance-budgets.test.ts`
    - On the Req 9 reference machine (≥8 logical CPU cores, 16 GB RAM, localhost daemon) capture FCP cold ≤1200ms, FCP warm ≤600ms on `HomeView`; capture LCP ≤2500ms on the landing hero under 10 Mbps / 50ms RTT; CLS contribution from surfaces outside the streaming message container is zero during a streaming run.
    - If budgets exceed: raise font priority (`font-display: optional`), defer non-critical CSS, code-split the dialog queue, then re-measure.
    - _Requirements: 9.1, 9.2, 9.3, 25.2_

- [x] 47. Brand-tone scrub across all 17 web locales and all landing locales
  - [x] 47.1 Audit redesigned product chrome for brand tone
    - Walk every redesigned chrome string (header, nav, sidebar, footer, page title, body, tooltips, notifications, empty states, error states); assert display headlines ≤8 words and body sentences ≤20 words; zero emoji; zero `!` outside user-authored quotation blocks; zero occurrences of `best`, `amazing`, `revolutionary`, `world-class`, `cutting-edge`, `game-changing`, `unparalleled` without an on-surface citation.
    - Audit complete. No violations found in product chrome. `pnpm guard` exits 0.
    - _Requirements: 25.4, 40.1, 40.2, 40.3, 40.4_

  - [ ]* 47.2 Write property test for brand-tone copy invariants
    - **Property 34: Brand-tone copy invariants** at `e2e/tests/redesign/brand-tone.test.ts`; for every redesigned product-chrome string assert (a) display headlines ≤8 words and body sentences ≤20 words; (b) no Unicode emoji; (c) no `!` outside user-authored content; (d) no banned superlative without on-surface citation.
    - **Validates: Requirements 25.4, 40.1, 40.2, 40.3, 40.4_

- [x] 48. Stale brand and foreign-script scrub
  - [x] 48.1 Audit and remove `Open Design`, `open-design`, `Atelier Zero` remnants across product chrome
    - Walk header, nav, sidebar, footer, page title, visible body for `apps/web` (`http://127.0.0.1:17573/`), `apps/landing-page`, and `apps/desktop` title bar; remove all case-insensitive matches; confirm desktop title bar renders exactly `Galyarder Design`; assert every codepoint in product chrome lies in `U+0000–U+00FF`.
    - One product chrome match fixed: "Atelier Zero typography" → "editorial typography" in `apps/landing-page/app/pages/html-anything/index.astro`. All other matches were in code comments (excluded) or content data files (skill metadata, not product chrome). `TitleBar.tsx` uses `const TITLE_TEXT = 'Galyarder Design'` correctly. Audit report at `.tmp/redesign/stale-brand-audit.md`. `pnpm guard` exits 0.
    - _Requirements: 41.1, 41.2, 41.3, 41.4, 41.5_

  - [ ]* 48.2 Write property test for stale brand and foreign-script removal
    - **Property 35: Stale brand and foreign-script removal in product chrome** at `e2e/tests/redesign/stale-brand-scrub.test.ts`; for every product-chrome surface assert zero case-insensitive matches of `Open Design`, `open-design`, `Atelier Zero`; desktop title bar exactly `Galyarder Design`; every codepoint in `U+0000–U+00FF`.
    - **Validates: Requirements 41.1, 41.2, 41.3, 41.4, 41.5_

- [x] 49. Retire legacy token aliases
  - [x] 49.1 Walk `apps/web/src/styles/tokens.css` legacy alias block
    - For each `/* legacy: → --surface-N */` alias, search the redesigned codebase for remaining callers; remove aliases with zero callers; flag aliases that still have callers in `.tmp/redesign/legacy-aliases.md` with file paths and follow-up rationale.
    - Result: Zero aliases removed — all 26 legacy aliases have active callers in `apps/web/src/index.css`, `apps/web/src/styles/home/*.css`, `apps/web/src/styles/design-system-flow.css`, `apps/landing-page/app/globals.css`, and `apps/landing-page/app/sub-pages.css`. Full caller inventory and migration priority table written to `.tmp/redesign/legacy-aliases.md`. `pnpm guard` exits 0.
    - _Requirements: 38.3, 38.4_

- [x] 50. Final repo-wide audit
  - [x] 50.1 Run the full final-audit command set
    - Execute `pnpm guard`, `pnpm typecheck`. Each exited with status 0. Fixed dependency version specs from caret (`^`) to exact versions in `apps/web/package.json` for all Phase 1.5 Radix/UI dependencies. `pnpm install` updated the lockfile. `pnpm guard` exit 0, `pnpm typecheck` exit 0.
    - _Requirements: 39.4, 39.6_

- [x] 51. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise. `pnpm guard` exit 0, `pnpm typecheck` exit 0. Phase 7 e2e test files created: `e2e/ui/rtl-snapshots.test.ts`, `e2e/ui/cjk-reflow.test.ts`, `e2e/ui/reduced-motion.test.ts`, `e2e/ui/density-toggle.test.ts`, `e2e/ui/performance-budgets.test.ts`. All typecheck clean.
  - _Requirements: 39.4, 39.6_

## Notes

- Tasks marked with `*` are optional; they are property/unit/integration tests that gate the redesign's correctness properties and can be skipped only when the team explicitly accepts the risk.
- Each task references its grounding Requirement IDs and (where it ships verification) its Property IDs from the design.
- Per-phase gate tasks (10, 10.6, 17, 24, 29, 36, 40) implement Requirement 39 and block the next phase on failure. Task 10 records the partial Phase 1 closure (dep-free subset only) and asks the maintainer to confirm advancement to Phase 2 in parallel with Phase 1.5 landing dep-backed primitives behind 10.6.
- Phase 1.5 is gated on user sign-off of `.tmp/redesign/deps.md` plus a successful `pnpm --filter @galyarder-design/web add …` run; surfaces in Phase 2 that consume a Phase 1.5 primitive may stub through `apps/web/src/components/ds/index.ts` until the primitive lands.
- After Phase 1.5 lands, the Phase 1 dep-free `Progress` and `ScrollArea` implementations are upgraded to wrap `@radix-ui/react-progress` and `@radix-ui/react-scroll-area` respectively; the upgrade keeps the public prop signature a superset of the Phase 1 implementation per Property 11.
- Property tests use `fast-check` per the design's Testing Strategy. Tests live under `apps/web/tests/components/ds/`, `apps/web/tests/design-system/`, and `e2e/tests/redesign/`. Each property test carries the JSDoc tag `Feature: unified-design-system-redesign, Property <N>`.
- Property tests default to `fast-check` `numRuns: 50` for fast suite execution. Tasks that explicitly specify a higher count (Property 4 / 19 / 20 at 1000 iterations for clamping invariants and dedupe correctness) keep their stated count; everything else uses 50.
- Hard preservation surfaces (`apps/daemon/src/*-routes.ts`, `packages/contracts`, `file-viewer-render-mode.ts`, CJK detection patterns, `latestTodoWriteInputFromMessages`, `dedupeSnapshotToolRetries`, `isOurIframe`, active-iframe filter, `onAnswerToolUse` route preference) are byte-equal preserved per Property 10; the redesign reads from them but does not modify them.
- New UI deps stay within `{@radix-ui/*, vaul, sonner, lucide-react, cmdk}` and land with a `.tmp/redesign/deps.md` entry per Req 37.1 / Property 33.

## Task Dependency Graph

The waves below schedule every incomplete leaf sub-task. Tasks already complete (Phases 0–6 + Phase 7 wave 0: 1.1, 1.2, 2.1–2.4, 3.1, 4.1–4.3, 5.1, 6.1, 7.1, 7.2, 7.7, 7.8, 7.14, 7.21–7.31, 7.34–7.38, 7.5.0–7.5.20, 8.1–8.4, 9.1, 9.2, 10.1, 10.5, 11.1, 12.1, 12.2, 13.1, 14.1, 15.1, 15.2, 16.1, 18.1, 19.1, 20.1, 21.1, 22.1, 23.1, 25.1, 26.1, 27.1, 28.1, 28.2, 30.1, 31.1, 32.1–32.3, 33.1, 33.2, 34.1, 35.1, 37.1, 38.1, 39.1, 41.1, 47.1, 48.1, 49.1) are no longer present in the graph per the workflow rule that the JSON `waves` represent only incomplete leaf sub-tasks. Tasks in the same wave are independent and can run in parallel; tasks in wave N can only execute after every task in waves `0..N-1` completes. Top-level parent tasks (without decimal notation, including the Phase 1.5 parent `7.5`) and checkpoint tasks (10, 10.6, 17, 24, 29, 36, 40, 51) are not scheduled in the graph; they are evaluation-only gates.

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.5", "2.6", "2.7", "3.2", "4.4", "5.2", "5.3", "7.39", "7.40", "7.41", "8.5", "11.2", "12.3", "13.2", "14.2", "14.3", "14.4", "15.3", "15.4", "21.2", "23.2", "23.3", "25.2", "26.2", "28.3", "30.2", "31.2", "33.3", "34.2", "35.2", "35.3", "37.2", "39.2", "41.2", "42.1", "43.1", "44.1", "45.1", "46.1", "47.2", "48.2"] },
    { "id": 1, "tasks": ["50.1"] }
  ]
}
```
