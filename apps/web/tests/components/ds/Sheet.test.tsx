// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '../../../src/components/ds/Sheet';

afterEach(() => cleanup());

describe('ds/Sheet', () => {
  it('forwards ref to the underlying content element when open', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Sheet defaultOpen>
        <SheetContent ref={ref} side="right" size="md">
          <SheetTitle>Preview</SheetTitle>
          <p>Body content</p>
        </SheetContent>
      </Sheet>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.classList.contains('ds-sheet-content')).toBe(true);
    expect(ref.current?.classList.contains('ds-sheet-side-right')).toBe(true);
    expect(ref.current?.classList.contains('ds-sheet-size-md')).toBe(true);
  });

  it('forwards ref to the trigger element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Sheet>
        <SheetTrigger ref={ref}>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Preview</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('closes when the user presses Escape', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetTitle>Preview</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    expect(screen.queryByRole('dialog')).not.toBeNull();

    act(() => {
      fireEvent.keyDown(document.activeElement ?? document.body, {
        key: 'Escape',
        code: 'Escape',
      });
    });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('applies the requested side and size classes', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Sheet defaultOpen>
        <SheetContent ref={ref} side="left" size="lg">
          <SheetTitle>Preview</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    expect(ref.current?.classList.contains('ds-sheet-side-left')).toBe(true);
    expect(ref.current?.classList.contains('ds-sheet-size-lg')).toBe(true);
  });
});
