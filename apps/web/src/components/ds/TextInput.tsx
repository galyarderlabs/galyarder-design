import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from './_internal/cn';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional element rendered before the input (typically an Icon). */
  leadingIcon?: ReactNode;
  /** Optional element rendered after the input. */
  trailingSlot?: ReactNode;
  /** Marks the field as invalid. Sets `aria-invalid` and the danger border. */
  invalid?: boolean;
}

/**
 * Single-line text input. The wrapping shell carries the focus-ring
 * box-shadow so leading/trailing slots stay visually unified.
 *
 * @example
 *   <TextInput placeholder="Search projects" leadingIcon={<Icon name="Search" size={16} />} />
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { leadingIcon, trailingSlot, invalid, className, type = 'text', ...rest },
  ref,
) {
  return (
    <span className={cn('ds-input', className)} data-invalid={invalid || undefined}>
      {leadingIcon ? <span className="ds-input-leading">{leadingIcon}</span> : null}
      <input ref={ref} type={type} aria-invalid={invalid || undefined} {...rest} />
      {trailingSlot ? <span className="ds-input-trailing">{trailingSlot}</span> : null}
    </span>
  );
});

TextInput.displayName = 'TextInput';
