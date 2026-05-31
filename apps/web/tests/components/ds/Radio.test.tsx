// @vitest-environment jsdom
//
// Feature: unified-design-system-redesign — Phase 1.5
// Validates: Requirements 2.1, 2.2, 2.3, 2.5, 2.6, 8.4 — Radio primitive
// Note: imports directly from the source files because the single index
// module is touched by Task 7.5.20 (export wiring) — Phase 1.5 primitives
// stand on their own files until that task lands.

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { createRef, useState } from 'react';

import { Radio, RadioItem } from '../../../src/components/ds/Radio';

afterEach(() => cleanup());

function ControlledRadio({
  initial = '',
  onChange,
}: {
  initial?: string;
  onChange?: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <Radio
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      aria-label="Tone"
    >
      <RadioItem value="warm">Warm</RadioItem>
      <RadioItem value="cool">Cool</RadioItem>
      <RadioItem value="neutral">Neutral</RadioItem>
    </Radio>
  );
}

describe('ds/Radio', () => {
  it('forwards ref on the group root to the radiogroup div', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Radio ref={ref} aria-label="Tone">
        <RadioItem value="warm">Warm</RadioItem>
      </Radio>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('radiogroup');
  });

  it('forwards ref on each item to the underlying radio button', () => {
    const itemRef = createRef<HTMLButtonElement>();
    render(
      <Radio aria-label="Tone">
        <RadioItem ref={itemRef} value="warm">
          Warm
        </RadioItem>
      </Radio>,
    );
    expect(itemRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(itemRef.current?.getAttribute('role')).toBe('radio');
  });

  it('moves selection through the group with ArrowDown and ArrowUp', async () => {
    const onChange = vi.fn();
    render(<ControlledRadio initial="warm" onChange={onChange} />);

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    const [warm, cool, neutral] = radios as [
      HTMLButtonElement,
      HTMLButtonElement,
      HTMLButtonElement,
    ];

    // Focus the currently-checked item, then press ArrowDown. Radix's
    // radiogroup pattern moves roving focus to the next item AND
    // selects it (focus + arrow-key both being held).
    warm.focus();
    expect(document.activeElement).toBe(warm);

    fireEvent.keyDown(warm, { key: 'ArrowDown' });
    await waitFor(() => {
      expect(document.activeElement).toBe(cool);
      expect(cool.getAttribute('aria-checked')).toBe('true');
    });
    expect(onChange).toHaveBeenLastCalledWith('cool');

    fireEvent.keyDown(cool, { key: 'ArrowDown' });
    await waitFor(() => {
      expect(document.activeElement).toBe(neutral);
      expect(neutral.getAttribute('aria-checked')).toBe('true');
    });
    expect(onChange).toHaveBeenLastCalledWith('neutral');

    fireEvent.keyDown(neutral, { key: 'ArrowUp' });
    await waitFor(() => {
      expect(document.activeElement).toBe(cool);
      expect(cool.getAttribute('aria-checked')).toBe('true');
    });
    expect(onChange).toHaveBeenLastCalledWith('cool');
  });

  it('exposes the group label and item names through ARIA', () => {
    render(<ControlledRadio initial="cool" />);
    const group = screen.getByRole('radiogroup', { name: 'Tone' });
    expect(group).toBeTruthy();
    // Labels come from the visible <label> wrapper via aria-labelledby.
    expect(screen.getByRole('radio', { name: 'Warm' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Cool' }).getAttribute('aria-checked')).toBe(
      'true',
    );
  });
});
