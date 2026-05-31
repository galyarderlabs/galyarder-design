import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { cn } from './_internal/cn';

export interface SliderMark {
  /** Position along the slider's range (same units as `min`/`max`). */
  value: number;
  /** Optional label rendered below the tick. */
  label?: string;
}

export interface SliderProps
  extends Omit<ComponentPropsWithoutRef<typeof RadixSlider.Root>, 'asChild'> {
  /**
   * Optional tick marks rendered beneath the track. Each mark's
   * `value` must fall within `[min, max]`; marks outside the range
   * are silently ignored.
   */
  marks?: SliderMark[];
}

/**
 * Range slider built on `@radix-ui/react-slider`.
 *
 * Keyboard contract (native from Radix):
 * - ← / → (or ↑ / ↓) move the focused thumb by `step`.
 * - Home / End jump to `min` / `max`.
 * - Page Up / Page Down move by 10 × `step`.
 *
 * Pass `marks` to render tick marks at specific positions along the
 * track. Each mark can carry an optional `label` string.
 *
 * @example
 *   <Slider
 *     defaultValue={[40]}
 *     min={0}
 *     max={100}
 *     step={1}
 *     aria-label="Volume"
 *     marks={[
 *       { value: 0, label: '0' },
 *       { value: 50, label: '50' },
 *       { value: 100, label: '100' },
 *     ]}
 *   />
 */
export const Slider = forwardRef<
  ElementRef<typeof RadixSlider.Root>,
  SliderProps
>(function Slider({ marks, className, min = 0, max = 100, ...rest }, ref) {
  const range = max - min;

  return (
    <div className={cn('ds-slider-wrapper', className)}>
      <RadixSlider.Root
        ref={ref}
        className="ds-slider"
        min={min}
        max={max}
        {...rest}
      >
        <RadixSlider.Track className="ds-slider-track">
          <RadixSlider.Range className="ds-slider-range" />
        </RadixSlider.Track>

        {/* Render one thumb per value in the `value` / `defaultValue` array.
            Radix requires a Thumb for each value; we default to one. */}
        {(rest.value ?? rest.defaultValue ?? [0]).map((_, i) => (
          <RadixSlider.Thumb
            key={i}
            className={cn('ds-slider-thumb', 'ds-focus-ring')}
          />
        ))}
      </RadixSlider.Root>

      {marks && marks.length > 0 && (
        <div className="ds-slider-marks" aria-hidden="true">
          {marks
            .filter((m) => m.value >= min && m.value <= max)
            .map((m) => {
              const pct = range === 0 ? 0 : ((m.value - min) / range) * 100;
              return (
                <span
                  key={m.value}
                  className="ds-slider-mark"
                  style={{ left: `${pct}%` }}
                >
                  <span className="ds-slider-mark-tick" />
                  {m.label != null && (
                    <span className="ds-slider-mark-label">{m.label}</span>
                  )}
                </span>
              );
            })}
        </div>
      )}
    </div>
  );
});

Slider.displayName = 'Slider';
