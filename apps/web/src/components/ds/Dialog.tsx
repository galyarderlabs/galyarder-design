import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, FC } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';

import { cn } from './_internal/cn';

/**
 * Visual size of the modal panel. Drives `max-width` only;
 * height is intrinsic so short and tall dialogs sit centered
 * with the same horizontal scale.
 */
export type DialogSize = 'sm' | 'md' | 'lg';

/**
 * Root for the modal. Re-exported as `Dialog`. Mirrors Radix'
 * controlled / uncontrolled API one-to-one so callers can drive
 * `open` themselves (Req 18.5 dialog queue) or let the trigger
 * manage state.
 *
 * @example
 *   <Dialog>
 *     <DialogTrigger asChild>
 *       <Button>Open</Button>
 *     </DialogTrigger>
 *     <DialogContent size="md" aria-label="Settings">
 *       <DialogTitle>Settings</DialogTitle>
 *       <p>Body…</p>
 *       <DialogClose asChild>
 *         <Button variant="secondary">Close</Button>
 *       </DialogClose>
 *     </DialogContent>
 *   </Dialog>
 */
export const Dialog: FC<RadixDialog.DialogProps> = (props) => (
  <RadixDialog.Root {...props} />
);
Dialog.displayName = 'Dialog';

export type DialogTriggerProps = ComponentPropsWithoutRef<typeof RadixDialog.Trigger>;

/**
 * Element that opens the dialog. Pair with `asChild` to merge the
 * trigger props onto a `Button` / `IconButton` so the visible
 * affordance keeps its semantics and styling.
 */
export const DialogTrigger = forwardRef<
  ElementRef<typeof RadixDialog.Trigger>,
  DialogTriggerProps
>(function DialogTrigger(props, ref) {
  return <RadixDialog.Trigger ref={ref} {...props} />;
});
DialogTrigger.displayName = 'DialogTrigger';

export type DialogCloseProps = ComponentPropsWithoutRef<typeof RadixDialog.Close>;

/**
 * Imperative close affordance inside the content. Pair with
 * `asChild` to attach onto an existing button so the dismiss
 * affordance stays a `Button` / `IconButton` visually.
 */
export const DialogClose = forwardRef<
  ElementRef<typeof RadixDialog.Close>,
  DialogCloseProps
>(function DialogClose(props, ref) {
  return <RadixDialog.Close ref={ref} {...props} />;
});
DialogClose.displayName = 'DialogClose';

export type DialogTitleProps = ComponentPropsWithoutRef<typeof RadixDialog.Title>;

/**
 * Required accessible name for the modal. Renders an `<h2>` by
 * default. Use `asChild` if a different heading level is needed
 * for document outline.
 */
export const DialogTitle = forwardRef<
  ElementRef<typeof RadixDialog.Title>,
  DialogTitleProps
>(function DialogTitle({ className, ...rest }, ref) {
  return (
    <RadixDialog.Title
      ref={ref}
      className={cn('ds-dialog-title', className)}
      {...rest}
    />
  );
});
DialogTitle.displayName = 'DialogTitle';

export type DialogDescriptionProps = ComponentPropsWithoutRef<typeof RadixDialog.Description>;

/**
 * Optional supporting prose for the modal. Linked via `aria-describedby`
 * automatically by Radix.
 */
export const DialogDescription = forwardRef<
  ElementRef<typeof RadixDialog.Description>,
  DialogDescriptionProps
>(function DialogDescription({ className, ...rest }, ref) {
  return (
    <RadixDialog.Description
      ref={ref}
      className={cn('ds-dialog-description', className)}
      {...rest}
    />
  );
});
DialogDescription.displayName = 'DialogDescription';

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  /** Visual size of the panel. Defaults to `'md'`. */
  size?: DialogSize;
  /**
   * When `false`, Esc and outside-click are suppressed. Required by
   * the privacy consent modal (Req 18.4) which forces the user to
   * make an explicit accept / decline decision. Focus trap, page
   * scroll lock, and the close affordance still work.
   * @default true
   */
  dismissable?: boolean;
}

/**
 * Modal dialog content. Wraps its overlay + panel in the default
 * portal and applies the design-system focus contract:
 *
 * - Focus is trapped inside the panel while open (Req 18.4).
 * - Initial focus lands on the first interactive control, courtesy
 *   of Radix' `FocusScope`.
 * - On close, focus returns to the trigger (Req 18.4 + Req 14.6 +
 *   Req 32.4).
 * - Esc closes the dialog when `dismissable` is `true`; when `false`,
 *   Esc and outside-click are no-ops so the user must commit through
 *   an in-content control.
 *
 * @example
 *   <DialogContent size="lg" aria-labelledby="updater-title">
 *     <DialogTitle id="updater-title">Update available</DialogTitle>
 *     <DialogDescription>Release notes…</DialogDescription>
 *     <DialogClose asChild>
 *       <Button>Got it</Button>
 *     </DialogClose>
 *   </DialogContent>
 */
export const DialogContent = forwardRef<
  ElementRef<typeof RadixDialog.Content>,
  DialogContentProps
>(function DialogContent(
  {
    size = 'md',
    dismissable = true,
    className,
    children,
    onEscapeKeyDown,
    onPointerDownOutside,
    onInteractOutside,
    ...rest
  },
  ref,
) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="ds-dialog-overlay" />
      <RadixDialog.Content
        ref={ref}
        data-size={size}
        data-dismissable={dismissable ? 'true' : 'false'}
        className={cn(
          'ds-dialog-content',
          `ds-dialog-content-${size}`,
          'ds-focus-ring',
          className,
        )}
        onEscapeKeyDown={(event) => {
          if (!dismissable) {
            event.preventDefault();
          }
          onEscapeKeyDown?.(event);
        }}
        onPointerDownOutside={(event) => {
          if (!dismissable) {
            event.preventDefault();
          }
          onPointerDownOutside?.(event);
        }}
        onInteractOutside={(event) => {
          if (!dismissable) {
            event.preventDefault();
          }
          onInteractOutside?.(event);
        }}
        {...rest}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
});
DialogContent.displayName = 'DialogContent';
