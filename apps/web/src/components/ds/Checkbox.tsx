import { forwardRef } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { cn } from './_internal/cn';
import { Icon } from './Icon';
import type { Size } from './types';

export interface CheckboxProps
  extends Omit<RadixCheckbox.CheckboxProps, 'asChild'> {
  /** Visual size; drives the box dimensions and indicator glyph. Defaults to `md`. */
  size?: Size;
  /**
   * Marks the field as invalid. Sets `aria-invalid` and the danger
   * border. Mirrors the contract used by `TextInput`.
   */
  invalid?: boolean;
}

/**
 * Boolean and tri-state checkbox built on `@radix-ui/react-checkbox`.
 * Pass `checked="indeterminate"` to surface the mixed state — Radix
 * forwards that through to `data-state="indeterminate"` on the root
 * button, which the indicator picks up to render a horizontal bar.
 *
 * @example
 *   const [checked, setChecked] = useState<CheckboxProps['checked']>('indeterminate');
 *   <Checkbox
 *     checked={checked}
 *     onCheckedChange={setChecked}
 *     aria-label="Select all rows"
 *   />
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox({ size = 'md', invalid, className, ...rest }, ref) {
    return (
      <RadixCheckbox.Root
        ref={ref}
        className={cn(
          'ds-checkbox',
          'ds-focus-ring',
          `ds-checkbox-${size}`,
          className,
        )}
        data-invalid={invalid || undefined}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        <RadixCheckbox.Indicator className="ds-checkbox-indicator">
          {/* Both glyphs render unconditionally; CSS shows the one
              matching the indicator's data-state, which Radix sets
              to "checked" or "indeterminate" on the wrapper span. */}
          <Icon
            name="Check"
            size={16}
            strokeWidth={1.5}
            className="ds-checkbox-glyph ds-checkbox-glyph-checked"
          />
          <Icon
            name="Minus"
            size={16}
            strokeWidth={1.5}
            className="ds-checkbox-glyph ds-checkbox-glyph-indeterminate"
          />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    );
  },
);

Checkbox.displayName = 'Checkbox';
