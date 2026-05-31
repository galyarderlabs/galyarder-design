// @vitest-environment jsdom

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Combobox } from '../../../src/components/ds/Combobox';

// jsdom does not ship ResizeObserver; cmdk reads it during render.
// jsdom also does not implement scrollIntoView; cmdk calls it on the
// highlighted list item during layout effects.
beforeAll(() => {
  const w = globalThis as unknown as { ResizeObserver?: unknown };
  if (typeof w.ResizeObserver === 'undefined') {
    w.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  // Stub scrollIntoView on the Element prototype so cmdk's layout
  // effect does not throw in jsdom.
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

afterEach(() => cleanup());

const ITEMS = [
  { value: 'english', label: 'English' },
  { value: 'japanese', label: '日本語', keywords: ['japanese', 'ja'] },
  { value: 'arabic', label: 'العربية', keywords: ['arabic', 'ar'] },
];

describe('ds/Combobox', () => {
  it('forwards ref to the underlying input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Combobox ref={ref} items={ITEMS} placeholder="Search locales" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('renders every supplied item by default', () => {
    render(<Combobox items={ITEMS} placeholder="Search" />);
    expect(screen.getByText('English')).toBeTruthy();
    expect(screen.getByText('日本語')).toBeTruthy();
    expect(screen.getByText('العربية')).toBeTruthy();
  });

  it('filters items case-insensitively against value and keywords', () => {
    render(<Combobox items={ITEMS} placeholder="Search" />);
    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;

    // Mixed-case query that only matches via the `keywords` array.
    fireEvent.change(input, { target: { value: 'JaPaN' } });

    // The matching row stays visible.
    expect(screen.queryByText('日本語')).toBeTruthy();
    // Non-matching rows drop out of the visible list.
    expect(screen.queryByText('English')).toBeNull();
    expect(screen.queryByText('العربية')).toBeNull();
  });

  it('renders the empty state when no items match', () => {
    render(
      <Combobox items={ITEMS} placeholder="Search" emptyState="No locales match" />,
    );
    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'zzzz-no-match' } });

    expect(screen.getByText('No locales match')).toBeTruthy();
  });

  it('emits onValueChange when an item is selected via Enter', () => {
    const onValueChange = vi.fn();
    render(
      <Combobox
        items={ITEMS}
        placeholder="Search"
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;

    // Type to focus the matching row, then commit.
    fireEvent.change(input, { target: { value: 'eng' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onValueChange).toHaveBeenCalled();
    // First positional arg is the picked value.
    expect(onValueChange.mock.calls[0]?.[0]).toBe('english');
  });
});
