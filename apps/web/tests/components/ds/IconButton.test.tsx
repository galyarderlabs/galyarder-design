// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { IconButton } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/IconButton', () => {
  it('forwards ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton ref={ref} aria-label="Close">
        <span aria-hidden>×</span>
      </IconButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('exposes the aria-label as the accessible name', () => {
    render(
      <IconButton aria-label="Close">
        <span aria-hidden>×</span>
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
  });
});
