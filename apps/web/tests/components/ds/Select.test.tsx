// @vitest-environment jsdom
//
// Feature: unified-design-system-redesign — Phase 1.5
// Validates: Requirements 2.1, 2.2, 2.3, 2.5, 2.6, 8.4 — Select primitive
//
// Note: imports directly from the source files because the single index
// module is touched by Task 7.5.20 (export wiring) — Phase 1.5 primitives
// are not yet re-exported from `../../../src/components/ds`.

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Select, SelectItem } from '../../../src/components/ds/Select';

afterEach(() => cleanup());

describe('ds/Select', () => {
  it('forwards ref to the underlying trigger button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Select ref={ref} placeholder="Choose tone" aria-label="Tone">
        <SelectItem value="warm">Warm</SelectItem>
        <SelectItem value="cool">Cool</SelectItem>
      </Select>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    // Radix renders the trigger as `role="combobox"` per the
    // ARIA combobox-with-listbox pattern.
    expect(ref.current?.getAttribute('role')).toBe('combobox');
  });

  it('renders the trigger with the supplied accessible name and placeholder', () => {
    render(
      <Select placeholder="Choose tone" aria-label="Tone">
        <SelectItem value="warm">Warm</SelectItem>
      </Select>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Tone' });
    // Placeholder is the trigger's visible text when no value is set.
    expect(trigger.textContent).toContain('Choose tone');
    expect(trigger.hasAttribute('data-placeholder')).toBe(true);
  });

  it('applies the size data attribute and the design-system class on the trigger', () => {
    render(
      <Select size="lg" placeholder="Pick" aria-label="Pick">
        <SelectItem value="a">A</SelectItem>
      </Select>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Pick' });
    expect(trigger.getAttribute('data-size')).toBe('lg');
    expect(trigger.classList.contains('ds-select-trigger')).toBe(true);
    expect(trigger.classList.contains('ds-select-trigger-lg')).toBe(true);
  });
});
