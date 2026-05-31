import { forwardRef, useId } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';

import { cn } from './_internal/cn';
import type { Size } from './types';

type RadixGroupProps = ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>;
type RadixItemProps = ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>;

export interface RadioProps extends Omit<RadixGroupProps, 'asChild'> {
  /**
   * Visual size — controls the indicator diameter and label gap.
   * Same vocabulary as the rest of the DS primitives.
   */
  size?: Size;
}

/**
 * Group root for a set of radio items. Built on
 * `@radix-ui/react-radio-group`, which implements the ARIA radiogroup
 * pattern — `↑`/`←` and `↓`/`→` move focus and selection between
 * items inside the group, `Tab` enters and exits the group as a
 * single stop.
 *
 * Pair with one or more `RadioItem` children. Each item must declare
 * a `value`; the group's `value` / `onValueChange` props (controlled)
 * or `defaultValue` (uncontrolled) drive selection.
 *
 * @example
 *   <Radio
 *     value={tone}
 *     onValueChange={setTone}
 *     aria-label="Tone"
 *   >
 *     <RadioItem value="warm">Warm</RadioItem>
 *     <RadioItem value="cool">Cool</RadioItem>
 *     <RadioItem value="neutral">Neutral</RadioItem>
 *   </Radio>
 */
export const Radio = forwardRef<HTMLDivElement, RadioProps>(function Radio(
  { size = 'md', className, orientation = 'vertical', children, ...rest },
  ref,
) {
  return (
    <RadixRadioGroup.Root
      ref={ref}
      orientation={orientation}
      data-size={size}
      className={cn('ds-radio-group', `ds-radio-group-${size}`, className)}
      {...rest}
    >
      {children}
    </RadixRadioGroup.Root>
  );
});

Radio.displayName = 'Radio';

export interface RadioItemProps extends Omit<RadixItemProps, 'asChild'> {
  /** Optional descriptive text rendered below the label. */
  description?: ReactNode;
}

/**
 * Single item inside a `Radio` group. Forwards the ref to the
 * underlying `<button role="radio">` so callers can drive focus
 * imperatively (e.g. when restoring selection after a save).
 *
 * @example
 *   <RadioItem value="warm">Warm</RadioItem>
 */
export const RadioItem = forwardRef<HTMLButtonElement, RadioItemProps>(function RadioItem(
  { className, children, description, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const controlId = id ?? `${generatedId}-radio`;
  const labelId = `${controlId}-label`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  return (
    <span className="ds-radio-item">
      <RadixRadioGroup.Item
        ref={ref}
        id={controlId}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        className={cn('ds-radio-control', 'ds-focus-ring', className)}
        {...rest}
      >
        <RadixRadioGroup.Indicator className="ds-radio-indicator" />
      </RadixRadioGroup.Item>
      <label htmlFor={controlId} className="ds-radio-text">
        <span id={labelId} className="ds-radio-label">
          {children}
        </span>
        {description ? (
          <span id={descriptionId} className="ds-radio-description">
            {description}
          </span>
        ) : null}
      </label>
    </span>
  );
});

RadioItem.displayName = 'RadioItem';
