// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { NavItem, NavRail } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/NavRail', () => {
  it('forwards ref to the nav element and respects collapsed state', () => {
    const ref = createRef<HTMLElement>();
    render(
      <NavRail ref={ref} collapsed>
        <NavItem label="Home" />
      </NavRail>,
    );
    expect(ref.current?.tagName.toLowerCase()).toBe('nav');
    expect(ref.current?.getAttribute('data-collapsed')).toBe('true');
  });
});

describe('ds/NavItem', () => {
  it('exposes aria-current=page when active', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<NavItem ref={ref} label="Home" active />);
    expect(screen.getByRole('button', { current: 'page' })).toBeTruthy();
  });
});
