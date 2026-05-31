import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from './_internal/cn';

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  /** Accessible label for the wrapping `<nav>`. */
  label?: string;
}

/**
 * Compact page jumper for list views. ←/→ keys move pages.
 *
 * @example
 *   <Pagination total={120} page={3} pageSize={20} onPageChange={setPage} />
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { total, page, pageSize, onPageChange, label = 'Pagination', className, ...rest },
  ref,
) {
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const safePage = Math.min(Math.max(1, page), pageCount);

  function go(target: number) {
    const next = Math.min(Math.max(1, target), pageCount);
    if (next !== safePage) onPageChange(next);
  }

  return (
    <nav
      ref={ref}
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          go(safePage - 1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          go(safePage + 1);
        }
      }}
      className={cn('ds-pagination', className)}
      {...rest}
    >
      <button
        type="button"
        className="ds-pagination-page ds-focus-ring"
        onClick={() => go(safePage - 1)}
        disabled={safePage <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>
      <span className="ds-pagination-page" aria-current="page">
        {safePage}
      </span>
      <span className="ds-pagination-page" aria-label="of">
        / {pageCount}
      </span>
      <button
        type="button"
        className="ds-pagination-page ds-focus-ring"
        onClick={() => go(safePage + 1)}
        disabled={safePage >= pageCount}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
});

Pagination.displayName = 'Pagination';
