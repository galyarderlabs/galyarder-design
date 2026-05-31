// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../../../src/components/ds/Dialog';

afterEach(() => cleanup());

describe('ds/Dialog', () => {
  it('forwards ref to the underlying content panel', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Dialog defaultOpen>
        <DialogContent ref={ref} aria-label="Settings">
          <DialogTitle>Settings</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.classList.contains('ds-dialog-content')).toBe(true);
    // Default size class is medium and the dismissable flag flows through
    // as a data-attribute so consumers can style off of it.
    expect(ref.current?.classList.contains('ds-dialog-content-md')).toBe(true);
    expect(ref.current?.getAttribute('data-dismissable')).toBe('true');
  });

  it('returns focus to the trigger when Esc closes a dismissable dialog', async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent aria-label="Settings">
            <DialogTitle>Settings</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      );
    }
    render(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Open' });
    fireEvent.click(trigger);

    // Radix renders the dialog into a portal; query by role to find it.
    const dialog = await screen.findByRole('dialog', { name: 'Settings' });
    expect(dialog).toBeTruthy();

    // Esc dispatched on the dialog node closes it. Radix returns focus to
    // the element that opened the dialog (Req 18.4 + Req 14.6).
    fireEvent.keyDown(dialog, { key: 'Escape' });

    await screen.findByRole('button', { name: 'Open' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('ignores Esc when dismissable=false (privacy modal contract, Req 18.4)', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <DialogContent dismissable={false} aria-label="Privacy">
          <DialogTitle>Privacy</DialogTitle>
          <DialogClose>Accept</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Privacy' });
    expect(dialog.getAttribute('data-dismissable')).toBe('false');

    fireEvent.keyDown(dialog, { key: 'Escape' });

    // The dialog stays mounted and onOpenChange was not invoked.
    expect(screen.getByRole('dialog', { name: 'Privacy' })).toBeTruthy();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
