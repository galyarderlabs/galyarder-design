// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../src/components/ds/Tabs';

afterEach(() => cleanup());

describe('ds/Tabs', () => {
  it('forwards refs to the root, list, trigger, and content nodes', () => {
    const rootRef = createRef<HTMLDivElement>();
    const listRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Tabs ref={rootRef} defaultValue="overview">
        <TabsList ref={listRef} aria-label="Sections">
          <TabsTrigger ref={triggerRef} value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <TabsContent ref={contentRef} value="overview">
          overview panel
        </TabsContent>
        <TabsContent value="files">files panel</TabsContent>
      </Tabs>,
    );

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
    expect(listRef.current?.getAttribute('role')).toBe('tablist');
    expect(triggerRef.current?.getAttribute('role')).toBe('tab');
    expect(contentRef.current?.getAttribute('role')).toBe('tabpanel');
  });

  it('defaults orientation to horizontal and propagates to the tablist', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList aria-label="Sections">
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">a</TabsContent>
        <TabsContent value="b">b</TabsContent>
      </Tabs>,
    );
    const tablist = screen.getByRole('tablist', { name: 'Sections' });
    expect(tablist.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('passes vertical orientation through to the tablist', () => {
    render(
      <Tabs defaultValue="a" orientation="vertical">
        <TabsList aria-label="Sections">
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">a</TabsContent>
        <TabsContent value="b">b</TabsContent>
      </Tabs>,
    );
    const tablist = screen.getByRole('tablist', { name: 'Sections' });
    expect(tablist.getAttribute('data-orientation')).toBe('vertical');
  });
});
