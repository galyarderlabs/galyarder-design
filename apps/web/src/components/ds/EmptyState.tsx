import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './_internal/cn';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Decorative icon — pass an `<Icon name=… size={24} />` element. */
  icon?: ReactNode;
  /** Title up to ~60 characters per Req 23.3. */
  title: ReactNode;
  /** Description up to ~200 characters per Req 23.3. */
  description?: ReactNode;
  /** Primary and optional secondary actions. */
  action?: ReactNode;
}

/**
 * Canonical empty-state primitive. One layout for every list-based
 * view (Req 23.2). Distinct from error states; loading failures
 * render via `Banner variant="danger"` instead.
 *
 * @example
 *   <EmptyState
 *     icon={<Icon name="FolderPlus" size={24} />}
 *     title="No projects yet"
 *     description="Create your first project to get started."
 *     action={<Button variant="primary">Create project</Button>}
 *   />
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn('ds-empty-state', className)} {...rest}>
      {icon ? <span className="ds-empty-state-icon">{icon}</span> : null}
      <h2 className="ds-empty-state-title">{title}</h2>
      {description ? <p className="ds-empty-state-description">{description}</p> : null}
      {action ? <div className="ds-empty-state-actions">{action}</div> : null}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
