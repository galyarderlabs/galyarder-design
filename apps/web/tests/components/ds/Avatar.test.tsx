// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Avatar } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Avatar', () => {
  it('forwards ref and exposes alt as accessible name', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} alt="Ada Lovelace" initials="AL" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeTruthy();
  });
});
