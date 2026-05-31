/**
 * Density mode persistence and document application.
 *
 * Mirrors the appearance.ts pattern: a small set of pure helpers
 * that read / clamp / apply the density value, plus a single
 * `applyDensityToDocument` writer that the layout root calls
 * before the first interactive component renders.
 *
 * Per Requirement 5 the density multiplier clamps to [0.75, 1.25]
 * and out-of-range writes emit a development-only console warning
 * (Property 4). Two named modes are exposed: `comfortable` (1.0)
 * and `compact` (0.85). Custom multipliers are accepted but always
 * resolved against the same clamp.
 */

export type DensityMode = 'comfortable' | 'compact';

export const DENSITY_MIN = 0.75;
export const DENSITY_MAX = 1.25;

const STORAGE_KEY = 'galyarder.density';

export function isDensityMode(value: unknown): value is DensityMode {
  return value === 'comfortable' || value === 'compact';
}

/** Resolve the active mode from a stored string, defaulting to comfortable. */
export function resolveDensityMode(value: unknown): DensityMode {
  return isDensityMode(value) ? value : 'comfortable';
}

/** Clamp an arbitrary multiplier to the supported range and warn out-of-range. */
export function clampDensityMultiplier(value: number): number {
  if (!Number.isFinite(value)) return 1;
  if (value < DENSITY_MIN || value > DENSITY_MAX) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `[galyarder-design] density multiplier ${value} is outside [${DENSITY_MIN}, ${DENSITY_MAX}]; clamping.`,
      );
    }
  }
  return Math.max(DENSITY_MIN, Math.min(DENSITY_MAX, value));
}

/** Map a named mode to its canonical multiplier. */
export function densityMultiplierFor(mode: DensityMode): number {
  return mode === 'compact' ? 0.85 : 1;
}

/** Read the persisted mode from localStorage. SSR-safe. */
export function readPersistedDensity(): DensityMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isDensityMode(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** Persist the chosen mode to localStorage. */
export function persistDensity(mode: DensityMode): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore quota/disabled storage */
  }
}

/** Apply the mode to <html data-density="…"> so tokens.css picks it up. */
export function applyDensityToDocument(mode: DensityMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (mode === 'compact') {
    root.setAttribute('data-density', 'compact');
  } else {
    root.removeAttribute('data-density');
  }
}
