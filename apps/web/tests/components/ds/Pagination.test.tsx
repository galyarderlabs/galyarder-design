// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Pagination } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Pagination', () => {
  it('forwards ref to the nav', () => {
    const ref = createRef<HTMLElement>();
    const onPageChange = vi.fn();
    render(
      <Pagination
        ref={ref}
        total={100}
        page={1}
        pageSize={10}
        onPageChange={onPageChange}
      />,
    );
    expect(ref.current?.tagName.toLowerCase()).toBe('nav');
  });

  it('moves to the next page on right arrow', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination total={100} page={2} pageSize={10} onPageChange={onPageChange} />,
    );
    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    fireEvent.keyDown(nav, { key: 'ArrowRight' });
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
