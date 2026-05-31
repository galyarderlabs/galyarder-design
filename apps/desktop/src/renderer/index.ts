/**
 * Desktop renderer entry point. The desktop renderer's primary surface
 * is the web URL itself (loaded via `BrowserWindow.loadURL` in
 * `apps/desktop/src/main/runtime.ts`), so the web bundle handles
 * tokens + primitives there. This file exists for the desktop-private
 * React surface that lands in Phase 6 of the unified-design-system
 * redesign — title bar, UpdaterPopup chrome — which mounts into the
 * same renderer document and consumes the canonical primitives via the
 * `@gd/ds` and `@gd/tokens` aliases declared in
 * `apps/desktop/tsconfig.renderer.json`.
 *
 * Phase 6 will replace this placeholder with `TitleBar.tsx` and friends.
 * Until then the alias contract from tasks.md 9.2 (Requirements 1.10,
 * 2.8) is exercised by the type-only import below: `tsc -p
 * tsconfig.renderer.json` follows `@gd/ds` to
 * `apps/web/src/components/ds/index.ts` and fails loudly if the path
 * mapping breaks.
 *
 * Requirement 32.3: UpdaterPopup is implemented in the existing equivalent
 * file at `apps/web/src/components/UpdaterPopup.tsx`. The desktop renderer
 * imports it from that canonical path so there is no duplicated source.
 */
import type { ButtonProps } from '@gd/ds';
// Re-export UpdaterPopup from the canonical web component path (Req 32.3).
// The component lives at apps/web/src/components/UpdaterPopup.tsx; the
// desktop renderer consumes it here without duplicating the source.
export { UpdaterPopup } from '../../../web/src/components/UpdaterPopup';

const __aliasProbeVariant: ButtonProps['variant'] = 'primary';
export const __aliasProbe = __aliasProbeVariant;
