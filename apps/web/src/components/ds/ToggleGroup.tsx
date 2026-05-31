import { createContext, forwardRef, useContext } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import * as RadixToggleGroup from '@radix-ui/react-toggle-group';
import { cn } from './_internal/cn';
import type { Density, Size } from './types';

interface ToggleGroupContextValue {
  size: Size;
  density: Density;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  size: 'md',
  density: 'comfortable',
});

type ToggleGroupSizeAndDensity = {
  /** Visual size of every item in the group. */
  size?: Size;
  /**
   * Density override; when omitted the items inherit the page-level
   * `--density-multiplier` cascade.
   */
  density?: Density;
};

/**
 * Public prop union — discriminated by `type` so a caller passing
 * `type="single"` gets a `value: string` callback while
 * `type="multiple"` gets `value: string[]`. The discriminant is
 * preserved by keeping the union as the outermost shape.
 */
export type ToggleGroupProps =
  | (RadixToggleGroup.ToggleGroupSingleProps & ToggleGroupSizeAndDensity)
  | (RadixToggleGroup.ToggleGroupMultipleProps & ToggleGroupSizeAndDensity);

/**
 * Segmented control built on `@radix-ui/react-toggle-group`. Single
 * mode behaves as a radio group (one selection); multiple mode as a
 * checkbox group (any subset). Roving focus is on by default so
 * ←/→ (or ↑/↓ when `orientation="vertical"`) move focus between
 * items, Home/End jump to the ends, and Enter or Space activates.
 *
 * @example
 *   <ToggleGroup type="single" defaultValue="grid" aria-label="View mode">
 *     <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
 *     <ToggleGroupItem value="list">List</ToggleGroupItem>
 *   </ToggleGroup>
 */
export const ToggleGroup = forwardRef<
  ElementRef<typeof RadixToggleGroup.Root>,
  ToggleGroupProps
>(function ToggleGroup(props, ref) {
  const {
    size = 'md',
    density = 'comfortable',
    className,
    children,
    ...rest
  } = props as ToggleGroupProps & ToggleGroupSizeAndDensity & {
    className?: string;
    children?: ReactNode;
  };

  return (
    <ToggleGroupContext.Provider value={{ size, density }}>
      <RadixToggleGroup.Root
        ref={ref}
        data-size={size}
        data-density={density}
        className={cn('ds-toggle-group', className)}
        // Spread is safe: `rest` keeps the discriminated union from
        // RadixToggleGroup.Root, just without `size` / `density`.
        {...(rest as RadixToggleGroup.ToggleGroupSingleProps | RadixToggleGroup.ToggleGroupMultipleProps)}
      >
        {children}
      </RadixToggleGroup.Root>
    </ToggleGroupContext.Provider>
  );
});

ToggleGroup.displayName = 'ToggleGroup';

export interface ToggleGroupItemProps
  extends ComponentPropsWithoutRef<typeof RadixToggleGroup.Item> {}

/**
 * Single segment inside a `ToggleGroup`. Inherits size and density
 * from the enclosing group via context, so individual items stay
 * visually consistent across the cluster.
 *
 * @example
 *   <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
 */
export const ToggleGroupItem = forwardRef<
  ElementRef<typeof RadixToggleGroup.Item>,
  ToggleGroupItemProps
>(function ToggleGroupItem({ className, ...rest }, ref) {
  const { size, density } = useContext(ToggleGroupContext);
  return (
    <RadixToggleGroup.Item
      ref={ref}
      data-size={size}
      data-density={density}
      className={cn('ds-toggle-group-item', 'ds-focus-ring', className)}
      {...rest}
    />
  );
});

ToggleGroupItem.displayName = 'ToggleGroupItem';
