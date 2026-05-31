// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Banner } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Banner', () => {
  it('forwards ref to the wrapping div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Banner ref={ref} title="Heads up" description="Something to read" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('uses role=alert for danger variant', () => {
    render(<Banner variant="danger" title="Failed" />);
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('uses role=status for info variant', () => {
    render(<Banner variant="info" title="Note" />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
