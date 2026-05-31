import { forwardRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from './_internal/cn';
import type { Size } from './types';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  size?: Size;
  shape?: 'circle' | 'square';
  /** Optional image source. Falls back to `initials` if missing or fails to load. */
  src?: string;
  /** Required so screen readers know who this represents. */
  alt: string;
  /** Up to two characters used as fallback when no image is available. */
  initials?: string;
}

/**
 * Identity avatar. Falls back to initials when image source is
 * absent or fails to load.
 *
 * @example
 *   <Avatar size="md" alt="Ada Lovelace" initials="AL" />
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { size = 'md', shape = 'circle', src, alt, initials, className, ...rest },
  ref,
) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;
  return (
    <span
      ref={ref}
      role="img"
      aria-label={alt}
      className={cn('ds-avatar', `ds-avatar-${size}`, `ds-avatar-${shape}`, className)}
      {...rest}
    >
      {showImage ? (
        <img src={src} alt="" onError={() => setErrored(true)} />
      ) : (
        <span aria-hidden>{initials?.slice(0, 2).toUpperCase() ?? '?'}</span>
      )}
    </span>
  );
});

Avatar.displayName = 'Avatar';
