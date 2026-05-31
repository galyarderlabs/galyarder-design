// @vitest-environment jsdom

import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DensityProvider, useDensity } from '../../src/providers/DensityProvider';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-density');
  document.documentElement.style.removeProperty('--density-multiplier');
  try {
    window.localStorage.clear();
  } catch {
    /* ignore */
  }
  vi.restoreAllMocks();
});

describe('DensityProvider', () => {
  it('hydrates from localStorage.galyarder.density before first render', () => {
    window.localStorage.setItem('galyarder.density', 'compact');

    function Probe() {
      const { mode } = useDensity();
      return <span data-testid="mode">{mode}</span>;
    }

    render(
      <DensityProvider>
        <Probe />
      </DensityProvider>,
    );

    expect(screen.getByTestId('mode').textContent).toBe('compact');
    expect(document.documentElement.getAttribute('data-density')).toBe('compact');
  });

  it('falls back to comfortable when no value is persisted', () => {
    function Probe() {
      const { mode, multiplier } = useDensity();
      return (
        <span data-testid="mode" data-multiplier={multiplier}>
          {mode}
        </span>
      );
    }

    render(
      <DensityProvider>
        <Probe />
      </DensityProvider>,
    );

    expect(screen.getByTestId('mode').textContent).toBe('comfortable');
    expect(screen.getByTestId('mode').getAttribute('data-multiplier')).toBe('1');
    expect(document.documentElement.hasAttribute('data-density')).toBe(false);
  });

  it('toggle flips between comfortable and compact and persists the choice', () => {
    const { result } = renderHook(() => useDensity(), {
      wrapper: ({ children }) => <DensityProvider>{children}</DensityProvider>,
    });

    expect(result.current.mode).toBe('comfortable');

    act(() => result.current.toggle());
    expect(result.current.mode).toBe('compact');
    expect(document.documentElement.getAttribute('data-density')).toBe('compact');
    expect(window.localStorage.getItem('galyarder.density')).toBe('compact');

    act(() => result.current.toggle());
    expect(result.current.mode).toBe('comfortable');
    expect(document.documentElement.hasAttribute('data-density')).toBe(false);
    expect(window.localStorage.getItem('galyarder.density')).toBe('comfortable');
  });

  it('setMode applies the requested mode and persists it', () => {
    const { result } = renderHook(() => useDensity(), {
      wrapper: ({ children }) => <DensityProvider>{children}</DensityProvider>,
    });

    act(() => result.current.setMode('compact'));
    expect(result.current.mode).toBe('compact');
    expect(result.current.multiplier).toBe(0.85);
    expect(window.localStorage.getItem('galyarder.density')).toBe('compact');
  });

  it('setMultiplier clamps to [0.75, 1.25] and warns on out-of-range', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { result } = renderHook(() => useDensity(), {
      wrapper: ({ children }) => <DensityProvider>{children}</DensityProvider>,
    });

    let resolved = 0;
    act(() => {
      resolved = result.current.setMultiplier(2);
    });
    expect(resolved).toBe(1.25);
    expect(document.documentElement.style.getPropertyValue('--density-multiplier')).toBe('1.25');
    expect(warn).toHaveBeenCalledTimes(1);

    act(() => {
      resolved = result.current.setMultiplier(0.5);
    });
    expect(resolved).toBe(0.75);
    expect(document.documentElement.style.getPropertyValue('--density-multiplier')).toBe('0.75');
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('setMultiplier accepts in-range values without warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { result } = renderHook(() => useDensity(), {
      wrapper: ({ children }) => <DensityProvider>{children}</DensityProvider>,
    });

    let resolved = 0;
    act(() => {
      resolved = result.current.setMultiplier(0.9);
    });
    expect(resolved).toBe(0.9);
    expect(document.documentElement.style.getPropertyValue('--density-multiplier')).toBe('0.9');
    expect(warn).not.toHaveBeenCalled();
  });

  it('useDensity returns a safe fallback when called outside a provider', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { result } = renderHook(() => useDensity());

    expect(result.current.mode).toBe('comfortable');
    expect(result.current.multiplier).toBe(1);

    // The fallback still routes through clampDensityMultiplier so the
    // out-of-range dev warning fires even without a provider mounted.
    let resolved = 0;
    act(() => {
      resolved = result.current.setMultiplier(5);
    });
    expect(resolved).toBe(1.25);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
