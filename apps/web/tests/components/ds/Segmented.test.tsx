// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';

import { Segmented, SegmentedItem } from '../../../src/components/ds/Segmented';

afterEach(() => cleanup());

describe('ds/Segmented', () => {
  it('forwards ref to the underlying div root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Segmented ref={ref} defaultValue="preview" aria-label="Render mode">
        <SegmentedItem value="preview">Preview</SegmentedItem>
        <SegmentedItem value="source">Source</SegmentedItem>
      </Segmented>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.classList.contains('ds-segmented')).toBe(true);
  });

  it('locks type to single — renders items as radio buttons', () => {
    render(
      <Segmented defaultValue="preview" aria-label="Render mode">
        <SegmentedItem value="preview">Preview</SegmentedItem>
        <SegmentedItem value="source">Source</SegmentedItem>
      </Segmented>,
    );
    // Radix ToggleGroup type="single" exposes items as role=radio.
    expect(screen.getByRole('radio', { name: 'Preview' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Source' })).toBeTruthy();
  });

  it('moves roving focus to the next item on right arrow', async () => {
    render(
      <Segmented defaultValue="preview" aria-label="Render mode">
        <SegmentedItem value="preview">Preview</SegmentedItem>
        <SegmentedItem value="source">Source</SegmentedItem>
      </Segmented>,
    );

    const preview = screen.getByRole('radio', { name: 'Preview' });
    const source = screen.getByRole('radio', { name: 'Source' });

    preview.focus();
    expect(document.activeElement).toBe(preview);

    fireEvent.keyDown(preview, { key: 'ArrowRight' });
    // Radix roving-focus schedules the focus move in a setTimeout(0).
    await waitFor(() => expect(document.activeElement).toBe(source));
  });

  it('moves roving focus to the previous item on left arrow', async () => {
    render(
      <Segmented defaultValue="source" aria-label="Render mode">
        <SegmentedItem value="preview">Preview</SegmentedItem>
        <SegmentedItem value="source">Source</SegmentedItem>
      </Segmented>,
    );

    const preview = screen.getByRole('radio', { name: 'Preview' });
    const source = screen.getByRole('radio', { name: 'Source' });

    source.focus();
    expect(document.activeElement).toBe(source);

    fireEvent.keyDown(source, { key: 'ArrowLeft' });
    await waitFor(() => expect(document.activeElement).toBe(preview));
  });

  it('invokes onValueChange with the activated value', () => {
    const onValueChange = vi.fn();
    render(
      <Segmented
        defaultValue="preview"
        aria-label="Render mode"
        onValueChange={onValueChange}
      >
        <SegmentedItem value="preview">Preview</SegmentedItem>
        <SegmentedItem value="source">Source</SegmentedItem>
      </Segmented>,
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Source' }));
    expect(onValueChange).toHaveBeenCalledWith('source');
  });

  it('exposes data-density on the root element', () => {
    render(
      <Segmented
        defaultValue="preview"
        aria-label="Render mode"
        density="compact"
      >
        <SegmentedItem value="preview">Preview</SegmentedItem>
        <SegmentedItem value="source">Source</SegmentedItem>
      </Segmented>,
    );

    const root = screen.getByRole('group', { name: 'Render mode' });
    expect(root.getAttribute('data-density')).toBe('compact');
  });

  it('exposes data-size on the root element', () => {
    render(
      <Segmented
        defaultValue="preview"
        aria-label="Render mode"
        size="sm"
      >
        <SegmentedItem value="preview">Preview</SegmentedItem>
        <SegmentedItem value="source">Source</SegmentedItem>
      </Segmented>,
    );

    const root = screen.getByRole('group', { name: 'Render mode' });
    expect(root.getAttribute('data-size')).toBe('sm');
  });
});
