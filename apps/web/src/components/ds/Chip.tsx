import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from './_internal/cn';
import type { Size } from './types';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  /** Pressed state — exposed via `aria-pressed`. */
  selected?: boolean;
}

/**
 * Toggle-able pill control. Selected state is exposed via
 * `aria-pressed` so screen readers announce the change.
 *
 * @example
 *   <Chip selected={isOn} onClick={() => setOn(!isOn)}>Code</Chip>
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { size = 'md', selected = false, className, type = 'button', disabled, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      className={cn('ds-chip', 'ds-focus-ring', `ds-chip-${size}`, className)}
      {...rest}
    >
      {children}
    </button>
  );
});

Chip.displayName = 'Chip';
