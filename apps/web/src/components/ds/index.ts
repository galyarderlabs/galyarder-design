/**
 * Galyarder Design — single export module for the design-system
 * primitives. Every redesigned surface and every consumer outside
 * apps/web (apps/landing-page React islands, apps/desktop renderer)
 * imports from this module via the `@gd/ds` alias.
 *
 * Phase 1 ships the dependency-free subset. Phase 1.5 adds the
 * Radix / Vaul / Sonner / cmdk-backed primitives once the Deps_Note
 * additions are accepted.
 */

// ─── Phase 1: dependency-free primitives ────────────────────────────────────

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Banner } from './Banner';
export type { BannerProps } from './Banner';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { Spinner } from './Spinner';
export type { SpinnerProps } from './Spinner';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { TextInput } from './TextInput';
export type { TextInputProps } from './TextInput';

export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';

export { Tag } from './Tag';
export type { TagProps } from './Tag';

export { Chip } from './Chip';
export type { ChipProps } from './Chip';

export { Kbd } from './Kbd';
export type { KbdProps } from './Kbd';

export { Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export { Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

export { Pagination } from './Pagination';
export type { PaginationProps } from './Pagination';

export { Breadcrumbs } from './Breadcrumbs';
export type { BreadcrumbsProps, BreadcrumbItem } from './Breadcrumbs';

export { ScrollArea } from './ScrollArea';
export type { ScrollAreaProps } from './ScrollArea';

export { NavRail, NavItem } from './NavRail';
export type { NavRailProps, NavItemProps } from './NavRail';

export { Progress } from './Progress';
export type { ProgressProps } from './Progress';

export { Icon } from './Icon';
export type { IconProps, IconName } from './Icon';

// ─── Phase 1.5: dep-backed primitives (Radix / Vaul / Sonner / cmdk) ────────

export { ToggleGroup, ToggleGroupItem } from './ToggleGroup';
export type { ToggleGroupProps, ToggleGroupItemProps } from './ToggleGroup';

export { Switch } from './Switch';
export type { SwitchProps } from './Switch';

export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Radio, RadioItem } from './Radio';
export type { RadioProps, RadioItemProps } from './Radio';

export { Select, SelectItem } from './Select';
export type { SelectProps, SelectItemProps } from './Select';

export { Combobox } from './Combobox';
export type { ComboboxProps, ComboboxItem } from './Combobox';

export { Slider } from './Slider';
export type { SliderProps, SliderMark } from './Slider';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from './Tabs';

export { Segmented, SegmentedItem } from './Segmented';
export type { SegmentedProps, SegmentedItemProps } from './Segmented';

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './Sheet';
export type { SheetContentProps, SheetSide } from './Sheet';

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './Dialog';
export type {
  DialogContentProps,
  DialogSize,
  DialogTriggerProps,
  DialogCloseProps,
  DialogTitleProps,
  DialogDescriptionProps,
} from './Dialog';

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerHandle,
  DrawerOverlay,
} from './Drawer';
export type {
  DrawerContentProps,
  DrawerDirection,
  DrawerTriggerProps,
  DrawerCloseProps,
  DrawerOverlayProps,
  DrawerHandleProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
} from './Drawer';

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
} from './Popover';
export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverAnchorProps,
  PopoverCloseProps,
} from './Popover';

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TOOLTIP_DEFAULT_DELAY_MS,
} from './Tooltip';
export type {
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipProviderProps,
  TooltipSide,
  TooltipAlign,
} from './Tooltip';

export { Toaster, toast } from './Toast';
export type { ToasterProps, ToastVariant, ToastOptions } from './Toast';

export { MenuList } from './MenuList';
export type {
  MenuListProps,
  MenuListTriggerProps,
  MenuListContentProps,
  MenuListItemProps,
  MenuListSeparatorProps,
  MenuListLabelProps,
  MenuListGroupProps,
} from './MenuList';

export { ContextMenu } from './ContextMenu';
export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuSeparatorProps,
  ContextMenuLabelProps,
  ContextMenuGroupProps,
} from './ContextMenu';

// ─── Shared token types ──────────────────────────────────────────────────────

export type {
  Size,
  Density,
  ButtonVariant,
  BannerVariant,
  BadgeVariant,
  IconSize,
} from './types';
