import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from './_internal/cn';
import type { Size } from './types';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  size?: Size;
}

/**
 * Inline keyboard shortcut hint.
 *
 * @example
 *   Press <Kbd>Cmd</Kbd> + <Kbd>K</Kbd> to open quick switcher.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { size = 'sm', className, children, ...rest },
  ref,
) {
  return (
    <kbd ref={ref} className={cn('ds-kbd', `ds-kbd-${size}`, className)} {...rest}>
      {children}
    </kbd>
  );
});

Kbd.displayName = 'Kbd';
