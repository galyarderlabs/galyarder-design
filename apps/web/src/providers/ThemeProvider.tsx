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

/**
 * React provider that owns the user's light / dark / system theme choice
 * for the redesigned web surface, per Requirement 4.3–4.8 and the design
 * document's "Theme switching" section.
 *
 * Persistence:
 *  - Stored as `localStorage.galyarder.theme = 'light' | 'dark' | 'system'`
 *    (Req 4.7). Selections survive across browser sessions of the same
 *    profile because the inline pre-paint script in `app/layout.tsx`
 *    reads the same key before first paint.
 *
 * System fallback:
 *  - When no value has been persisted, the initial mode resolves to the
 *    operating-system colour-scheme via
 *    `window.matchMedia('(prefers-color-scheme: dark)')` (Req 4.8). The
 *    `'system'` mode keeps that subscription live so an OS-level theme
 *    flip propagates to `<html data-theme>` without page reload.
 *
 * Application:
 *  - The provider always writes the resolved value (`'light' | 'dark'`)
 *    onto `<html data-theme="…">`. Tokens.css drives every visible
 *    surface from that attribute (Req 4.1, 4.2), and the body-level
 *    transitions in `motion.css` make the swap finish well inside the
 *    500 ms ceiling demanded by Req 4.3 / 4.4 / 4.5.
 *
 * The provider is intentionally independent of the legacy
 * `applyAppearanceToDocument` helper in `state/appearance.ts`. That
 * helper still drives the pre-redesign `--accent-*` custom properties
 * from the saved config; this provider owns the theme attribute. They
 * coexist while Phase 2..6 migrate the remaining surfaces.
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/** localStorage key. Mirrored by the inline pre-paint script. */
const STORAGE_KEY = 'galyarder.theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';
const VALID_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'] as const;

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (VALID_MODES as readonly string[]).includes(value);
}

/** SSR-safe read of the persisted mode. Returns null when storage is unavailable or empty. */
export function readPersistedTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isThemeMode(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** Persist the chosen mode to localStorage. Best-effort; quota / disabled storage is silent. */
export function persistTheme(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore quota / disabled storage */
  }
}

/** Read the current OS color-scheme preference. Defaults to 'dark'. */
export function readSystemPreference(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark';
  }
  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
}

/** Resolve a `ThemeMode` to its concrete light / dark value. */
export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'light' || mode === 'dark') return mode;
  return readSystemPreference();
}

/**
 * Apply the resolved theme to `<html data-theme="…">`. Always writes a
 * concrete `'light' | 'dark'` value so the CSS transitions on body
 * surfaces have a stable attribute to animate from / to. The inline
 * pre-paint script writes the same shape, which keeps first paint and
 * provider hydration in lockstep (no theme flash).
 */
export function applyThemeToDocument(resolved: ResolvedTheme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', resolved);
}

interface ThemeContextValue {
  /** The user-selected mode, including the explicit 'system' option. */
  mode: ThemeMode;
  /** The resolved value currently written to `<html data-theme>`. */
  resolved: ResolvedTheme;
  /** Choose a mode and persist it. Triggers an immediate document update. */
  setMode: (mode: ThemeMode) => void;
  /**
   * Cycle light → dark → light. `'system'` resolves first (so the cycle
   * starts from whatever the OS reports) before flipping. Persists.
   */
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ProviderProps {
  /** Force an initial mode. Used by tests; production callers omit this. */
  initial?: ThemeMode;
  children: ReactNode;
}

export function ThemeProvider({ initial, children }: ProviderProps) {
  // Hydrate from localStorage before any interactive component renders.
  // The pre-paint inline script has already set <html data-theme> for
  // the first paint, so this read only catches up the React tree.
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (initial) return initial;
    return readPersistedTheme() ?? 'dark';
  });

  const [systemPref, setSystemPref] = useState<ResolvedTheme>(() => readSystemPreference());

  // Subscribe to OS color-scheme changes whenever the user is on
  // 'system' mode. We keep the subscription mounted whenever
  // matchMedia is available so toggling back to 'system' immediately
  // reflects the latest OS value without a re-mount race.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const media = window.matchMedia(MEDIA_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      setSystemPref(event.matches ? 'dark' : 'light');
    };
    // Sync once on mount in case the script-time value drifted before
    // React hydrated (e.g. user flipped OS theme during JS bootstrap).
    setSystemPref(media.matches ? 'dark' : 'light');
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }
    // Safari < 14 fallback. matchMedia exposes the deprecated
    // addListener API but not addEventListener.
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const resolved: ResolvedTheme = mode === 'system' ? systemPref : mode;

  // Mirror the resolved value onto <html data-theme> on every change.
  // useEffect (not useLayoutEffect) because the pre-paint script has
  // already painted the correct attribute for this first render; this
  // effect handles subsequent toggles where a microtask delay is fine.
  useEffect(() => {
    applyThemeToDocument(resolved);
  }, [resolved]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    persistTheme(next);
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev) => {
      // Resolve 'system' against the latest OS pref so the first toggle
      // from system mode flips to the *opposite* of what the OS reports
      // rather than mysteriously landing on the same shade.
      const prevResolved: ResolvedTheme = prev === 'system' ? readSystemPreference() : prev;
      const next: ThemeMode = prevResolved === 'dark' ? 'light' : 'dark';
      persistTheme(next);
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolved, setMode, toggle }),
    [mode, resolved, setMode, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Read the active theme and helpers. When called outside a
 * `ThemeProvider` (isolated tests, SSR boundaries) this returns a
 * neutral fallback that resolves against the OS preference and treats
 * mutations as no-ops so consumers do not crash.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    const resolved = readSystemPreference();
    return {
      mode: 'system',
      resolved,
      setMode: () => {},
      toggle: () => {},
    };
  }
  return ctx;
}
