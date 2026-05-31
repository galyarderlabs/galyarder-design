// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Chip } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Chip', () => {
  it('forwards ref and reflects selected via aria-pressed', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Chip ref={ref} selected>
        Code
      </Chip>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByRole('button', { name: 'Code', pressed: true })).toBeTruthy();
  });
});
