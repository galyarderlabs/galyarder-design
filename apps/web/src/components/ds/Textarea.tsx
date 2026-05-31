import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from './_internal/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

/**
 * Multi-line text input. Native `<textarea>` so resize and scroll
 * behave per platform. Shell shares the focus-ring chrome with
 * `TextInput`.
 *
 * @example
 *   <Textarea rows={4} placeholder="Describe what you want to build" />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <span
      className={cn('ds-input', 'ds-textarea-shell', className)}
      data-invalid={invalid || undefined}
    >
      <textarea ref={ref} aria-invalid={invalid || undefined} {...rest} />
    </span>
  );
});

Textarea.displayName = 'Textarea';
