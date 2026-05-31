// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { MenuList } from '../../../src/components/ds/MenuList';

afterEach(() => cleanup());

describe('ds/MenuList', () => {
  it('forwards ref to the underlying trigger button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <MenuList>
        <MenuList.Trigger ref={ref}>Open</MenuList.Trigger>
        <MenuList.Content>
          <MenuList.Item>Rename</MenuList.Item>
        </MenuList.Content>
      </MenuList>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    // The trigger advertises its menu role to assistive tech.
    expect(ref.current?.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('forwards ref through Content and Item to their underlying DOM nodes when open', () => {
    const contentRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    render(
      <MenuList defaultOpen>
        <MenuList.Trigger>Open</MenuList.Trigger>
        <MenuList.Content ref={contentRef} align="end" side="bottom">
          <MenuList.Item ref={itemRef}>Rename</MenuList.Item>
          <MenuList.Separator />
          <MenuList.Item variant="danger">Delete</MenuList.Item>
        </MenuList.Content>
      </MenuList>,
    );
    // Radix portals Content into document.body, so query through screen.
    const menu = screen.getByRole('menu');
    expect(menu).toBeInstanceOf(HTMLElement);
    expect(contentRef.current).toBe(menu);
    // First item is highlightable and reachable via role lookup.
    const items = screen.getAllByRole('menuitem');
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(itemRef.current).toBe(items[0]);
  });

  it('renders the danger variant with a data-variant marker', () => {
    render(
      <MenuList defaultOpen>
        <MenuList.Trigger>Open</MenuList.Trigger>
        <MenuList.Content>
          <MenuList.Item variant="danger">Delete</MenuList.Item>
        </MenuList.Content>
      </MenuList>,
    );
    const item = screen.getByRole('menuitem', { name: 'Delete' });
    expect(item.getAttribute('data-variant')).toBe('danger');
  });
});
