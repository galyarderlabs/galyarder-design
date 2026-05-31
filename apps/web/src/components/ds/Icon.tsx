import { forwardRef } from 'react';
import * as Lucide from 'lucide-react';
import { cn } from './_internal/cn';
import type { IconSize } from './types';

type LucideExports = typeof Lucide;
export type IconName = keyof LucideExports;

export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'name'> {
  /** Lucide icon name. The lucide-react package is the only icon source allowed (Req 3.1). */
  name: IconName;
  /** Locked at the design-system-approved sizes (Req 3.2). */
  size?: IconSize;
  /** Locked at 1.5px to keep visual weight consistent (Req 3.3). */
  strokeWidth?: 1.5;
  /** Optional accessible name. When omitted, the icon renders as decorative (`aria-hidden`). */
  label?: string;
}

/**
 * Icon adapter wrapping `lucide-react`.
 *
 * Sizes are locked to {16, 20, 24}; stroke is locked to 1.5. When
 * no `label` is provided the icon renders `aria-hidden` so screen
 * readers skip it (the surrounding control should carry the label).
 *
 * @example
 *   <Icon name="Plus" size={16} />
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = 20, strokeWidth = 1.5, label, className, ...rest },
  ref,
) {
  const Component = Lucide[name] as
    | React.ForwardRefExoticComponent<
        React.SVGAttributes<SVGSVGElement> & React.RefAttributes<SVGSVGElement>
      >
    | undefined;
  if (!Component) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[galyarder-design] Icon "${String(name)}" not found in lucide-react.`);
    }
    return null;
  }
  return (
    <Component
      ref={ref}
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn('ds-icon', className)}
      {...rest}
    />
  );
});

Icon.displayName = 'Icon';
