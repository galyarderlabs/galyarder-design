import { forwardRef, useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Command } from 'cmdk';

import type { Size } from './types';
import { cn } from './_internal/cn';

export interface ComboboxItem {
  /** Stable unique value emitted via `onValueChange` when picked. */
  value: string;
  /** Visible label shown in the list row. Falls back to `value`. */
  label?: ReactNode;
  /** Extra terms folded into the type-ahead match. */
  keywords?: string[];
  /** Disables selection while keeping the row visible. */
  disabled?: boolean;
}

export interface ComboboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Filterable rows. */
  items: ComboboxItem[];
  /** Controlled selected value (the picked item's `value`). */
  value?: string;
  /** Initial selected value when the component is uncontrolled. */
  defaultValue?: string;
  /** Fires when the user picks an item via click or Enter. */
  onValueChange?: (value: string) => void;
  /** Controlled search query. */
  search?: string;
  /** Initial search query when the search is uncontrolled. */
  defaultSearch?: string;
  /** Fires whenever the user types in the search input. */
  onSearchChange?: (search: string) => void;
  /** Visual size of the input + row chrome. Defaults to `md`. */
  size?: Size;
  /** Placeholder text on the search input. */
  placeholder?: string;
  /** Accessible label exposed to screen readers (the input is the focusable handle). */
  label?: string;
  /**
   * Rendered when type-ahead filtering yields zero matches.
   * String shorthand wraps in `.ds-combobox-empty`; pass a node for full control.
   */
  emptyState?: ReactNode;
  /** Disables the search input and dims every row. */
  disabled?: boolean;
}

/**
 * Default filter: deterministic, case-insensitive substring match.
 *
 * Returns `1` when `search` (lowercased) is a substring of `value`
 * or any provided `keyword`; otherwise `0`. cmdk treats a `1` as a
 * full match and `0` as hidden, so the row appears precisely when
 * the user's query (case-folded) is found anywhere in the value or
 * its keywords.
 */
function caseInsensitiveContains(
  value: string,
  search: string,
  keywords?: string[],
): number {
  if (!search) return 1;
  const needle = search.toLowerCase();
  if (value.toLowerCase().includes(needle)) return 1;
  if (keywords?.some((kw) => kw.toLowerCase().includes(needle))) return 1;
  return 0;
}

/**
 * Type-ahead combobox built on `cmdk`. The filter is
 * case-insensitive substring matching by default; pass a custom
 * `filter` (via `cmdk` props on `items[].keywords`) to broaden the
 * match surface. The forwarded ref resolves to the underlying
 * search `<input>` so callers can focus / measure it.
 *
 * @example
 *   <Combobox
 *     items={[
 *       { value: 'en', label: 'English' },
 *       { value: 'ja', label: '日本語', keywords: ['japanese'] },
 *     ]}
 *     value={locale}
 *     onValueChange={setLocale}
 *     placeholder="Search locales"
 *     emptyState="No locales match"
 *   />
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    items,
    value,
    defaultValue,
    onValueChange,
    search,
    defaultSearch,
    onSearchChange,
    size = 'md',
    placeholder,
    label = 'Combobox',
    emptyState = 'No results',
    disabled,
    className,
    id,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const listId = `${id ?? reactId}-list`;

  return (
    <Command
      label={label}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      filter={caseInsensitiveContains}
      className={cn('ds-combobox', `ds-combobox-${size}`, className)}
      data-disabled={disabled || undefined}
      {...rest}
    >
      <div className="ds-combobox-input-shell">
        <Command.Input
          ref={ref}
          value={search}
          defaultValue={defaultSearch}
          onValueChange={onSearchChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-controls={listId}
          className="ds-combobox-input"
        />
      </div>
      <Command.List id={listId} className="ds-combobox-list" label={label}>
        <Command.Empty className="ds-combobox-empty">
          {typeof emptyState === 'string' ? <span>{emptyState}</span> : emptyState}
        </Command.Empty>
        {items.map((item) => (
          <Command.Item
            key={item.value}
            value={item.value}
            keywords={item.keywords}
            disabled={item.disabled}
            onSelect={(picked) => onValueChange?.(picked)}
            className="ds-combobox-item"
          >
            {item.label ?? item.value}
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
});

Combobox.displayName = 'Combobox';
