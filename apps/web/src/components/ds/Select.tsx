import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as RadixSelect from '@radix-ui/react-select';

import { cn } from './_internal/cn';
import { Icon } from './Icon';
import type { Size } from './types';

type RadixRootProps = ComponentPropsWithoutRef<typeof RadixSelect.Root>;
type RadixItemProps = ComponentPropsWithoutRef<typeof RadixSelect.Item>;

/**
 * Subset of Radix's content props that the public surface re-exposes.
 * Position-related options stay opaque so the dropdown placement
 * cannot drift from the design (`popper`-style alignment, anchored to
 * the trigger, with the `var(--z-overlay)` z-index token).
 */
type SelectContentForwardProps = Pick<
  ComponentPropsWithoutRef<typeof RadixSelect.Content>,
  'side' | 'align' | 'sideOffset' | 'alignOffset' | 'avoidCollisions'
>;

export interface SelectProps
  extends Omit<RadixRootProps, 'asChild'>,
    SelectContentForwardProps {
  /** Visual size — drives trigger height and font scale. Defaults to `md`. */
  size?: Size;
  /** Text shown on the trigger when no value is selected. */
  placeholder?: string;
  /**
   * Accessible name for the trigger. Required when no visible label
   * wraps the trigger; mirrors `IconButton`'s contract so the
   * combobox always carries an accessible name.
   */
  'aria-label'?: string;
  /** Class applied to the trigger button. */
  className?: string;
  /** Class applied to the portal-rendered content surface. */
  contentClassName?: string;
  /** `<SelectItem>` children that populate the listbox. */
  children?: ReactNode;
}

/**
 * Combobox-style select built on `@radix-ui/react-select`. The
 * trigger is the focusable button (where the forwarded ref lands)
 * and the listbox renders through `RadixSelect.Portal` so it stacks
 * above page chrome at `var(--z-overlay)`. Keyboard model is the
 * standard Radix combobox: Enter/Space opens, ↑/↓ moves the active
 * item, type-ahead filters, Esc closes.
 *
 * @example
 *   <Select
 *     value={tone}
 *     onValueChange={setTone}
 *     placeholder="Choose tone"
 *     aria-label="Tone"
 *   >
 *     <SelectItem value="warm">Warm</SelectItem>
 *     <SelectItem value="cool">Cool</SelectItem>
 *     <SelectItem value="neutral">Neutral</SelectItem>
 *   </Select>
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    size = 'md',
    placeholder,
    className,
    contentClassName,
    children,
    'aria-label': ariaLabel,
    side = 'bottom',
    align = 'start',
    sideOffset = 4,
    alignOffset,
    avoidCollisions,
    ...rootProps
  },
  ref,
) {
  return (
    <RadixSelect.Root {...rootProps}>
      <RadixSelect.Trigger
        ref={ref}
        aria-label={ariaLabel}
        data-size={size}
        className={cn('ds-select-trigger', 'ds-focus-ring', `ds-select-trigger-${size}`, className)}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className="ds-select-icon" asChild>
          <Icon name="ChevronDown" size={16} strokeWidth={1.5} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          avoidCollisions={avoidCollisions}
          data-size={size}
          className={cn('ds-select-content', contentClassName)}
        >
          <RadixSelect.Viewport className="ds-select-viewport">{children}</RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
});

Select.displayName = 'Select';

export interface SelectItemProps extends Omit<RadixItemProps, 'asChild'> {
  /** Optional content rendered to the right of the label, before the indicator. */
  trailing?: ReactNode;
}

/**
 * Single option inside a `Select` listbox. Forwards its ref to the
 * underlying `<div role="option">` so callers can scroll an item
 * into view or measure it after layout.
 *
 * @example
 *   <SelectItem value="warm">Warm</SelectItem>
 */
export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { className, children, trailing, ...rest },
  ref,
) {
  return (
    <RadixSelect.Item
      ref={ref}
      className={cn('ds-select-item', 'ds-focus-ring', className)}
      {...rest}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      {trailing ? <span className="ds-select-item-trailing">{trailing}</span> : null}
      <RadixSelect.ItemIndicator className="ds-select-item-indicator">
        <Icon name="Check" size={16} strokeWidth={1.5} />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});

SelectItem.displayName = 'SelectItem';
