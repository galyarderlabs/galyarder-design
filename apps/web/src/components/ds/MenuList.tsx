import { forwardRef } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from './_internal/cn';

export interface MenuListProps extends DropdownMenu.DropdownMenuProps {}

/**
 * Menu surface backed by `@radix-ui/react-dropdown-menu`. The
 * upstream primitive ships the keyboard contract Phase 1.5 needs
 * — ↑/↓ navigate items, Home/End jump to first/last, type-ahead
 * matches by leading characters, Enter activates the focused
 * item, and Esc closes the menu and returns focus to the trigger.
 *
 * Compose via the attached subcomponents — `MenuList.Trigger`
 * opens the menu, `MenuList.Content` renders the floating panel
 * (and accepts `align` / `side` for placement), `MenuList.Item`
 * is the activatable row, and `MenuList.Separator` draws the
 * thin divider between sections.
 *
 * The Content is portalled to `document.body` so it escapes any
 * `overflow: hidden` ancestor, and its z-index resolves through
 * `var(--z-dropdown)` per the Token_Layer.
 *
 * @example
 *   <MenuList>
 *     <MenuList.Trigger asChild>
 *       <IconButton aria-label="More actions"><Icon name="MoreHorizontal" /></IconButton>
 *     </MenuList.Trigger>
 *     <MenuList.Content align="end" side="bottom">
 *       <MenuList.Item onSelect={onRename}>Rename</MenuList.Item>
 *       <MenuList.Item onSelect={onDuplicate}>Duplicate</MenuList.Item>
 *       <MenuList.Separator />
 *       <MenuList.Item variant="danger" onSelect={onDelete}>Delete</MenuList.Item>
 *     </MenuList.Content>
 *   </MenuList>
 */
function MenuListRoot(props: MenuListProps) {
  return <DropdownMenu.Root {...props} />;
}
MenuListRoot.displayName = 'MenuList';

/* -------------------------------------------------------------- */
/* Trigger                                                         */
/* -------------------------------------------------------------- */

export interface MenuListTriggerProps extends DropdownMenu.DropdownMenuTriggerProps {}

const MenuListTrigger = forwardRef<HTMLButtonElement, MenuListTriggerProps>(
  function MenuListTrigger({ className, ...rest }, ref) {
    return (
      <DropdownMenu.Trigger
        ref={ref}
        className={cn('ds-menu-trigger', 'ds-focus-ring', className)}
        {...rest}
      />
    );
  },
);
MenuListTrigger.displayName = 'MenuList.Trigger';

/* -------------------------------------------------------------- */
/* Content                                                         */
/* -------------------------------------------------------------- */

export interface MenuListContentProps extends DropdownMenu.DropdownMenuContentProps {
  /** Defaults to 6 (one quarter of `--space-6`) so the panel sits clear of the trigger. */
  sideOffset?: number;
}

const MenuListContent = forwardRef<HTMLDivElement, MenuListContentProps>(
  function MenuListContent(
    { className, align = 'start', side = 'bottom', sideOffset = 6, children, ...rest },
    ref,
  ) {
    return (
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          ref={ref}
          align={align}
          side={side}
          sideOffset={sideOffset}
          className={cn('ds-menu-content', className)}
          {...rest}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    );
  },
);
MenuListContent.displayName = 'MenuList.Content';

/* -------------------------------------------------------------- */
/* Item                                                            */
/* -------------------------------------------------------------- */

export interface MenuListItemProps extends DropdownMenu.DropdownMenuItemProps {
  /** `danger` paints the destructive variant (red-tinted hover). */
  variant?: 'default' | 'danger';
}

const MenuListItem = forwardRef<HTMLDivElement, MenuListItemProps>(function MenuListItem(
  { className, variant = 'default', ...rest },
  ref,
) {
  return (
    <DropdownMenu.Item
      ref={ref}
      data-variant={variant}
      className={cn('ds-menu-item', className)}
      {...rest}
    />
  );
});
MenuListItem.displayName = 'MenuList.Item';

/* -------------------------------------------------------------- */
/* Separator / Label / Group                                       */
/* -------------------------------------------------------------- */

export interface MenuListSeparatorProps extends DropdownMenu.DropdownMenuSeparatorProps {}

const MenuListSeparator = forwardRef<HTMLDivElement, MenuListSeparatorProps>(
  function MenuListSeparator({ className, ...rest }, ref) {
    return (
      <DropdownMenu.Separator
        ref={ref}
        className={cn('ds-menu-separator', className)}
        {...rest}
      />
    );
  },
);
MenuListSeparator.displayName = 'MenuList.Separator';

export interface MenuListLabelProps extends DropdownMenu.DropdownMenuLabelProps {}

const MenuListLabel = forwardRef<HTMLDivElement, MenuListLabelProps>(function MenuListLabel(
  { className, ...rest },
  ref,
) {
  return (
    <DropdownMenu.Label
      ref={ref}
      className={cn('ds-menu-label', className)}
      {...rest}
    />
  );
});
MenuListLabel.displayName = 'MenuList.Label';

export interface MenuListGroupProps extends DropdownMenu.DropdownMenuGroupProps {}

const MenuListGroup = forwardRef<HTMLDivElement, MenuListGroupProps>(function MenuListGroup(
  { className, ...rest },
  ref,
) {
  return (
    <DropdownMenu.Group
      ref={ref}
      className={cn('ds-menu-group', className)}
      {...rest}
    />
  );
});
MenuListGroup.displayName = 'MenuList.Group';

/* -------------------------------------------------------------- */
/* Public compound export                                          */
/* -------------------------------------------------------------- */

export const MenuList = Object.assign(MenuListRoot, {
  Trigger: MenuListTrigger,
  Content: MenuListContent,
  Item: MenuListItem,
  Separator: MenuListSeparator,
  Label: MenuListLabel,
  Group: MenuListGroup,
});
