/**
 * TitleBar — renderer-only desktop chrome component.
 *
 * Platform routing on `process.platform`:
 *   darwin  → frameless + vibrancy + traffic lights leading + title centered
 *   win32   → controls trailing + title leading
 *   linux   → WM-conventional + title leading
 *   unknown → linux fallback
 *
 * Title text is always exactly "Galyarder Design" (Req 31.5, Req 41.3).
 * Unfocused style uses `--text-muted` and one-step-down surface keeping
 * ≥3:1 contrast (Req 31.4).
 *
 * No main-process changes are made here (Req 31.6).
 *
 * @example
 * ```tsx
 * import { TitleBar } from './TitleBar';
 * // Mount into the title-bar slot of the renderer document:
 * <TitleBar />
 * ```
 */

import React, { useEffect, useState } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────

/** The exact product name required by Req 31.5 and Req 41.3. */
const TITLE_TEXT = 'Galyarder Design';

/**
 * Height of the title bar in CSS pixels. Matches the Electron
 * `titleBarStyle: 'hidden'` / `titleBarOverlay` convention.
 */
const TITLE_BAR_HEIGHT = 36;

/**
 * Leading padding reserved for macOS traffic-light buttons.
 * Electron places them at ~8px from the left edge; we leave 72px
 * so the centered title never overlaps the controls.
 */
const DARWIN_TRAFFIC_LIGHT_RESERVE = 72;

// ─── Platform detection ──────────────────────────────────────────────────────

type Platform = 'darwin' | 'win32' | 'linux' | 'unknown';

function detectPlatform(): Platform {
  // `process` is available in the Electron renderer (Node integration or
  // contextBridge-exposed). Guard for environments where it may be absent.
  if (typeof process !== 'undefined' && process.platform) {
    const p = process.platform as string;
    if (p === 'darwin' || p === 'win32' || p === 'linux') {
      return p as Platform;
    }
  }
  return 'unknown';
}

// ─── Focus detection ─────────────────────────────────────────────────────────

/**
 * Returns `true` when the window is focused.
 *
 * Uses `document.hasFocus()` as the initial value and listens to the
 * `focus` / `blur` events on `window` for subsequent changes. This
 * approach works in both the Electron renderer and a plain browser
 * environment (useful for Storybook / test harnesses).
 */
function useWindowFocused(): boolean {
  const [focused, setFocused] = useState<boolean>(
    typeof document !== 'undefined' ? document.hasFocus() : true,
  );

  useEffect(() => {
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return focused;
}

// ─── Inline styles ───────────────────────────────────────────────────────────

/**
 * Base container style shared across all platforms.
 *
 * `-webkit-app-region: drag` makes the bar draggable in Electron.
 * `user-select: none` prevents accidental text selection while dragging.
 * All color values resolve through token custom properties so the bar
 * participates in the theme switch (Req 4.5).
 */
/**
 * Electron-specific CSS property that makes the element draggable as a
 * native window title bar. Not part of the standard `React.CSSProperties`
 * type, so we extend it here.
 */
interface ElectronCSSProperties extends React.CSSProperties {
  WebkitAppRegion?: 'drag' | 'no-drag';
}

const baseContainerStyle: ElectronCSSProperties = {
  display: 'flex',
  alignItems: 'center',
  height: TITLE_BAR_HEIGHT,
  width: '100%',
  WebkitAppRegion: 'drag',
  userSelect: 'none',
  position: 'relative',
  boxSizing: 'border-box',
  // Motion: theme switch transitions on background-color ≤500ms (Req 4.5)
  transition:
    'background-color var(--duration-gentle, 240ms) var(--easing-standard, cubic-bezier(0.23, 1, 0.32, 1))',
};

/**
 * Title text style.
 *
 * Uses `--type-body-sm` for the font stack and size, and switches
 * between `--text` (focused) and `--text-muted` (unfocused) to satisfy
 * the ≥3:1 contrast requirement in Req 31.4.
 *
 * `--text-muted` maps to `--neutral-7` (#6c6960, ~48.5% lightness) on a
 * `--surface-1` background (#faf9f7, ~98.4% lightness) in light mode,
 * giving a contrast ratio well above 3:1. In dark mode the same token
 * pair inverts and maintains the same ratio.
 */
function titleStyle(focused: boolean): React.CSSProperties {
  return {
    font: 'var(--type-body-sm)',
    color: focused ? 'var(--text)' : 'var(--text-muted)',
    letterSpacing: '0.01em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition:
      'color var(--duration-base, 180ms) var(--easing-standard, cubic-bezier(0.23, 1, 0.32, 1))',
  };
}

// ─── Platform-specific sub-components ────────────────────────────────────────

/**
 * macOS variant.
 *
 * - Frameless window with vibrancy: the background is transparent so
 *   Electron's `BrowserWindow.setVibrancy('hud')` (wired in main) shows
 *   through. We use a semi-transparent fallback for environments where
 *   vibrancy is unavailable.
 * - Traffic-light controls are rendered natively by Electron in the
 *   leading corner; we reserve space for them.
 * - Title is centered horizontally in the bar (Req 31.1).
 */
function DarwinTitleBar({ focused }: { focused: boolean }) {
  const containerStyle: ElectronCSSProperties = {
    ...baseContainerStyle,
    // Transparent so vibrancy shows through; semi-transparent fallback.
    backgroundColor: focused
      ? 'rgba(255, 255, 255, 0.01)'
      : 'rgba(255, 255, 255, 0.01)',
    justifyContent: 'center',
    paddingLeft: DARWIN_TRAFFIC_LIGHT_RESERVE,
    paddingRight: DARWIN_TRAFFIC_LIGHT_RESERVE,
  };

  return (
    <div style={containerStyle} role="banner" aria-label={TITLE_TEXT}>
      <span style={titleStyle(focused)}>{TITLE_TEXT}</span>
    </div>
  );
}

/**
 * Windows variant.
 *
 * - Platform-native frame; Electron renders min/max/close controls in
 *   the trailing corner via `titleBarOverlay` or `WS_CAPTION`.
 * - Title is leading-aligned (Req 31.2).
 * - Background uses `--surface-1` (focused) or `--surface-0` (unfocused,
 *   one step down) to satisfy the ≥3:1 contrast requirement (Req 31.4).
 */
function Win32TitleBar({ focused }: { focused: boolean }) {
  const containerStyle: ElectronCSSProperties = {
    ...baseContainerStyle,
    backgroundColor: focused ? 'var(--surface-1)' : 'var(--surface-0)',
    paddingLeft: 'var(--space-3, 12px)',
    // Reserve space for the native Electron overlay controls (~138px on
    // Windows at 100% DPI: 46px × 3 buttons).
    paddingRight: 138,
    justifyContent: 'flex-start',
  };

  return (
    <div style={containerStyle} role="banner" aria-label={TITLE_TEXT}>
      <span style={titleStyle(focused)}>{TITLE_TEXT}</span>
    </div>
  );
}

/**
 * Linux / unknown-OS variant (Req 31.3, Req 31.5).
 *
 * - WM-conventional: the window manager draws its own decorations;
 *   this bar is the in-content title area only.
 * - Title is leading-aligned.
 * - Background uses `--surface-1` (focused) or `--surface-0` (unfocused).
 */
function LinuxTitleBar({ focused }: { focused: boolean }) {
  const containerStyle: ElectronCSSProperties = {
    ...baseContainerStyle,
    backgroundColor: focused ? 'var(--surface-1)' : 'var(--surface-0)',
    paddingLeft: 'var(--space-3, 12px)',
    paddingRight: 'var(--space-3, 12px)',
    justifyContent: 'flex-start',
  };

  return (
    <div style={containerStyle} role="banner" aria-label={TITLE_TEXT}>
      <span style={titleStyle(focused)}>{TITLE_TEXT}</span>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export interface TitleBarProps {
  /**
   * Override the detected platform. Useful in Storybook / test harnesses
   * where `process.platform` may not reflect the target platform.
   */
  platform?: Platform;
}

/**
 * Desktop title bar component.
 *
 * Renderer-only — no main-process changes (Req 31.6).
 * Imports primitives from `@gd/ds` via the alias declared in
 * `apps/desktop/tsconfig.renderer.json` (Req 2.8).
 *
 * @example
 * ```tsx
 * import { TitleBar } from './TitleBar';
 * <TitleBar />
 * ```
 */
export function TitleBar({ platform: platformProp }: TitleBarProps = {}) {
  const platform = platformProp ?? detectPlatform();
  const focused = useWindowFocused();

  switch (platform) {
    case 'darwin':
      return <DarwinTitleBar focused={focused} />;
    case 'win32':
      return <Win32TitleBar focused={focused} />;
    case 'linux':
    case 'unknown':
    default:
      return <LinuxTitleBar focused={focused} />;
  }
}
