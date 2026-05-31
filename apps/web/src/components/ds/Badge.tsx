import { forwardRef } from 'react';
import { cn } from './_internal/cn';
import type { BadgeVariant, Size } from './types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: Size;
}

/**
 * Inline decorative tag for status / category / counts.
 *
 * @example
 *   <Badge variant="success">Live</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'neutral', size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn('ds-badge', `ds-badge-${variant}`, `ds-badge-${size}`, className)}
      {...rest}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
