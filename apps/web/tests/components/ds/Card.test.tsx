// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { createRef } from 'react';

import { Card } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Card', () => {
  it('forwards ref to the underlying div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>contents</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies elevation and padding modifier classes', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} elevation="raised" padding="lg">
        contents
      </Card>,
    );
    expect(ref.current?.classList.contains('ds-card-raised')).toBe(true);
    expect(ref.current?.classList.contains('ds-card-padding-lg')).toBe(true);
  });
});
