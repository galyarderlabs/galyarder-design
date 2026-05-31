import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from './_internal/cn';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 0..max. When omitted (or `null` / `NaN`) the bar renders
   * indeterminate. Phase 1 accepted `number | undefined`; this
   * upgrade widens to `number | null | undefined` per Property 11
   * (no narrowed type, so widening is allowed) so callers may
   * pass through Radix's `null = indeterminate` convention.
   */
  value?: number | null;
  /** Defaults to 100 (percent). */
  max?: number;
  /** Required for screen readers when no surrounding label exists. */
  'aria-label'?: string;
}

/**
 * Linear progress bar. Renders indeterminate animation when no
 * `value` is provided; reduced-motion collapses the animation.
 *
 * Phase 1.5: wraps `@radix-ui/react-progress` (Root + Indicator).
 * Radix supplies `role="progressbar"` and `aria-valuenow` /
 * `aria-valuemax` / `aria-valuemin` automatically; we additionally
 * set `data-indeterminate="true"` so the existing `ds-progress`
 * CSS (which keys the indeterminate animation off that attribute)
 * keeps working unchanged.
 *
 * @example
 *   <Progress value={42} aria-label="Building artifact" />
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, className, style, ...rest },
  ref,
) {
  const indeterminate =
    value === undefined || value === null || (typeof value === 'number' && Number.isNaN(value));
  // Pre-clamp into [0, max] so out-of-range values keep the Phase 1
  // behavior (silent clamp) instead of triggering Radix's
  // out-of-range console.error + null fallback.
  const safeMax = max > 0 && Number.isFinite(max) ? max : 100;
  const safeValue = indeterminate
    ? null
    : Math.max(0, Math.min(safeMax, value as number));
  const widthPct = indeterminate ? 30 : ((safeValue as number) / safeMax) * 100;
  const indicatorStyle: CSSProperties = { width: `${widthPct}%` };
  const rootStyle = style;
  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={safeValue}
      max={safeMax}
      className={cn('ds-progress', className)}
      style={rootStyle}
      data-indeterminate={indeterminate ? true : undefined}
      {...rest}
    >
      <ProgressPrimitive.Indicator className="ds-progress-bar" style={indicatorStyle} />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = 'Progress';
