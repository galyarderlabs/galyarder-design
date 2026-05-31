import { forwardRef } from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { cn } from './_internal/cn';

export interface ContextMenuProps extends ContextMenuPrimitive.ContextMenuProps {}

/**
 * Context-menu surface backed by `@radix-ui/react-context-menu`.
 * The upstream primitive ships the same keyboard contract as
 * `MenuList` — ↑/↓ navigate items, Home/End jump to first/last,
 * type-ahead matches by leading characters, Enter activates the
 * focused item, and Esc closes the menu and returns focus to the
 * element that triggered it.
 *
 * Compose via the attached subcomponents — `ContextMenu.Trigger`
 * wraps the element that responds to right-click (or long-press
 * on touch), `ContextMenu.Content` renders the floating panel,
 * `ContextMenu.Item` is the activatable row, and
 * `ContextMenu.Separator` draws the thin divider between sections.
 *
 * The Content is portalled to `document.body` so it escapes any
 * `overflow: hidden` ancestor, and its z-index resolves through
 * `var(--z-dropdown)` per the Token_Layer.
 *
 * @example
 *   <ContextMenu>
 *     <ContextMenu.Trigger asChild>
 *       <div>Right-click me</div>
 *     </ContextMenu.Trigger>
 *     <ContextMenu.Content>
 *       <ContextMenu.Item onSelect={onOpen}>Open</ContextMenu.Item>
 *       <ContextMenu.Item onSelect={onRename}>Rename</ContextMenu.Item>
 *       <ContextMenu.Separator />
 *       <ContextMenu.Item variant="danger" onSelect={onDelete}>Delete</ContextMenu.Item>
 *     </ContextMenu.Content>
 *   </ContextMenu>
 */
function ContextMenuRoot(props: ContextMenuProps) {
  return <ContextMenuPrimitive.Root {...props} />;
}
ContextMenuRoot.displayName = 'ContextMenu';

/* -------------------------------------------------------------- */
/* Trigger                                                         */
/* -------------------------------------------------------------- */

export interface ContextMenuTriggerProps extends ContextMenuPrimitive.ContextMenuTriggerProps {}

const ContextMenuTrigger = forwardRef<HTMLSpanElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger({ className, ...rest }, ref) {
    return (
      <ContextMenuPrimitive.Trigger
        ref={ref}
        className={cn('ds-context-trigger', className)}
        {...rest}
      />
    );
  },
);
ContextMenuTrigger.displayName = 'ContextMenu.Trigger';

/* -------------------------------------------------------------- */
/* Content                                                         */
/* -------------------------------------------------------------- */

export interface ContextMenuContentProps extends ContextMenuPrimitive.ContextMenuContentProps {}

const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  function ContextMenuContent({ className, children, ...rest }, ref) {
    return (
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content
          ref={ref}
          className={cn('ds-menu-content', className)}
          {...rest}
        >
          {children}
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    );
  },
);
ContextMenuContent.displayName = 'ContextMenu.Content';

/* -------------------------------------------------------------- */
/* Item                                                            */
/* -------------------------------------------------------------- */

export interface ContextMenuItemProps extends ContextMenuPrimitive.ContextMenuItemProps {
  /** `danger` paints the destructive variant (red-tinted hover). */
  variant?: 'default' | 'danger';
}

const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  function ContextMenuItem({ className, variant = 'default', ...rest }, ref) {
    return (
      <ContextMenuPrimitive.Item
        ref={ref}
        data-variant={variant}
        className={cn('ds-menu-item', className)}
        {...rest}
      />
    );
  },
);
ContextMenuItem.displayName = 'ContextMenu.Item';

/* -------------------------------------------------------------- */
/* Separator / Label / Group                                       */
/* -------------------------------------------------------------- */

export interface ContextMenuSeparatorProps
  extends ContextMenuPrimitive.ContextMenuSeparatorProps {}

const ContextMenuSeparator = forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  function ContextMenuSeparator({ className, ...rest }, ref) {
    return (
      <ContextMenuPrimitive.Separator
        ref={ref}
        className={cn('ds-menu-separator', className)}
        {...rest}
      />
    );
  },
);
ContextMenuSeparator.displayName = 'ContextMenu.Separator';

export interface ContextMenuLabelProps extends ContextMenuPrimitive.ContextMenuLabelProps {}

const ContextMenuLabel = forwardRef<HTMLDivElement, ContextMenuLabelProps>(
  function ContextMenuLabel({ className, ...rest }, ref) {
    return (
      <ContextMenuPrimitive.Label
        ref={ref}
        className={cn('ds-menu-label', className)}
        {...rest}
      />
    );
  },
);
ContextMenuLabel.displayName = 'ContextMenu.Label';

export interface ContextMenuGroupProps extends ContextMenuPrimitive.ContextMenuGroupProps {}

const ContextMenuGroup = forwardRef<HTMLDivElement, ContextMenuGroupProps>(
  function ContextMenuGroup({ className, ...rest }, ref) {
    return (
      <ContextMenuPrimitive.Group
        ref={ref}
        className={cn('ds-menu-group', className)}
        {...rest}
      />
    );
  },
);
ContextMenuGroup.displayName = 'ContextMenu.Group';

/* -------------------------------------------------------------- */
/* Public compound export                                          */
/* -------------------------------------------------------------- */

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Separator: ContextMenuSeparator,
  Label: ContextMenuLabel,
  Group: ContextMenuGroup,
});
