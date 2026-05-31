import { forwardRef } from 'react';
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { cn } from './_internal/cn';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** When provided, renders a small remove control with this label. */
  removeLabel?: string;
  onRemove?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

/**
 * Compact label, optionally removable.
 *
 * @example
 *   <Tag onRemove={() => detach('typescript')} removeLabel="Remove typescript">
 *     typescript
 *   </Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { removeLabel, onRemove, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cn('ds-tag', className)} {...rest}>
      <span>{children}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel ?? 'Remove'}
          className="ds-tag-remove ds-focus-ring"
          onClick={onRemove}
        >
          ×
        </button>
      ) : null}
    </span>
  );
});

Tag.displayName = 'Tag';
