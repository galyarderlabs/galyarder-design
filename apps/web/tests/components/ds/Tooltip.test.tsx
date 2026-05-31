// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import {
  TOOLTIP_DEFAULT_DELAY_MS,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../src/components/ds/Tooltip';

afterEach(() => cleanup());

describe('ds/Tooltip', () => {
  it('forwards the trigger ref to the underlying button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger ref={ref}>Hover</TooltipTrigger>
          <TooltipContent>More info</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe('Hover');
  });

  it('forwards the content ref and exposes role=tooltip on open', async () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Open</TooltipTrigger>
          <TooltipContent ref={ref}>Save changes</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    // Radix announces the tooltip via a visually-hidden role=tooltip span
    // sibling, while the visible panel is the surrounding div the ref
    // points at. Both must mount, and our ref must reach the visible div
    // so callers can measure / position it.
    const srTip = await screen.findByRole('tooltip');
    expect(srTip.textContent).toBe('Save changes');
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.classList.contains('ds-tooltip')).toBe(true);
    expect(ref.current?.contains(srTip)).toBe(true);
  });

  it('uses the ~500ms default delay constant', () => {
    expect(TOOLTIP_DEFAULT_DELAY_MS).toBe(500);
  });

  it('keeps the panel mounted only while open (controlled)', async () => {
    function Harness() {
      return (
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipTrigger>Toggle</TooltipTrigger>
            <TooltipContent>Body</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    render(<Harness />);
    const tip = await screen.findByRole('tooltip');
    expect(tip.textContent).toBe('Body');

    // Pressing Escape on the trigger dismisses the tooltip via Radix.
    const trigger = screen.getByRole('button', { name: 'Toggle' });
    act(() => {
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'Escape' });
    });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
