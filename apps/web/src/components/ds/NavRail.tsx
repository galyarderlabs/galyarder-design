import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from './_internal/cn';

export interface NavRailProps extends HTMLAttributes<HTMLElement> {
  /** When true the rail collapses to icon-only width. */
  collapsed?: boolean;
  /** Accessible label for the navigation landmark. */
  label?: string;
}

/**
 * Vertical navigation rail. Collapses to icon-only at narrow
 * breakpoints (Req 33.3); the calling layout drives `collapsed`
 * based on the Design_System breakpoint variable.
 *
 * @example
 *   <NavRail collapsed={isNarrow} label="Primary navigation">
 *     <NavItem icon={<Icon name="Home" size={20} />} label="Home" active />
 *   </NavRail>
 */
export const NavRail = forwardRef<HTMLElement, NavRailProps>(function NavRail(
  { collapsed = false, label = 'Navigation', className, children, ...rest },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={label}
      data-collapsed={collapsed || undefined}
      className={cn('ds-nav-rail', className)}
      {...rest}
    >
      {children}
    </nav>
  );
});

NavRail.displayName = 'NavRail';

export interface NavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  label: ReactNode;
  /** Marks this item as the current page (sets `aria-current="page"`). */
  active?: boolean;
}

/**
 * Single navigation entry inside a `NavRail`. Active items expose
 * `aria-current="page"` so screen readers announce the position.
 *
 * @example
 *   <NavItem icon={<Icon name="Settings" size={20} />} label="Settings" />
 */
export const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(function NavItem(
  { icon, label, active, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-current={active ? 'page' : undefined}
      className={cn('ds-nav-item', 'ds-focus-ring', className)}
      {...rest}
    >
      {icon ? <span className="ds-nav-item-icon">{icon}</span> : null}
      <span className="ds-nav-item-label">{label}</span>
    </button>
  );
});

NavItem.displayName = 'NavItem';
