// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Progress } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Progress', () => {
  it('forwards ref and exposes aria-valuenow when value provided', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={42} aria-label="Building" />);
    const bar = screen.getByRole('progressbar', { name: 'Building' });
    expect(ref.current).toBe(bar);
    expect(bar.getAttribute('aria-valuenow')).toBe('42');
  });

  it('renders indeterminate when value is omitted', () => {
    render(<Progress aria-label="Loading" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('data-indeterminate')).toBe('true');
    expect(bar.getAttribute('aria-valuenow')).toBeNull();
  });
});
