import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from './_internal/cn';
import type { Size } from './types';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: Size;
  /** Required for screen readers — the spinner is purely visual. */
  'aria-label'?: string;
}

/**
 * Indeterminate progress indicator. `role="status"` so assistive
 * tech announces it. Animation respects `prefers-reduced-motion`
 * via the duration token.
 *
 * @example
 *   <Spinner aria-label="Loading" />
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', className, 'aria-label': ariaLabel = 'Loading', ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={ariaLabel}
      className={cn('ds-spinner', `ds-spinner-${size}`, className)}
      {...rest}
    />
  );
});

Spinner.displayName = 'Spinner';
