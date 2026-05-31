// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Switch } from '../../../src/components/ds/Switch';

afterEach(() => cleanup());

describe('ds/Switch', () => {
  it('forwards ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} aria-label="Enable telemetry" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders with role=switch and reflects checked state via aria-checked', () => {
    render(<Switch defaultChecked aria-label="Enable telemetry" />);
    const sw = screen.getByRole('switch', { name: 'Enable telemetry' });
    expect(sw.getAttribute('aria-checked')).toBe('true');
  });

  it('toggles via the Space key', () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        aria-label="Enable telemetry"
        onCheckedChange={onCheckedChange}
      />,
    );
    const sw = screen.getByRole('switch', { name: 'Enable telemetry' });
    sw.focus();
    // Radix Switch listens for click semantics on Space + Enter via the
    // native `<button>`; jsdom does not synthesize a click from a keydown,
    // so we simulate the activation that the browser would trigger.
    fireEvent.keyDown(sw, { key: ' ', code: 'Space' });
    fireEvent.keyUp(sw, { key: ' ', code: 'Space' });
    fireEvent.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(sw.getAttribute('aria-checked')).toBe('true');
  });
});
