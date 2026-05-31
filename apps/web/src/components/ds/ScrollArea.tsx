import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from './_internal/cn';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional accessible label so the scroll region is announced as a landmark. */
  ariaLabel?: string;
  /** Extra class names forwarded to the inner viewport element. */
  viewportClassName?: string;
}

/**
 * Styled scroll container backed by `@radix-ui/react-scroll-area`.
 * Scrollbars are themed via `var(--border-strong)` / `var(--radius-full)`
 * tokens so they match the design system in both light and dark modes.
 *
 * When `ariaLabel` is provided the root element receives `role="region"`
 * so assistive technology announces it as a landmark.
 *
 * Phase 1.5: wraps `@radix-ui/react-scroll-area` (Root + Viewport +
 * Scrollbar + Thumb). The public prop signature is a strict superset of
 * the Phase 1 dep-free implementation (Property 11).
 *
 * @example
 *   <ScrollArea style={{ maxHeight: 320 }} ariaLabel="File list">…</ScrollArea>
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { ariaLabel, viewportClassName, className, role, children, style, dir, ...rest },
  ref,
) {
  // Radix Root expects dir?: 'ltr' | 'rtl'; HTMLAttributes<HTMLDivElement>
  // types dir as string | undefined. We narrow here so TypeScript is happy
  // while still forwarding the value.
  const radixDir = (dir === 'ltr' || dir === 'rtl') ? dir : undefined;
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      role={ariaLabel ? 'region' : role}
      aria-label={ariaLabel}
      className={cn('ds-scroll-area', className)}
      style={style}
      dir={radixDir}
      {...rest}
    >
      <ScrollAreaPrimitive.Viewport className={cn('ds-scroll-area-viewport', viewportClassName)}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        className="ds-scroll-area-scrollbar"
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className="ds-scroll-area-thumb" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Scrollbar
        className="ds-scroll-area-scrollbar"
        orientation="horizontal"
      >
        <ScrollAreaPrimitive.Thumb className="ds-scroll-area-thumb" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner className="ds-scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  );
});

ScrollArea.displayName = 'ScrollArea';
