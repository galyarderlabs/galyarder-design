import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './_internal/cn';
import type { ButtonVariant, Size } from './types';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant | 'plain';
  size?: Size;
  /** Required for accessibility — the icon-only button has no visible label. */
  'aria-label': string;
  children: ReactNode;
}

/**
 * Square icon-only button. Requires `aria-label`. Native button so
 * keyboard activation works without explicit handlers.
 *
 * @example
 *   <IconButton aria-label="Close" onClick={onClose}>
 *     <Icon name="x" />
 *   </IconButton>
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'plain', size = 'md', className, type = 'button', children, ...rest },
  ref,
) {
  const variantClass = variant === 'plain' ? '' : `ds-icon-btn-${variant}`;
  return (
    <button
      ref={ref}
      type={type}
      className={cn('ds-icon-btn', 'ds-focus-ring', variantClass, `ds-icon-btn-${size}`, className)}
      {...rest}
    >
      {children}
    </button>
  );
});

IconButton.displayName = 'IconButton';
