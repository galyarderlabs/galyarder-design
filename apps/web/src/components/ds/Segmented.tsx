import { createContext, forwardRef, useContext } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import * as RadixToggleGroup from '@radix-ui/react-toggle-group';
import { cn } from './_internal/cn';
import type { Density, Size } from './types';

interface SegmentedContextValue {
  size: Size;
  density: Density;
}

const SegmentedContext = createContext<SegmentedContextValue>({
  size: 'md',
  density: 'comfortable',
});

export interface SegmentedProps
  extends Omit<RadixToggleGroup.ToggleGroupSingleProps, 'type'> {
  /** Visual size of every segment. @default 'md' */
  size?: Size;
  /**
   * Density override; when omitted the segments inherit the
   * page-level `--density-multiplier` cascade.
   */
  density?: Density;
}

/**
 * Segmented control — a visually distinct pill-shaped variant of
 * `ToggleGroup` with `type="single"` locked in. Use it for mutually
 * exclusive mode switches (e.g. render mode, view layout) where the
 * pill appearance communicates "one active choice at a time" more
 * clearly than a generic toggle group.
 *
 * Keyboard contract: radiogroup pattern — ←/→ move focus between
 * segments, Home/End jump to the ends, Enter or Space activates.
 * This is identical to `ToggleGroup type="single"` because both
 * delegate to `@radix-ui/react-toggle-group`.
 *
 * @example
 *   <Segmented defaultValue="preview" aria-label="Render mode">
 *     <SegmentedItem value="preview">Preview</SegmentedItem>
 *     <SegmentedItem value="source">Source</SegmentedItem>
 *   </Segmented>
 */
export const Segmented = forwardRef<
  ElementRef<typeof RadixToggleGroup.Root>,
  SegmentedProps
>(function Segmented(
  { size = 'md', density = 'comfortable', className, children, ...rest },
  ref,
) {
  return (
    <SegmentedContext.Provider value={{ size, density }}>
      <RadixToggleGroup.Root
        ref={ref}
        type="single"
        data-size={size}
        data-density={density}
        className={cn('ds-segmented', className)}
        {...rest}
      >
        {children as ReactNode}
      </RadixToggleGroup.Root>
    </SegmentedContext.Provider>
  );
});

Segmented.displayName = 'Segmented';

export interface SegmentedItemProps
  extends ComponentPropsWithoutRef<typeof RadixToggleGroup.Item> {}

/**
 * Single segment inside a `Segmented` control. Inherits size and
 * density from the enclosing group via context.
 *
 * @example
 *   <SegmentedItem value="grid">Grid</SegmentedItem>
 */
export const SegmentedItem = forwardRef<
  ElementRef<typeof RadixToggleGroup.Item>,
  SegmentedItemProps
>(function SegmentedItem({ className, ...rest }, ref) {
  const { size, density } = useContext(SegmentedContext);
  return (
    <RadixToggleGroup.Item
      ref={ref}
      data-size={size}
      data-density={density}
      className={cn('ds-segmented-item', 'ds-focus-ring', className)}
      {...rest}
    />
  );
});

SegmentedItem.displayName = 'SegmentedItem';
