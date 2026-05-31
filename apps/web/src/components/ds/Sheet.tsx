import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
  Portal as DialogPortal,
  Overlay as DialogOverlay,
  Content as DialogContent,
  Close as DialogClose,
  Title as DialogTitle,
  Description as DialogDescription,
} from '@radix-ui/react-dialog';
import { cn } from './_internal/cn';
import type { Size } from './types';

/**
 * Sides a `Sheet` may slide in from. Right is the default
 * because most product surfaces (Design System gallery preview,
 * Skill detail) use side="right" per the design doc.
 */
export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

export interface SheetContentProps
  extends Omit<ComponentPropsWithoutRef<typeof DialogContent>, 'asChild'> {
  /** Edge the sheet slides in from. Defaults to `right`. */
  side?: SheetSide;
  /** Sheet thickness on the sliding axis. Defaults to `md`. */
  size?: Size;
  /** Render the modal scrim behind the sheet. Defaults to `true`. */
  overlay?: boolean;
  /** Optional class merged with the overlay scrim. */
  overlayClassName?: string;
  /** Children rendered inside the sheet panel. */
  children?: ReactNode;
}

/**
 * `Sheet` is a side-mounted dialog backed by `@radix-ui/react-dialog`.
 * It inherits Radix's focus trap and Escape-to-close behavior, and
 * styles every visual property through Token_Layer custom properties
 * (`--surface-1`, `--shadow-floating`, `--z-modal`, motion tokens).
 *
 * The shape mirrors Radix Dialog: compose `Sheet` (root) +
 * `SheetTrigger` + `SheetContent`, with optional `SheetTitle` /
 * `SheetDescription` / `SheetClose` from the same module.
 *
 * @example
 *   <Sheet>
 *     <SheetTrigger asChild>
 *       <Button variant="secondary">Open preview</Button>
 *     </SheetTrigger>
 *     <SheetContent side="right" size="md">
 *       <SheetTitle>Design system preview</SheetTitle>
 *       <SheetDescription>Tokens, components, and patterns.</SheetDescription>
 *     </SheetContent>
 *   </Sheet>
 */
export const Sheet = DialogRoot;

export const SheetPortal = DialogPortal;

export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;

export const SheetTrigger = forwardRef<
  ElementRef<typeof DialogTrigger>,
  ComponentPropsWithoutRef<typeof DialogTrigger>
>(function SheetTrigger(props, ref) {
  return <DialogTrigger ref={ref} {...props} />;
});
SheetTrigger.displayName = 'SheetTrigger';

export const SheetClose = forwardRef<
  ElementRef<typeof DialogClose>,
  ComponentPropsWithoutRef<typeof DialogClose>
>(function SheetClose(props, ref) {
  return <DialogClose ref={ref} {...props} />;
});
SheetClose.displayName = 'SheetClose';

export const SheetContent = forwardRef<
  ElementRef<typeof DialogContent>,
  SheetContentProps
>(function SheetContent(
  {
    side = 'right',
    size = 'md',
    overlay = true,
    overlayClassName,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <DialogPortal>
      {overlay ? (
        <DialogOverlay className={cn('ds-sheet-overlay', overlayClassName)} />
      ) : null}
      <DialogContent
        ref={ref}
        className={cn(
          'ds-sheet-content',
          `ds-sheet-side-${side}`,
          `ds-sheet-size-${size}`,
          className,
        )}
        {...rest}
      >
        {children}
      </DialogContent>
    </DialogPortal>
  );
});
SheetContent.displayName = 'SheetContent';
