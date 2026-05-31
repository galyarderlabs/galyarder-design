// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { createRef } from 'react';

import { Badge } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Badge', () => {
  it('forwards ref and applies variant + size classes', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} variant="success" size="sm">
        Live
      </Badge>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.classList.contains('ds-badge-success')).toBe(true);
    expect(ref.current?.classList.contains('ds-badge-sm')).toBe(true);
  });
});
