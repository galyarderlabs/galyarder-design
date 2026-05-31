import { forwardRef } from 'react';
import type {
  ComponentPropsWithoutRef,
  ElementRef,
} from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { cn } from './_internal/cn';

export interface PopoverProps extends RadixPopover.PopoverProps {}

/**
 * Popover root. Built on `@radix-ui/react-popover` so the keyboard
 * contract is native: Esc closes, focus returns to the trigger,
 * outside clicks dismiss. Defaults to non-modal so background
 * scroll and focus stay live for hover-rich surfaces (file viewer,
 * tweaks rail). Pass `modal` only when the popover should trap
 * focus and block background interaction.
 *
 * Visual styling resolves through Token_Layer custom properties;
 * the portal-mounted content layer uses `var(--z-overlay)` so the
 * z-index ordering is enforced through the named scale.
 *
 * @example
 *   <Popover>
 *     <PopoverTrigger asChild>
 *       <Button>Filters</Button>
 *     </PopoverTrigger>
 *     <PopoverContent align="start" sideOffset={8}>
 *       …filter controls…
 *     </PopoverContent>
 *   </Popover>
 */
export function Popover({ modal = false, ...rest }: PopoverProps) {
  return <RadixPopover.Root modal={modal} {...rest} />;
}

Popover.displayName = 'Popover';

export type PopoverTriggerProps = ComponentPropsWithoutRef<typeof RadixPopover.Trigger>;

/**
 * Trigger control that opens the popover. Renders a native button
 * by default; pass `asChild` to compose around an existing
 * focusable element.
 *
 * @example
 *   <PopoverTrigger asChild>
 *     <IconButton aria-label="More options"><Icon name="more" /></IconButton>
 *   </PopoverTrigger>
 */
export const PopoverTrigger = forwardRef<
  ElementRef<typeof RadixPopover.Trigger>,
  PopoverTriggerProps
>(function PopoverTrigger({ className, ...rest }, ref) {
  return (
    <RadixPopover.Trigger
      ref={ref}
      className={cn('ds-popover-trigger', 'ds-focus-ring', className)}
      {...rest}
    />
  );
});

PopoverTrigger.displayName = 'PopoverTrigger';

export interface PopoverContentProps
  extends ComponentPropsWithoutRef<typeof RadixPopover.Content> {
  /**
   * Wrap the content in a `RadixPopover.Portal` so the floating
   * layer escapes overflow / transform ancestors. Defaults to
   * `true`. Set to `false` only when an enclosing layout deliberately
   * needs the content to stay in-flow (rare).
   */
  portalled?: boolean;
}

/**
 * Floating content surface. `align`, `side`, and `sideOffset` flow
 * straight through to Radix so callers get the full positioning
 * vocabulary (`align: 'start' | 'center' | 'end'`, `side: 'top' |
 * 'right' | 'bottom' | 'left'`, numeric `sideOffset`). Esc closes;
 * outside click dismisses; focus returns to the trigger on close.
 *
 * @example
 *   <PopoverContent align="end" side="bottom" sideOffset={6}>
 *     <ul role="list">…</ul>
 *   </PopoverContent>
 */
export const PopoverContent = forwardRef<
  ElementRef<typeof RadixPopover.Content>,
  PopoverContentProps
>(function PopoverContent(
  {
    portalled = true,
    align = 'center',
    side = 'bottom',
    sideOffset = 8,
    collisionPadding = 8,
    className,
    children,
    ...rest
  },
  ref,
) {
  const content = (
    <RadixPopover.Content
      ref={ref}
      align={align}
      side={side}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn('ds-popover-content', className)}
      {...rest}
    >
      {children}
    </RadixPopover.Content>
  );

  return portalled ? <RadixPopover.Portal>{content}</RadixPopover.Portal> : content;
});

PopoverContent.displayName = 'PopoverContent';

export type PopoverAnchorProps = ComponentPropsWithoutRef<typeof RadixPopover.Anchor>;

/**
 * Optional anchor for the floating content. When omitted, Radix
 * anchors the content to `PopoverTrigger`. Use this to anchor a
 * popover to a different DOM region (for example, a virtual cursor
 * inside a chart or a custom selection range).
 *
 * @example
 *   <PopoverAnchor virtualRef={cursorRef} />
 */
export const PopoverAnchor = forwardRef<
  ElementRef<typeof RadixPopover.Anchor>,
  PopoverAnchorProps
>(function PopoverAnchor({ className, ...rest }, ref) {
  return (
    <RadixPopover.Anchor
      ref={ref}
      className={cn('ds-popover-anchor', className)}
      {...rest}
    />
  );
});

PopoverAnchor.displayName = 'PopoverAnchor';

export type PopoverCloseProps = ComponentPropsWithoutRef<typeof RadixPopover.Close>;

/**
 * Convenience close trigger inside the content. Useful for an
 * explicit "Done" button next to inline form controls.
 *
 * @example
 *   <PopoverClose asChild>
 *     <Button variant="ghost">Done</Button>
 *   </PopoverClose>
 */
export const PopoverClose = forwardRef<
  ElementRef<typeof RadixPopover.Close>,
  PopoverCloseProps
>(function PopoverClose({ className, ...rest }, ref) {
  return (
    <RadixPopover.Close
      ref={ref}
      className={cn('ds-popover-close', 'ds-focus-ring', className)}
      {...rest}
    />
  );
});

PopoverClose.displayName = 'PopoverClose';
