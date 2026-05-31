// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';

import { Toaster, toast } from '../../../src/components/ds/Toast';

// Sonner calls window.matchMedia internally to detect system theme preference.
// jsdom does not implement it, so we provide a minimal stub.
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  toast.dismiss();
  cleanup();
});

describe('ds/Toast — Toaster mount', () => {
  it('forwards ref to the toaster section element', () => {
    const ref = createRef<HTMLElement>();
    render(<Toaster ref={ref} />);
    // sonner mounts a <section aria-live="polite"> as the live region.
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName.toLowerCase()).toBe('section');
  });

  it('renders an aria-live polite region (sonner default)', () => {
    render(<Toaster />);
    const liveRegion = screen.getByLabelText(/Notifications/);
    expect(liveRegion.getAttribute('aria-live')).toBe('polite');
  });

  it('applies the ds-toaster class for token-driven theming', async () => {
    render(<Toaster />);
    // Sonner renders <section aria-live> as the ref target, and the
    // className prop is forwarded to the inner <ol data-sonner-toaster>.
    // We trigger a toast so Sonner mounts the <ol>, then verify the class.
    act(() => {
      toast.info('test');
    });
    await waitFor(() => {
      const toasterEl = document.querySelector('[data-sonner-toaster]');
      expect(toasterEl?.className.split(/\s+/)).toContain('ds-toaster');
    });
  });
});

describe('ds/Toast — toast helper variants', () => {
  it('toast() renders an info toast by default', async () => {
    render(<Toaster />);
    act(() => {
      toast('Hello');
    });
    await waitFor(() => {
      const node = document.querySelector('[data-sonner-toast][data-type="info"]');
      expect(node).not.toBeNull();
    });
  });

  it('toast.info marks the rendered toast as info', async () => {
    render(<Toaster />);
    act(() => {
      toast.info('Heads up');
    });
    await waitFor(() => {
      const node = document.querySelector('[data-sonner-toast][data-type="info"]');
      expect(node).not.toBeNull();
    });
  });

  it('toast.success marks the rendered toast as success', async () => {
    render(<Toaster />);
    act(() => {
      toast.success('Saved');
    });
    await waitFor(() => {
      const node = document.querySelector('[data-sonner-toast][data-type="success"]');
      expect(node).not.toBeNull();
    });
  });

  it('toast.warning marks the rendered toast as warning', async () => {
    render(<Toaster />);
    act(() => {
      toast.warning('Be careful');
    });
    await waitFor(() => {
      const node = document.querySelector('[data-sonner-toast][data-type="warning"]');
      expect(node).not.toBeNull();
    });
  });

  it('toast.danger maps to sonner error type so the danger styling renders', async () => {
    render(<Toaster />);
    act(() => {
      toast.danger('Something went wrong');
    });
    await waitFor(() => {
      const node = document.querySelector('[data-sonner-toast][data-type="error"]');
      expect(node).not.toBeNull();
    });
  });

  it('toast.dismiss removes a single toast by id', async () => {
    render(<Toaster />);
    let id: string | number = '';
    act(() => {
      id = toast.info('To be dismissed');
    });
    await waitFor(() => {
      expect(document.querySelector('[data-sonner-toast]')).not.toBeNull();
    });
    act(() => {
      toast.dismiss(id);
    });
    await waitFor(() => {
      const visible = document.querySelector(
        '[data-sonner-toast][data-removed="false"]',
      );
      expect(visible).toBeNull();
    });
  });
});
