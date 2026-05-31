import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { Drawer as VaulDrawer } from 'vaul';

import { cn } from './_internal/cn';

/**
 * Direction the drawer slides in from.
 * `bottom` is the default — the canonical mobile-first sheet pattern.
 */
export type DrawerDirection = 'bottom' | 'top' | 'left' | 'right';

// ─── Re-exported vaul primitives ────────────────────────────────────────────

/**
 * Root of the drawer. Accepts vaul's full controlled / uncontrolled API
 * (`open`, `onOpenChange`, `defaultOpen`, `dismissible`, `snapPoints`, …).
 *
 * @example
 *   <Drawer>
 *     <DrawerTrigger asChild>
 *       <Button variant="secondary">Open drawer</Button>
 *     </DrawerTrigger>
 *     <DrawerContent>
 *       <DrawerHandle />
 *       <DrawerTitle>Filter options</DrawerTitle>
 *       <DrawerDescription>Adjust the filters below.</DrawerDescription>
 *     </DrawerContent>
 *   </Drawer>
 */
export const Drawer = VaulDrawer.Root;

export const DrawerPortal = VaulDrawer.Portal;

export const DrawerNestedRoot = VaulDrawer.NestedRoot;

// ─── DrawerTrigger ───────────────────────────────────────────────────────────

export type DrawerTriggerProps = ComponentPropsWithoutRef<typeof VaulDrawer.Trigger>;

/**
 * Element that opens the drawer. Pair with `asChild` to merge trigger
 * props onto a `Button` / `IconButton` so the affordance keeps its
 * semantics and styling.
 */
export const DrawerTrigger = forwardRef<
  ElementRef<typeof VaulDrawer.Trigger>,
  DrawerTriggerProps
>(function DrawerTrigger(props, ref) {
  return <VaulDrawer.Trigger ref={ref} {...props} />;
});
DrawerTrigger.displayName = 'DrawerTrigger';

// ─── DrawerClose ─────────────────────────────────────────────────────────────

export type DrawerCloseProps = ComponentPropsWithoutRef<typeof VaulDrawer.Close>;

/**
 * Imperative close affordance inside the drawer content. Pair with
 * `asChild` to attach onto an existing `Button` / `IconButton`.
 */
export const DrawerClose = forwardRef<
  ElementRef<typeof VaulDrawer.Close>,
  DrawerCloseProps
>(function DrawerClose(props, ref) {
  return <VaulDrawer.Close ref={ref} {...props} />;
});
DrawerClose.displayName = 'DrawerClose';

// ─── DrawerOverlay ───────────────────────────────────────────────────────────

export type DrawerOverlayProps = ComponentPropsWithoutRef<typeof VaulDrawer.Overlay>;

/**
 * Scrim rendered behind the drawer panel. Fades in/out using the
 * shared motion tokens; collapses to instant under reduced-motion
 * via the `tokens.css` `@media (prefers-reduced-motion: reduce)` rule.
 */
export const DrawerOverlay = forwardRef<
  ElementRef<typeof VaulDrawer.Overlay>,
  DrawerOverlayProps
>(function DrawerOverlay({ className, ...rest }, ref) {
  return (
    <VaulDrawer.Overlay
      ref={ref}
      className={cn('ds-drawer-overlay', className)}
      {...rest}
    />
  );
});
DrawerOverlay.displayName = 'DrawerOverlay';

// ─── DrawerHandle ────────────────────────────────────────────────────────────

export type DrawerHandleProps = ComponentPropsWithoutRef<typeof VaulDrawer.Handle>;

/**
 * Drag handle rendered at the top of the drawer panel. Vaul uses this
 * element as the drag target for the dismiss gesture.
 */
export const DrawerHandle = forwardRef<
  ElementRef<typeof VaulDrawer.Handle>,
  DrawerHandleProps
>(function DrawerHandle({ className, ...rest }, ref) {
  return (
    <VaulDrawer.Handle
      ref={ref}
      className={cn('ds-drawer-handle', className)}
      {...rest}
    />
  );
});
DrawerHandle.displayName = 'DrawerHandle';

// ─── DrawerContent ───────────────────────────────────────────────────────────

export interface DrawerContentProps
  extends ComponentPropsWithoutRef<typeof VaulDrawer.Content> {
  /**
   * Direction the drawer slides in from. Defaults to `bottom` (mobile-first
   * sheet). Pass `direction` to the parent `<Drawer>` root as well — vaul
   * requires both to agree.
   */
  direction?: DrawerDirection;
  /** Render the modal scrim behind the panel. Defaults to `true`. */
  overlay?: boolean;
  /** Optional class merged with the overlay scrim. */
  overlayClassName?: string;
  /** Children rendered inside the drawer panel. */
  children?: ReactNode;
}

/**
 * Drawer panel content. Wraps vaul's `Content` in a portal alongside an
 * optional `DrawerOverlay`. Styling resolves entirely through Token_Layer
 * custom properties — no hardcoded color, spacing, radius, or shadow
 * literals (Req 2.3).
 *
 * Motion tokens drive the entrance / exit animation; under
 * `prefers-reduced-motion: reduce` the `tokens.css` media query collapses
 * all `--duration-*` tokens to `0ms`, so transitions become instant without
 * any component-level branching (Req 2.5, Req 6.5).
 *
 * Z-index resolves through `var(--z-modal)` (Req 1.8, Req 1.9).
 *
 * @example
 *   <Drawer direction="bottom">
 *     <DrawerTrigger asChild>
 *       <Button>Open</Button>
 *     </DrawerTrigger>
 *     <DrawerContent direction="bottom">
 *       <DrawerHandle />
 *       <DrawerTitle>Actions</DrawerTitle>
 *       <DrawerDescription>Choose an action below.</DrawerDescription>
 *       <DrawerClose asChild>
 *         <Button variant="ghost">Dismiss</Button>
 *       </DrawerClose>
 *     </DrawerContent>
 *   </Drawer>
 */
export const DrawerContent = forwardRef<
  ElementRef<typeof VaulDrawer.Content>,
  DrawerContentProps
>(function DrawerContent(
  {
    direction = 'bottom',
    overlay = true,
    overlayClassName,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <VaulDrawer.Portal>
      {overlay ? (
        <DrawerOverlay className={overlayClassName} />
      ) : null}
      <VaulDrawer.Content
        ref={ref}
        className={cn(
          'ds-drawer-content',
          `ds-drawer-direction-${direction}`,
          className,
        )}
        {...rest}
      >
        {children}
      </VaulDrawer.Content>
    </VaulDrawer.Portal>
  );
});
DrawerContent.displayName = 'DrawerContent';

// ─── DrawerTitle ─────────────────────────────────────────────────────────────

export type DrawerTitleProps = ComponentPropsWithoutRef<typeof VaulDrawer.Title>;

/**
 * Required accessible name for the drawer. Renders an `<h2>` by default.
 * Vaul links this to the content panel via `aria-labelledby` automatically.
 */
export const DrawerTitle = forwardRef<
  ElementRef<typeof VaulDrawer.Title>,
  DrawerTitleProps
>(function DrawerTitle({ className, ...rest }, ref) {
  return (
    <VaulDrawer.Title
      ref={ref}
      className={cn('ds-drawer-title', className)}
      {...rest}
    />
  );
});
DrawerTitle.displayName = 'DrawerTitle';

// ─── DrawerDescription ───────────────────────────────────────────────────────

export type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof VaulDrawer.Description>;

/**
 * Optional supporting prose for the drawer. Linked via `aria-describedby`
 * automatically by vaul.
 */
export const DrawerDescription = forwardRef<
  ElementRef<typeof VaulDrawer.Description>,
  DrawerDescriptionProps
>(function DrawerDescription({ className, ...rest }, ref) {
  return (
    <VaulDrawer.Description
      ref={ref}
      className={cn('ds-drawer-description', className)}
      {...rest}
    />
  );
});
DrawerDescription.displayName = 'DrawerDescription';
