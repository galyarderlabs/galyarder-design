// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';

import {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '../../../src/components/ds/Popover';

afterEach(() => cleanup());

describe('ds/Popover', () => {
  it('forwards ref to the underlying trigger button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Popover>
        <PopoverTrigger ref={ref}>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe('Open');
  });

  it('forwards ref to the floating content panel when open', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent ref={ref}>Panel body</PopoverContent>
      </Popover>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.classList.contains('ds-popover-content')).toBe(true);
    expect(ref.current?.textContent).toBe('Panel body');
  });

  it('defaults to non-modal so background interaction stays live (Req 2.1)', () => {
    // Non-modal means no aria-modal attribute on the content panel.
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent ref={ref}>Panel</PopoverContent>
      </Popover>,
    );
    expect(ref.current?.getAttribute('aria-modal')).toBeNull();
  });

  it('closes on Esc (Req 8.4)', () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>Filters</PopoverTrigger>
          <PopoverContent>
            <span data-testid="panel-body">Filter controls</span>
          </PopoverContent>
        </Popover>
      );
    }
    render(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Filters' });
    fireEvent.click(trigger);

    // Panel should now be in the DOM.
    expect(screen.getByTestId('panel-body')).toBeTruthy();

    // Dispatch Esc on the active element (Radix moves focus into the
    // content on open). Radix closes the popover.
    act(() => {
      fireEvent.keyDown(document.activeElement ?? document.body, {
        key: 'Escape',
        code: 'Escape',
      });
    });

    // Panel is removed from the DOM after close.
    expect(screen.queryByTestId('panel-body')).toBeNull();
  });

  it('exposes align, side, and sideOffset props on PopoverContent (Req 2.1)', () => {
    // Verify the props flow through without throwing.
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent ref={ref} align="start" side="top" sideOffset={12}>
          Positioned
        </PopoverContent>
      </Popover>,
    );
    expect(ref.current?.textContent).toBe('Positioned');
  });

  it('forwards ref to PopoverAnchor', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover>
        <PopoverAnchor ref={ref} />
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    );
    // Radix renders Anchor as a div when no asChild is used.
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('forwards ref to PopoverClose and clicking it dismisses the popover', () => {
    const ref = createRef<HTMLButtonElement>();
    const onOpenChange = vi.fn();
    render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverClose ref={ref}>Done</PopoverClose>
        </PopoverContent>
      </Popover>,
    );
    const closeBtn = screen.getByRole('button', { name: 'Done' });
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(closeBtn);

    // Clicking the close button dismisses the popover.
    fireEvent.click(closeBtn);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
