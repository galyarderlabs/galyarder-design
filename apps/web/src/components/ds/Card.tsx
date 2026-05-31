import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from './_internal/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: 'flat' | 'resting' | 'raised';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Container surface. Tokens-driven background, border, radius.
 * `overflow-wrap: anywhere` keeps long CJK / URL strings from
 * extending past the inner padding box (Req 7.3).
 *
 * @example
 *   <Card elevation="resting" padding="md">…</Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { elevation = 'flat', padding = 'md', className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('ds-card', `ds-card-${elevation}`, `ds-card-padding-${padding}`, className)}
      {...rest}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
