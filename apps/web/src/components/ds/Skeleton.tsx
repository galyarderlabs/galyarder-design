import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { cn } from './_internal/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Pre-set shape: text row, block (16:9), or circle. */
  shape?: 'text' | 'block' | 'circle';
  width?: number | string;
  height?: number | string;
}

/**
 * Loading placeholder. `aria-hidden` so screen readers don't
 * announce noise, shimmer animation collapses under reduced motion.
 *
 * @example
 *   <Skeleton shape="text" width="60%" />
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape = 'text', width, height, className, style, ...rest },
  ref,
) {
  const inline: CSSProperties = { ...style };
  if (width !== undefined) inline.width = width;
  if (height !== undefined) inline.height = height;
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('ds-skeleton', `ds-skeleton-${shape}`, className)}
      style={inline}
      {...rest}
    />
  );
});

Skeleton.displayName = 'Skeleton';
