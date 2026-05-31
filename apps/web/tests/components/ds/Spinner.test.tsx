// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Spinner } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Spinner', () => {
  it('forwards ref and exposes role=status with the aria-label', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} aria-label="Loading projects" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByRole('status', { name: 'Loading projects' })).toBeTruthy();
  });
});
