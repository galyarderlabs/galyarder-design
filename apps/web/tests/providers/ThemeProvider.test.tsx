// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, renderHook } from '@testing-library/react';
import {
  ThemeProvider,
  applyThemeToDocument,
  persistTheme,
  readPersistedTheme,
  readSystemPreference,
  resolveTheme,
  useTheme,
} from '../../src/providers/ThemeProvider';

const STORAGE_KEY = 'galyarder.theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

interface MockMediaList {
  matches: boolean;
  media: string;
  listeners: Array<(event: MediaQueryListEvent) => void>;
  addEventListener: (type: 'change', listener: (event: MediaQueryListEvent) => void) => void;
  removeEventListener: (type: 'change', listener: (event: MediaQueryListEvent) => void) => void;
  addListener: (listener: (event: MediaQueryListEvent) => void) => void;
  removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
  dispatchEvent: (event: Event) => boolean;
  onchange: ((event: MediaQueryListEvent) => void) | null;
}

let currentMatch = false;
let activeMedia: MockMediaList | null = null;

function installMatchMedia(initialMatches: boolean): void {
  currentMatch = initialMatches;
  activeMedia = null;

  const factory = vi.fn().mockImplementation((query: string) => {
    const list: MockMediaList = {
      matches: query === MEDIA_QUERY ? currentMatch : false,
      media: query,
      listeners: [],
      onchange: null,
      addEventListener(_type, listener) {
        this.listeners.push(listener);
      },
      removeEventListener(_type, listener) {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      },
      addListener(listener) {
        this.listeners.push(listener);
      },
      removeListener(listener) {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      },
      dispatchEvent: () => true,
    };
    if (query === MEDIA_QUERY) activeMedia = list;
    return list;
  });

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: factory,
  });
}

function flipSystem(matches: boolean): void {
  currentMatch = matches;
  if (!activeMedia) return;
  activeMedia.matches = matches;
  // Synthesize a MediaQueryListEvent payload — jsdom does not implement
  // the constructor, so a minimal object that satisfies the listener
  // shape is sufficient for our handlers.
  const event = { matches, media: MEDIA_QUERY } as MediaQueryListEvent;
  for (const listener of [...activeMedia.listeners]) listener(event);
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  installMatchMedia(false);
});

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
});

describe('readPersistedTheme', () => {
  it('returns the persisted mode when valid', () => {
    window.localStorage.setItem(STORAGE_KEY, 'dark');
    expect(readPersistedTheme()).toBe('dark');
  });

  it('returns null when the value is missing or malformed', () => {
    expect(readPersistedTheme()).toBeNull();
    window.localStorage.setItem(STORAGE_KEY, 'midnight');
    expect(readPersistedTheme()).toBeNull();
  });
});

describe('persistTheme', () => {
  it('writes the mode to localStorage under galyarder.theme', () => {
    persistTheme('dark');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark');
  });
});

describe('readSystemPreference', () => {
  it('reads from window.matchMedia(prefers-color-scheme: dark)', () => {
    installMatchMedia(true);
    expect(readSystemPreference()).toBe('dark');
    installMatchMedia(false);
    expect(readSystemPreference()).toBe('light');
  });
});

describe('resolveTheme', () => {
  it('returns the explicit value for light and dark', () => {
    expect(resolveTheme('light')).toBe('light');
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('falls back to the system preference for system mode', () => {
    installMatchMedia(true);
    expect(resolveTheme('system')).toBe('dark');
    installMatchMedia(false);
    expect(resolveTheme('system')).toBe('light');
  });
});

describe('applyThemeToDocument', () => {
  it('writes the resolved value onto html[data-theme]', () => {
    applyThemeToDocument('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    applyThemeToDocument('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});

describe('ThemeProvider', () => {
  it('hydrates from localStorage when a persisted value is present', () => {
    window.localStorage.setItem(STORAGE_KEY, 'dark');

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(result.current.mode).toBe('dark');
    expect(result.current.resolved).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('falls back to matchMedia when no persisted value exists', () => {
    installMatchMedia(true);

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(result.current.mode).toBe('system');
    expect(result.current.resolved).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('persists the chosen mode and updates the data-theme attribute', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    act(() => result.current.setMode('dark'));

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    act(() => result.current.setMode('light'));

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('reflects OS theme changes while in system mode', () => {
    installMatchMedia(false);

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(result.current.resolved).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    act(() => flipSystem(true));

    expect(result.current.mode).toBe('system');
    expect(result.current.resolved).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggle flips light <-> dark and persists the choice', () => {
    window.localStorage.setItem(STORAGE_KEY, 'light');

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    act(() => result.current.toggle());

    expect(result.current.mode).toBe('dark');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark');

    act(() => result.current.toggle());

    expect(result.current.mode).toBe('light');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('light');
  });

  it('toggle from system mode flips against the OS preference', () => {
    installMatchMedia(true); // OS reports dark

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(result.current.mode).toBe('system');
    expect(result.current.resolved).toBe('dark');

    act(() => result.current.toggle());

    expect(result.current.mode).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('useTheme outside a provider returns a no-op fallback', () => {
    installMatchMedia(true);

    const { result } = renderHook(() => useTheme());

    expect(result.current.mode).toBe('system');
    expect(result.current.resolved).toBe('dark');
    expect(() => result.current.setMode('light')).not.toThrow();
    expect(() => result.current.toggle()).not.toThrow();
  });

  it('renders children inside the context provider', () => {
    const { container } = render(
      <ThemeProvider initial="light">
        <span data-testid="child">painted</span>
      </ThemeProvider>,
    );

    expect(container.querySelector('[data-testid="child"]')?.textContent).toBe('painted');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
