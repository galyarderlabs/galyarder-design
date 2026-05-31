'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/**
 * Descriptor for a queued dialog request. Callers push one of these via
 * `useDialogQueue().open(…)` and the provider ensures at most one is
 * visible at a time (Req 18.5).
 *
 * The `content` field is a render function so the dialog body is only
 * evaluated when the entry reaches the head of the queue — avoiding
 * stale-closure issues for dialogs that depend on transient state.
 */
export interface DialogEntry {
  /** Stable identifier returned by `open()`. Use it to `close()` early. */
  id: string;
  /**
   * Render the dialog body. The provider calls this when the entry is
   * current. The function receives a `close` callback so the content can
   * dismiss itself without needing the queue context.
   */
  content: (close: () => void) => ReactNode;
  /**
   * The DOM element that triggered the open request. When the dialog
   * closes, focus is returned here (Req 18.4 focus-return contract).
   * If omitted the provider falls back to `document.activeElement` at
   * the moment `open()` is called.
   */
  triggerRef?: HTMLElement | null;
}

/**
 * Internal queue entry — extends the public descriptor with the
 * resolved trigger element captured at enqueue time.
 */
interface QueueEntry extends DialogEntry {
  /** Resolved at enqueue time so the caller's active element is captured. */
  resolvedTrigger: HTMLElement | null;
}

interface DialogQueueContextValue {
  /**
   * Push a dialog onto the queue. Returns the entry's stable `id`.
   * If no dialog is currently open the new entry opens immediately;
   * otherwise it waits in FIFO order (Req 18.5).
   *
   * @example
   *   const { open } = useDialogQueue();
   *   const id = open({
   *     content: (close) => (
   *       <DialogContent>
   *         <p>Are you sure?</p>
   *         <Button onClick={close}>Confirm</Button>
   *       </DialogContent>
   *     ),
   *   });
   */
  open: (entry: Omit<DialogEntry, 'id'>) => string;
  /**
   * Close the currently open dialog (or remove a queued entry by id
   * before it becomes current). Focus is returned to the trigger element
   * that was active when `open()` was called.
   */
  close: (id?: string) => void;
  /**
   * The entry currently being displayed, or `null` when the queue is
   * empty. Consumers can use this to render the active dialog content
   * outside the provider tree if needed.
   */
  current: QueueEntry | null;
}

const DialogQueueContext = createContext<DialogQueueContextValue | null>(null);

interface DialogQueueProviderProps {
  children: ReactNode;
}

/**
 * Provider that queues dialogs so only one is open at a time (Req 18.5).
 *
 * Wrap the app root with this provider so any descendant can call
 * `useDialogQueue()` to push a dialog onto the queue. The provider
 * enforces:
 *
 * - **Single-active-dialog gate.** At most one `Dialog`-rendered modal
 *   is visible at any time. Additional `open()` calls are enqueued in
 *   FIFO order and displayed as soon as the current dialog closes.
 *
 * - **Focus trap.** Delegated to the `Dialog` primitive (Radix
 *   `@radix-ui/react-dialog` ships a `FocusScope` that traps Tab /
 *   Shift+Tab inside the panel while open). The provider does not
 *   duplicate that logic.
 *
 * - **Return-focus contract.** When a dialog closes, focus is returned
 *   to the element that was active at the moment `open()` was called
 *   (Req 18.4). The provider captures `document.activeElement` at
 *   enqueue time and restores it after the close animation settles.
 *
 * @example
 *   // In app root:
 *   <DialogQueueProvider>
 *     <App />
 *   </DialogQueueProvider>
 *
 *   // In any descendant:
 *   const { open } = useDialogQueue();
 *   open({ content: (close) => <MyDialogContent onClose={close} /> });
 */
export function DialogQueueProvider({ children }: DialogQueueProviderProps) {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  // Monotonic counter for generating stable ids without useId (which
  // requires a component render cycle).
  const counterRef = useRef(0);

  const current = queue[0] ?? null;

  const open = useCallback((entry: Omit<DialogEntry, 'id'>): string => {
    counterRef.current += 1;
    const id = `dq-${counterRef.current}`;

    // Capture the active element at enqueue time so focus can be
    // returned to it when the dialog closes (Req 18.4).
    const resolvedTrigger: HTMLElement | null =
      entry.triggerRef ??
      (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null);

    const newEntry: QueueEntry = { ...entry, id, resolvedTrigger };
    setQueue((prev) => [...prev, newEntry]);
    return id;
  }, []);

  const close = useCallback((id?: string) => {
    setQueue((prev) => {
      if (prev.length === 0) return prev;

      if (id === undefined) {
        // Close the current (head) entry.
        return prev.slice(1);
      }

      // Remove a specific entry by id. If it is the head entry the next
      // one in the queue becomes current; if it is a queued entry it is
      // simply removed without affecting the current dialog.
      return prev.filter((e) => e.id !== id);
    });
  }, []);

  // Return focus to the trigger element after the current dialog closes.
  // We track the previous `current` entry so we know which trigger to
  // restore when `current` transitions from non-null to null (or to a
  // different entry).
  const prevCurrentRef = useRef<QueueEntry | null>(null);

  useEffect(() => {
    const prev = prevCurrentRef.current;
    prevCurrentRef.current = current;

    if (prev !== null && prev !== current) {
      // The previous dialog has closed (or been replaced). Restore focus
      // to its trigger element after a microtask so the Radix close
      // animation has a chance to unmount the portal before we move
      // focus — otherwise the focus ring may flash on the overlay.
      const trigger = prev.resolvedTrigger;
      if (trigger && typeof trigger.focus === 'function') {
        // Use a short timeout to let the Radix FocusScope release its
        // trap before we attempt to move focus outside the dialog.
        const handle = setTimeout(() => {
          // Guard: only restore if the element is still in the document
          // and focusable (not hidden, not disabled).
          if (
            document.contains(trigger) &&
            !trigger.hasAttribute('disabled') &&
            trigger.getAttribute('aria-disabled') !== 'true'
          ) {
            trigger.focus({ preventScroll: true });
          }
        }, 0);
        return () => clearTimeout(handle);
      }
    }
    return undefined;
  }, [current]);

  const value = useMemo<DialogQueueContextValue>(
    () => ({ open, close, current }),
    [open, close, current],
  );

  return (
    <DialogQueueContext.Provider value={value}>
      {children}
      {/* Render the current dialog entry's content. The content render
          function receives a bound `close` callback so it can dismiss
          itself without importing the queue context. */}
      {current !== null && current.content(() => close(current.id))}
    </DialogQueueContext.Provider>
  );
}

/**
 * Access the dialog queue from any descendant of `DialogQueueProvider`.
 *
 * Returns `{ open, close, current }`:
 * - `open(entry)` — push a dialog onto the queue; returns its stable id.
 * - `close(id?)` — close the current dialog or remove a queued entry.
 * - `current` — the entry currently being displayed, or `null`.
 *
 * When called outside a `DialogQueueProvider` (isolated tests, SSR
 * boundaries) this returns a neutral fallback that treats mutations as
 * no-ops so consumers do not crash.
 *
 * @example
 *   const { open, close, current } = useDialogQueue();
 *
 *   function handleDelete() {
 *     open({
 *       content: (close) => (
 *         <DialogContent>
 *           <DialogTitle>Delete project?</DialogTitle>
 *           <Button variant="danger" onClick={() => { doDelete(); close(); }}>
 *             Delete
 *           </Button>
 *           <Button variant="secondary" onClick={close}>Cancel</Button>
 *         </DialogContent>
 *       ),
 *     });
 *   }
 */
export function useDialogQueue(): DialogQueueContextValue {
  const ctx = useContext(DialogQueueContext);
  if (!ctx) {
    return {
      open: () => '',
      close: () => {},
      current: null,
    };
  }
  return ctx;
}
