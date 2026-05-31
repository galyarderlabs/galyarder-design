// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
} from '../../../src/components/ds/Drawer';

afterEach(() => cleanup());

describe('ds/Drawer', () => {
  it('forwards ref to the underlying content element when open', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Drawer open>
        <DrawerContent ref={ref} direction="bottom">
          <DrawerTitle>Filter options</DrawerTitle>
          <p>Body content</p>
        </DrawerContent>
      </Drawer>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.classList.contains('ds-drawer-content')).toBe(true);
    expect(ref.current?.classList.contains('ds-drawer-direction-bottom')).toBe(true);
  });

  it('forwards ref to the trigger element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Drawer>
        <DrawerTrigger ref={ref}>Open drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Filter options</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('forwards ref to the close element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle>Filter options</DrawerTitle>
          <DrawerClose ref={ref}>Dismiss</DrawerClose>
        </DrawerContent>
      </Drawer>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('forwards ref to the handle element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerHandle ref={ref} />
          <DrawerTitle>Filter options</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.classList.contains('ds-drawer-handle')).toBe(true);
  });

  it('forwards ref to the title element', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle ref={ref}>Filter options</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    expect(ref.current?.classList.contains('ds-drawer-title')).toBe(true);
  });

  it('forwards ref to the description element', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle>Filter options</DrawerTitle>
          <DrawerDescription ref={ref}>Adjust the filters below.</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    expect(ref.current?.classList.contains('ds-drawer-description')).toBe(true);
  });

  it('applies direction class for non-default directions', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Drawer open direction="right">
        <DrawerContent ref={ref} direction="right">
          <DrawerTitle>Side panel</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    expect(ref.current?.classList.contains('ds-drawer-direction-right')).toBe(true);
  });

  it('renders the drawer title with accessible text when open', () => {
    render(
      <Drawer open>
        <DrawerContent direction="bottom">
          <DrawerTitle>Filter options</DrawerTitle>
          <DrawerDescription>Adjust the filters below.</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );
    expect(screen.getByText('Filter options')).toBeTruthy();
    expect(screen.getByText('Adjust the filters below.')).toBeTruthy();
  });

  it('does not render content when closed', () => {
    render(
      <Drawer open={false}>
        <DrawerContent direction="bottom">
          <DrawerTitle>Hidden drawer</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    // vaul does not mount the portal content when closed
    expect(screen.queryByText('Hidden drawer')).toBeNull();
  });
});
