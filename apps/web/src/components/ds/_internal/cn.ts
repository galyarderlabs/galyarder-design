/**
 * Tiny class-name combinator. Falsy values are dropped; truthy
 * strings are joined by a single space. Used by every primitive
 * to compose tokens-driven class names without pulling clsx /
 * classnames as a dependency.
 *
 * @example
 *   cn('ds-btn', variant === 'primary' && 'ds-btn-primary')
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
