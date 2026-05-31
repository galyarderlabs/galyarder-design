import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from './_internal/cn';

/**
 * Default open delay for `<Tooltip>`. Radix's own default is 700ms;
 * the design doc and Req 7.5 call for ~500ms so the truncation
 * affordance surfaces predictably without firing on accidental
 * pointer-overs.
 */
export const TOOLTIP_DEFAULT_DELAY_MS = 500;

/**
 * Default offset (px) between the trigger and the tooltip content.
 * Picked to clear the focus ring without floating off the trigger.
 */
const TOOLTIP_DEFAULT_SIDE_OFFSET = 6;

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipProviderProps extends TooltipPrimitive.TooltipProviderProps {}

/**
 * App-root provider for Radix tooltips. Mount once near the root so
 * every `<Tooltip>` shares the ~500ms delay and the skip-delay grace
 * window. Individual `<Tooltip>` instances may still override
 * `delayDuration`.
 *
 * @example
 *   <TooltipProvider>
 *     <App />
 *   </TooltipProvider>
 */
export function TooltipProvider({
  delayDuration = TOOLTIP_DEFAULT_DELAY_MS,
  ...rest
}: TooltipProviderProps) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...rest} />;
}

export interface TooltipProps extends TooltipPrimitive.TooltipProps {}

/**
 * Tooltip root. Composes Radix's `Provider` + `Root` so a single
 * `<Tooltip>` works without an outer provider, and defaults
 * `delayDuration` to ~500ms (Req 7.5). When several tooltips are
 * mounted under a shared `<TooltipProvider>`, that provider's
 * `skipDelayDuration` controls the grace window; this wrapper still
 * accepts a per-instance `delayDuration` override.
 *
 * @example
 *   <Tooltip>
 *     <TooltipTrigger asChild>
 *       <IconButton aria-label="Save" icon={<Icon name="save" />} />
 *     </TooltipTrigger>
 *     <TooltipContent>Save changes</TooltipContent>
 *   </Tooltip>
 */
export function Tooltip({ delayDuration = TOOLTIP_DEFAULT_DELAY_MS, ...rest }: TooltipProps) {
  return <TooltipPrimitive.Root delayDuration={delayDuration} {...rest} />;
}

export interface TooltipTriggerProps extends TooltipPrimitive.TooltipTriggerProps {}

/**
 * Tooltip trigger. Forwards its ref to the underlying element so
 * callers can measure / focus the trigger directly. Pair with
 * `asChild` to attach the tooltip to an existing focusable control
 * (Button, IconButton, etc.) without introducing an extra wrapper.
 *
 * @example
 *   <TooltipTrigger asChild>
 *     <button type="button">Hover me</button>
 *   </TooltipTrigger>
 */
export const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  function TooltipTrigger(props, ref) {
    return <TooltipPrimitive.Trigger ref={ref} {...props} />;
  },
);

TooltipTrigger.displayName = 'TooltipTrigger';

export interface TooltipContentProps extends TooltipPrimitive.TooltipContentProps {
  /** Render the floating panel into a portal. Defaults to true. */
  withPortal?: boolean;
  /** Optional portal container override (e.g. a scoped root). */
  portalContainer?: ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>['container'];
  /** Optional decorative arrow rendered inside the content panel. */
  arrow?: boolean;
}

/**
 * Tooltip content panel. Carries `role="tooltip"` from Radix,
 * stacks at `var(--z-overlay)` via the `ds-tooltip` class, and
 * renders into a portal by default so the panel escapes ancestor
 * `overflow: hidden` stacking contexts. Forwards `ref` to the
 * floating `<div>`.
 *
 * @example
 *   <TooltipContent side="top" sideOffset={8}>
 *     Open settings
 *   </TooltipContent>
 */
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(
    {
      className,
      sideOffset = TOOLTIP_DEFAULT_SIDE_OFFSET,
      side = 'top',
      align = 'center',
      withPortal = true,
      portalContainer,
      arrow,
      children,
      ...rest
    },
    ref,
  ) {
    const content: ReactNode = (
      <TooltipPrimitive.Content
        ref={ref}
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn('ds-tooltip', className)}
        {...rest}
      >
        {children}
        {arrow ? <TooltipPrimitive.Arrow className="ds-tooltip-arrow" /> : null}
      </TooltipPrimitive.Content>
    );

    if (!withPortal) return content;

    return (
      <TooltipPrimitive.Portal container={portalContainer}>{content}</TooltipPrimitive.Portal>
    );
  },
);

TooltipContent.displayName = 'TooltipContent';
