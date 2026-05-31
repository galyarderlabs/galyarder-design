// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Button } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Button', () => {
  it('forwards ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Continue</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders the primary variant with the token-driven class', () => {
    render(<Button variant="primary">Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn.classList.contains('ds-btn-primary')).toBe(true);
  });

  it('marks itself as busy and disables when loading', () => {
    render(
      <Button loading variant="primary">
        Saving
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('aria-busy')).toBe('true');
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });
});
