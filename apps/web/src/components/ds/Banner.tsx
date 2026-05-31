import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './_internal/cn';
import type { BannerVariant } from './types';

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: BannerVariant;
  /** Optional icon rendered before the content. */
  icon?: ReactNode;
  /** Optional bold heading rendered above the description. */
  title?: ReactNode;
  /** Body copy. Falls back to `children` when omitted. */
  description?: ReactNode;
  /** Trailing actions. */
  actions?: ReactNode;
}

/**
 * Inline status / alert banner. Info and success use `role="status"`;
 * warning and danger use `role="alert"` so screen readers announce
 * urgent state changes immediately.
 *
 * @example
 *   <Banner variant="danger" title="Daemon not reachable" actions={
 *     <Button onClick={retry}>Retry</Button>
 *   } />
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { variant = 'info', icon, title, description, actions, className, children, ...rest },
  ref,
) {
  const role = variant === 'danger' || variant === 'warning' ? 'alert' : 'status';
  return (
    <div
      ref={ref}
      role={role}
      className={cn('ds-banner', `ds-banner-${variant}`, className)}
      {...rest}
    >
      {icon ? <span className="ds-banner-icon">{icon}</span> : null}
      <div className="ds-banner-content">
        {title ? <span className="ds-banner-title">{title}</span> : null}
        {description ? (
          <span className="ds-banner-description">{description}</span>
        ) : children ? (
          <span className="ds-banner-description">{children}</span>
        ) : null}
      </div>
      {actions ? <div className="ds-banner-actions">{actions}</div> : null}
    </div>
  );
});

Banner.displayName = 'Banner';
