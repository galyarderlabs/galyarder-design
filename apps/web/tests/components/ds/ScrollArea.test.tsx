// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { ScrollArea } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/ScrollArea', () => {
  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScrollArea ref={ref}>content</ScrollArea>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('exposes role=region and aria-label when ariaLabel is provided', () => {
    render(<ScrollArea ariaLabel="File list">content</ScrollArea>);
    const region = screen.getByRole('region', { name: 'File list' });
    expect(region).toBeTruthy();
  });

  it('does not add role=region when ariaLabel is omitted', () => {
    render(<ScrollArea>content</ScrollArea>);
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('accepts viewportClassName without error', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref} viewportClassName="custom-viewport">
        content
      </ScrollArea>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges extra className onto the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScrollArea ref={ref} className="extra-class">content</ScrollArea>);
    expect(ref.current?.classList.contains('ds-scroll-area')).toBe(true);
    expect(ref.current?.classList.contains('extra-class')).toBe(true);
  });

  it('renders children inside the viewport', () => {
    render(<ScrollArea>hello world</ScrollArea>);
    expect(screen.getByText('hello world')).toBeTruthy();
  });
});
