import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import type {
  ExternalToast as SonnerExternalToast,
  ToasterProps as SonnerToasterProps,
} from 'sonner';
import { cn } from './_internal/cn';

/**
 * Toast variants surfaced by the design system. `danger` maps onto
 * Sonner's `error` type internally so the underlying stack manager
 * stays in lockstep, but the public name follows the system status
 * vocabulary used by `Banner` and `Badge`.
 */
export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

/**
 * Options accepted by every variant of the `toast` helper. Mirrors
 * Sonner's `ExternalToast` so callers can pass `description`,
 * `duration`, `action`, etc. through unchanged.
 */
export type ToastOptions = SonnerExternalToast;

export interface ToasterProps extends Omit<SonnerToasterProps, 'children'> {}

const TOAST_CLASS_NAMES = {
  toast: 'ds-toast',
  title: 'ds-toast-title',
  description: 'ds-toast-description',
  closeButton: 'ds-toast-close',
  actionButton: 'ds-toast-action',
  cancelButton: 'ds-toast-cancel',
  // Sonner picks classes by its internal toast type — `error` is
  // remapped here so the rendered DOM carries the design-system
  // `danger` styling regardless of the public variant name.
  info: 'ds-toast-info',
  success: 'ds-toast-success',
  warning: 'ds-toast-warning',
  error: 'ds-toast-danger',
} as const;

/**
 * Toast manager mount. Render exactly once near the application
 * root (e.g. in `app/layout.tsx`). Sonner already provides
 * `aria-live="polite"` on the live region and the bottom-right
 * default position; this wrapper themes the toasts through
 * `var(--*)` tokens, pins the stack to `var(--z-toast)`, and
 * forwards the underlying `ref` so callers can imperatively focus
 * the live region for testing.
 *
 * @example
 *   import { Toaster, toast } from '@/components/ds';
 *
 *   export function RootLayout({ children }: { children: React.ReactNode }) {
 *     return (
 *       <>
 *         {children}
 *         <Toaster />
 *         <button onClick={() => toast.success('Saved')}>Save</button>
 *       </>
 *     );
 *   }
 */
export const Toaster = forwardRef<HTMLElement, ToasterProps>(function Toaster(
  {
    className,
    position = 'bottom-right',
    theme = 'system',
    toastOptions,
    ...rest
  },
  ref,
) {
  const mergedToastOptions: SonnerToasterProps['toastOptions'] = {
    ...toastOptions,
    classNames: {
      ...TOAST_CLASS_NAMES,
      ...toastOptions?.classNames,
    },
  };

  return (
    <SonnerToaster
      ref={ref}
      className={cn('ds-toaster', className)}
      position={position}
      theme={theme}
      toastOptions={mergedToastOptions}
      {...rest}
    />
  );
});

Toaster.displayName = 'Toaster';

type ToastId = string | number;

interface ToastVariantFn {
  (message: ReactNode, options?: ToastOptions): ToastId;
}

interface ToastApi extends ToastVariantFn {
  info: ToastVariantFn;
  success: ToastVariantFn;
  warning: ToastVariantFn;
  danger: ToastVariantFn;
  /** Dismiss a single toast by id, or all toasts when no id is passed. */
  dismiss: (id?: ToastId) => ToastId;
}

const variantDispatchers: Record<ToastVariant, ToastVariantFn> = {
  info: (message, options) => sonnerToast.info(message, options),
  success: (message, options) => sonnerToast.success(message, options),
  warning: (message, options) => sonnerToast.warning(message, options),
  // `danger` is the public name; Sonner's stack tracks it as `error`.
  danger: (message, options) => sonnerToast.error(message, options),
};

/**
 * Imperative toast helper. Calling `toast(message)` is equivalent
 * to `toast.info(message)`. Each variant returns a stable id so
 * callers can later `toast.dismiss(id)`.
 *
 * @example
 *   toast.success('Project created', { description: 'Ready to build.' });
 *   const id = toast.danger('Daemon not reachable');
 *   toast.dismiss(id);
 */
const toastFn: ToastVariantFn = (message, options) =>
  variantDispatchers.info(message, options);

const toastApi = toastFn as ToastApi;
toastApi.info = variantDispatchers.info;
toastApi.success = variantDispatchers.success;
toastApi.warning = variantDispatchers.warning;
toastApi.danger = variantDispatchers.danger;
toastApi.dismiss = (id) => sonnerToast.dismiss(id);

export const toast: ToastApi = toastApi;
