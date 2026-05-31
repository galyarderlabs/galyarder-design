'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  applyDensityToDocument,
  clampDensityMultiplier,
  densityMultiplierFor,
  persistDensity,
  readPersistedDensity,
  resolveDensityMode,
  type DensityMode,
} from '../state/density';

/**
 * React provider that surfaces the comfortable / compact density toggle
 * backed by the helpers in `apps/web/src/state/density.ts`.
 *
 * Per Requirement 5 the provider:
 *  - Hydrates from `localStorage.galyarder.density` before the first
 *    interactive render so a reload restores the previously selected
 *    mode (5.6). The inline pre-paint script in `app/layout.tsx` writes
 *    `data-density` on `<html>` for the first paint; this useState
 *    mirrors that read so toggles can flip the mode in-process.
 *  - Clamps any directly-set multiplier into `[0.75, 1.25]` and emits a
 *    development-only `console.warn` for out-of-range inputs (5.5).
 *    Out-of-range warnings are produced by `clampDensityMultiplier`.
 *  - Exposes `setMode` / `toggle` for the named comfortable / compact
 *    modes (5.2, 5.3) and `setMultiplier` as the escape hatch for code
 *    paths that compute a custom value (a11y zoom, device-pixel maps).
 */

const DENSITY_VAR = '--density-multiplier';

interface DensityContextValue {
  mode: DensityMode;
  multiplier: number;
  setMode: (mode: DensityMode) => void;
  toggle: () => void;
  /**
   * Clamp an arbitrary multiplier into `[0.75, 1.25]` and apply it as an
   * inline style on `<html>`, overriding the attribute-driven default.
   * Emits a development-only `console.warn` for out-of-range inputs and
   * returns the resolved (clamped) multiplier.
   *
   * Most callers should prefer `setMode` / `toggle`; this is the escape
   * hatch for code paths that compute a custom multiplier outside the
   * named modes.
   */
  setMultiplier: (value: number) => number;
}

const DensityContext = createContext<DensityContextValue | null>(null);

interface ProviderProps {
  /** Force an initial mode. Used by tests; production callers omit this. */
  initial?: DensityMode;
  children: ReactNode;
}

export function DensityProvider({ initial, children }: ProviderProps) {
  // Hydrate the mode before any interactive component renders (Req 5.6).
  // The pre-paint inline script in app/layout.tsx has already set
  // <html data-density> for the first paint, so this read only catches
  // up the React tree; it does not race the visible style.
  const [mode, setModeState] = useState<DensityMode>(() => {
    if (initial) return initial;
    return resolveDensityMode(readPersistedDensity());
  });

  // Re-apply on mount and whenever the mode changes so tests / code
  // paths that mutate <html> outside React end up back in sync. Clearing
  // any inline `--density-multiplier` override left behind by
  // setMultiplier lets the attribute-driven token resolve cleanly.
  useEffect(() => {
    applyDensityToDocument(mode);
    if (typeof document !== 'undefined') {
      document.documentElement.style.removeProperty(DENSITY_VAR);
    }
  }, [mode]);

  const setMode = useCallback((next: DensityMode) => {
    setModeState(next);
    persistDensity(next);
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev) => {
      const next: DensityMode = prev === 'comfortable' ? 'compact' : 'comfortable';
      persistDensity(next);
      return next;
    });
  }, []);

  const setMultiplier = useCallback((value: number) => {
    const clamped = clampDensityMultiplier(value);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(DENSITY_VAR, String(clamped));
    }
    return clamped;
  }, []);

  const value = useMemo<DensityContextValue>(
    () => ({
      mode,
      multiplier: densityMultiplierFor(mode),
      setMode,
      toggle,
      setMultiplier,
    }),
    [mode, setMode, toggle, setMultiplier],
  );

  return <DensityContext.Provider value={value}>{children}</DensityContext.Provider>;
}

/**
 * Read the active density mode and helpers. When called outside a
 * `DensityProvider` (isolated tests, SSR boundaries) this returns a
 * neutral fallback that resolves to the comfortable mode and routes
 * `setMultiplier` through `clampDensityMultiplier` so the dev warning
 * still fires for out-of-range values.
 */
export function useDensity(): DensityContextValue {
  const ctx = useContext(DensityContext);
  if (!ctx) {
    return {
      mode: 'comfortable',
      multiplier: 1,
      setMode: () => {},
      toggle: () => {},
      setMultiplier: clampDensityMultiplier,
    };
  }
  return ctx;
}

export type { DensityMode };
