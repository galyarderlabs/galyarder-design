import { forwardRef } from 'react';
import type {
  ComponentPropsWithoutRef,
  ElementRef,
} from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from './_internal/cn';

export interface TabsProps extends ComponentPropsWithoutRef<typeof RadixTabs.Root> {
  /** `'horizontal'` (default — ←/→ navigate) or `'vertical'` (↑/↓ navigate). */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Tabs root. Built on `@radix-ui/react-tabs` so the keyboard
 * contract is native: ←/→ move between tabs in a horizontal list,
 * ↑/↓ move in a vertical list, and Tab from the active trigger
 * lands in the matching panel. Visual styling resolves through
 * Token_Layer custom properties.
 *
 * @example
 *   <Tabs defaultValue="overview">
 *     <TabsList aria-label="Project sections">
 *       <TabsTrigger value="overview">Overview</TabsTrigger>
 *       <TabsTrigger value="files">Files</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="overview">…</TabsContent>
 *     <TabsContent value="files">…</TabsContent>
 *   </Tabs>
 */
export const Tabs = forwardRef<ElementRef<typeof RadixTabs.Root>, TabsProps>(
  function Tabs({ orientation = 'horizontal', className, ...rest }, ref) {
    return (
      <RadixTabs.Root
        ref={ref}
        orientation={orientation}
        className={cn('ds-tabs', className)}
        {...rest}
      />
    );
  },
);

Tabs.displayName = 'Tabs';

export type TabsListProps = ComponentPropsWithoutRef<typeof RadixTabs.List>;

/**
 * Tablist container. Inherits `role="tablist"` and `data-orientation`
 * from `@radix-ui/react-tabs`.
 *
 * @example
 *   <TabsList aria-label="Settings sections">…</TabsList>
 */
export const TabsList = forwardRef<ElementRef<typeof RadixTabs.List>, TabsListProps>(
  function TabsList({ className, ...rest }, ref) {
    return (
      <RadixTabs.List
        ref={ref}
        className={cn('ds-tabs-list', className)}
        {...rest}
      />
    );
  },
);

TabsList.displayName = 'TabsList';

export type TabsTriggerProps = ComponentPropsWithoutRef<typeof RadixTabs.Trigger>;

/**
 * Single tab control. `role="tab"`, `aria-selected`, and the
 * `aria-controls` link to the matching panel are wired by Radix.
 *
 * @example
 *   <TabsTrigger value="overview">Overview</TabsTrigger>
 */
export const TabsTrigger = forwardRef<
  ElementRef<typeof RadixTabs.Trigger>,
  TabsTriggerProps
>(function TabsTrigger({ className, ...rest }, ref) {
  return (
    <RadixTabs.Trigger
      ref={ref}
      className={cn('ds-tabs-trigger', 'ds-focus-ring', className)}
      {...rest}
    />
  );
});

TabsTrigger.displayName = 'TabsTrigger';

export type TabsContentProps = ComponentPropsWithoutRef<typeof RadixTabs.Content>;

/**
 * Tab panel. Receives `role="tabpanel"`, `aria-labelledby`, and the
 * `hidden` attribute on inactive panels from Radix. Tab from the
 * active trigger lands here for screen-reader and keyboard users.
 *
 * @example
 *   <TabsContent value="overview">…</TabsContent>
 */
export const TabsContent = forwardRef<
  ElementRef<typeof RadixTabs.Content>,
  TabsContentProps
>(function TabsContent({ className, ...rest }, ref) {
  return (
    <RadixTabs.Content
      ref={ref}
      className={cn('ds-tabs-content', className)}
      {...rest}
    />
  );
});

TabsContent.displayName = 'TabsContent';
