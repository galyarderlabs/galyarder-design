// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { createRef } from 'react';

import { Checkbox } from '../../../src/components/ds/Checkbox';

afterEach(() => cleanup());

describe('ds/Checkbox', () => {
  it('forwards ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} aria-label="Accept terms" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders the unchecked state with role=checkbox', () => {
    const { container } = render(<Checkbox aria-label="Subscribe" />);
    const root = container.querySelector('button[role="checkbox"]');
    expect(root).toBeTruthy();
    expect(root?.getAttribute('data-state')).toBe('unchecked');
    expect(root?.getAttribute('aria-checked')).toBe('false');
  });

  it('reflects checked state via data-state and aria-checked', () => {
    const { container } = render(
      <Checkbox checked aria-label="Subscribe" />,
    );
    const root = container.querySelector('button[role="checkbox"]');
    expect(root?.getAttribute('data-state')).toBe('checked');
    expect(root?.getAttribute('aria-checked')).toBe('true');
  });

  it('surfaces indeterminate state via data-state="indeterminate"', () => {
    const { container } = render(
      <Checkbox checked="indeterminate" aria-label="Select all rows" />,
    );
    const root = container.querySelector('button[role="checkbox"]');
    expect(root?.getAttribute('data-state')).toBe('indeterminate');
    expect(root?.getAttribute('aria-checked')).toBe('mixed');
    // Indicator wrapper inherits the same data-state, which is what
    // CSS uses to swap which glyph is visible.
    const indicator = container.querySelector('.ds-checkbox-indicator');
    expect(indicator?.getAttribute('data-state')).toBe('indeterminate');
  });

  it('flags invalid state on the root button', () => {
    const { container } = render(
      <Checkbox invalid aria-label="Required" />,
    );
    const root = container.querySelector('button[role="checkbox"]');
    expect(root?.getAttribute('data-invalid')).toBe('true');
    expect(root?.getAttribute('aria-invalid')).toBe('true');
  });
});
