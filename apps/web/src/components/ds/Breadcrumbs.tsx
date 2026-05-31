import { forwardRef, Fragment } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './_internal/cn';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  /** Accessible label for the wrapping `<nav>`. */
  label?: string;
}

/**
 * Navigation breadcrumb trail. Last item is rendered with
 * `aria-current="page"`; the separator is `aria-hidden`.
 *
 * @example
 *   <Breadcrumbs items={[{label:'Home', href:'/'}, {label:'Project'}]} />
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, separator = '/', label = 'Breadcrumbs', className, ...rest },
  ref,
) {
  return (
    <nav ref={ref} aria-label={label} className={cn('ds-breadcrumbs', className)} {...rest}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const inner = item.href ? (
          <a href={item.href}>{item.label}</a>
        ) : item.onClick ? (
          <button type="button" onClick={item.onClick} className="ds-btn ds-btn-ghost ds-btn-sm">
            {item.label}
          </button>
        ) : (
          <span>{item.label}</span>
        );
        return (
          <Fragment key={idx}>
            <span
              className={cn(
                'ds-breadcrumbs-item',
                isLast && 'ds-breadcrumbs-item-current',
              )}
              aria-current={isLast ? 'page' : undefined}
            >
              {inner}
            </span>
            {!isLast ? (
              <span aria-hidden className="ds-breadcrumbs-separator">
                {separator}
              </span>
            ) : null}
          </Fragment>
        );
      })}
    </nav>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';
