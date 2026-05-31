// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';

import { ToggleGroup, ToggleGroupItem } from '../../../src/components/ds/ToggleGroup';

afterEach(() => cleanup());

describe('ds/ToggleGroup', () => {
  it('forwards ref to the underlying div root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ToggleGroup ref={ref} type="single" defaultValue="grid" aria-label="View mode">
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.classList.contains('ds-toggle-group')).toBe(true);
  });

  it('moves roving focus to the next item on right arrow', async () => {
    render(
      <ToggleGroup type="single" defaultValue="grid" aria-label="View mode">
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
      </ToggleGroup>,
    );

    const grid = screen.getByRole('radio', { name: 'Grid' });
    const list = screen.getByRole('radio', { name: 'List' });

    grid.focus();
    expect(document.activeElement).toBe(grid);

    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    // Radix roving-focus schedules the focus move in a setTimeout(0).
    await waitFor(() => expect(document.activeElement).toBe(list));
  });

  it('moves roving focus to the previous item on left arrow', async () => {
    render(
      <ToggleGroup type="single" defaultValue="list" aria-label="View mode">
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
      </ToggleGroup>,
    );

    const grid = screen.getByRole('radio', { name: 'Grid' });
    const list = screen.getByRole('radio', { name: 'List' });

    list.focus();
    expect(document.activeElement).toBe(list);

    fireEvent.keyDown(list, { key: 'ArrowLeft' });
    await waitFor(() => expect(document.activeElement).toBe(grid));
  });

  it('invokes onValueChange in single mode with the activated value', () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        type="single"
        defaultValue="grid"
        aria-label="View mode"
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
      </ToggleGroup>,
    );

    fireEvent.click(screen.getByRole('radio', { name: 'List' }));
    expect(onValueChange).toHaveBeenCalledWith('list');
  });

  it('renders multiple mode with role=group and exposes data-density', () => {
    render(
      <ToggleGroup
        type="multiple"
        defaultValue={[]}
        aria-label="Filters"
        density="compact"
      >
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );

    const group = screen.getByRole('group', { name: 'Filters' });
    expect(group.getAttribute('data-density')).toBe('compact');
    // In multiple mode each item is a button (not a radio).
    expect(screen.getByRole('button', { name: 'A' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'B' })).toBeTruthy();
  });
});
