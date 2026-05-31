/**
 * Shared type primitives for the @gd/ds component library.
 *
 * No runtime exports — every value lives in tokens.css and is
 * consumed via class names + CSS variables. These types only
 * describe the prop surface so callers compile against a single
 * vocabulary.
 */

import type { LucideIcon } from 'lucide-react';

export type Size = 'sm' | 'md' | 'lg';

export type Density = 'comfortable' | 'compact';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export type BannerVariant = 'info' | 'success' | 'warning' | 'danger';

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export type IconSize = 16 | 20 | 24;

/**
 * `IconName` is intentionally a wide string type rather than the
 * exhaustive union of every lucide icon — pulling that in expands
 * the type-check graph by ~50k symbols. Callers usually pass a
 * literal string or pass the imported component directly.
 */
export type IconName = string;

/** A lucide-react component reference (the only icon source we accept). */
export type IconComponent = LucideIcon;
