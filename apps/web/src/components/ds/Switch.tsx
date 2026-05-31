import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from './_internal/cn';
import type { Size } from './types';

export interface SwitchProps
  extends ComponentPropsWithoutRef<typeof RadixSwitch.Root> {
  /** Visual size of the track and thumb. Defaults to `md`. */
  size?: Size;
}

/**
 * Boolean on/off control built on `@radix-ui/react-switch`. The
 * underlying element is a native `<button>` with `role="switch"`
 * and `aria-checked` reflecting the current state, so Tab focuses
 * it and Space toggles it without extra wiring. The thumb position
 * is driven by `data-state="checked|unchecked"` on the root.
 *
 * @example
 *   <Switch
 *     defaultChecked
 *     aria-label="Enable telemetry"
 *     onCheckedChange={(next) => setTelemetry(next)}
 *   />
 */
export const Switch = forwardRef<
  ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(function Switch({ size = 'md', className, ...rest }, ref) {
  return (
    <RadixSwitch.Root
      ref={ref}
      data-size={size}
      className={cn('ds-switch', 'ds-focus-ring', className)}
      {...rest}
    >
      <RadixSwitch.Thumb className="ds-switch-thumb" />
    </RadixSwitch.Root>
  );
});

Switch.displayName = 'Switch';
