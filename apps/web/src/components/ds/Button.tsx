import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './_internal/cn';
import type { ButtonVariant, Size } from './types';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

/**
 * Primary action button. Native `<button>` underneath so Enter and
 * Space activate it without extra wiring. Variants pull color and
 * border from tokens; size and density-aware padding flow through
 * `--density-multiplier`.
 *
 * @example
 *   <Button variant="primary" leadingIcon={<Icon name="plus" />}>
 *     Create project
 *   </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    loading,
    leadingIcon,
    trailingIcon,
    className,
    type = 'button',
    children,
    disabled,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'ds-btn',
        'ds-focus-ring',
        `ds-btn-${variant}`,
        `ds-btn-${size}`,
        loading && 'ds-btn-loading',
        className,
      )}
      {...rest}
    >
      {leadingIcon ? <span aria-hidden>{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span aria-hidden>{trailingIcon}</span> : null}
    </button>
  );
});

Button.displayName = 'Button';
