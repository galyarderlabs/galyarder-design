// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { Icon } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Icon', () => {
  it('renders the lucide-react component at the requested size', () => {
    const { container } = render(<Icon name="Plus" size={20} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('20');
    expect(svg?.getAttribute('height')).toBe('20');
    expect(svg?.getAttribute('stroke-width')).toBe('1.5');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('exposes aria-label when a label is provided', () => {
    const { container } = render(<Icon name="X" size={16} label="Close" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toBe('Close');
    expect(svg?.getAttribute('aria-hidden')).toBeNull();
  });
});
