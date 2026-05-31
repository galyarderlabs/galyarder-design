// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';

import { Slider } from '../../../src/components/ds/Slider';

// @radix-ui/react-slider uses ResizeObserver internally; jsdom doesn't
// ship it, so we stub it with a no-op implementation.
beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ds/Slider', () => {
  it('forwards ref to the underlying slider root element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Slider ref={ref} defaultValue={[50]} aria-label="Volume" />,
    );
    // Radix renders the root as a `<span role="group">` (or a span
    // with the slider role when there is a single thumb).
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('renders a slider thumb with role=slider', () => {
    const { container } = render(<Slider defaultValue={[30]} aria-label="Brightness" />);
    // Radix puts aria-label on the root span; the thumb is the inner span with role=slider.
    const root = container.querySelector('[aria-label="Brightness"]');
    expect(root).toBeTruthy();
    const thumb = container.querySelector('[role="slider"]');
    expect(thumb).toBeTruthy();
  });

  it('reflects the initial value via aria-valuenow', () => {
    const { container } = render(<Slider defaultValue={[42]} min={0} max={100} aria-label="Opacity" />);
    const thumb = container.querySelector('[role="slider"]');
    expect(thumb?.getAttribute('aria-valuenow')).toBe('42');
  });

  it('reflects min and max via aria-valuemin / aria-valuemax', () => {
    const { container } = render(
      <Slider defaultValue={[10]} min={5} max={50} aria-label="Scale" />,
    );
    const thumb = container.querySelector('[role="slider"]');
    expect(thumb?.getAttribute('aria-valuemin')).toBe('5');
    expect(thumb?.getAttribute('aria-valuemax')).toBe('50');
  });

  it('moves the thumb right with ArrowRight', () => {
    const { container } = render(
      <Slider defaultValue={[40]} min={0} max={100} step={10} aria-label="Speed" />,
    );
    const thumb = container.querySelector('[role="slider"]') as HTMLElement;
    expect(thumb).toBeTruthy();
    thumb.focus();
    fireEvent.keyDown(thumb, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(thumb.getAttribute('aria-valuenow')).toBe('50');
  });

  it('moves the thumb left with ArrowLeft', () => {
    const { container } = render(
      <Slider defaultValue={[40]} min={0} max={100} step={10} aria-label="Speed" />,
    );
    const thumb = container.querySelector('[role="slider"]') as HTMLElement;
    expect(thumb).toBeTruthy();
    thumb.focus();
    fireEvent.keyDown(thumb, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(thumb.getAttribute('aria-valuenow')).toBe('30');
  });

  it('jumps to min with Home key', () => {
    const { container } = render(
      <Slider defaultValue={[60]} min={0} max={100} step={1} aria-label="Level" />,
    );
    const thumb = container.querySelector('[role="slider"]') as HTMLElement;
    expect(thumb).toBeTruthy();
    thumb.focus();
    fireEvent.keyDown(thumb, { key: 'Home', code: 'Home' });
    expect(thumb.getAttribute('aria-valuenow')).toBe('0');
  });

  it('jumps to max with End key', () => {
    const { container } = render(
      <Slider defaultValue={[40]} min={0} max={100} step={1} aria-label="Level" />,
    );
    const thumb = container.querySelector('[role="slider"]') as HTMLElement;
    expect(thumb).toBeTruthy();
    thumb.focus();
    fireEvent.keyDown(thumb, { key: 'End', code: 'End' });
    expect(thumb.getAttribute('aria-valuenow')).toBe('100');
  });

  it('renders marks with aria-hidden', () => {
    const { container } = render(
      <Slider
        defaultValue={[50]}
        min={0}
        max={100}
        aria-label="Range"
        marks={[
          { value: 0, label: 'Low' },
          { value: 50 },
          { value: 100, label: 'High' },
        ]}
      />,
    );
    const marksRow = container.querySelector('.ds-slider-marks');
    expect(marksRow).toBeTruthy();
    expect(marksRow?.getAttribute('aria-hidden')).toBe('true');
    // Three marks rendered
    const marks = container.querySelectorAll('.ds-slider-mark');
    expect(marks).toHaveLength(3);
  });

  it('renders mark labels when provided', () => {
    const { container } = render(
      <Slider
        defaultValue={[0]}
        min={0}
        max={100}
        aria-label="Range"
        marks={[
          { value: 0, label: 'Start' },
          { value: 100, label: 'End' },
        ]}
      />,
    );
    const labels = container.querySelectorAll('.ds-slider-mark-label');
    expect(labels).toHaveLength(2);
    expect(labels.item(0).textContent).toBe('Start');
    expect(labels.item(1).textContent).toBe('End');
  });

  it('omits marks outside [min, max]', () => {
    const { container } = render(
      <Slider
        defaultValue={[50]}
        min={10}
        max={90}
        aria-label="Range"
        marks={[
          { value: 0 },   // below min — should be filtered
          { value: 50 },  // in range
          { value: 100 }, // above max — should be filtered
        ]}
      />,
    );
    const marks = container.querySelectorAll('.ds-slider-mark');
    expect(marks).toHaveLength(1);
  });

  it('renders no marks row when marks prop is omitted', () => {
    const { container } = render(
      <Slider defaultValue={[50]} aria-label="Range" />,
    );
    expect(container.querySelector('.ds-slider-marks')).toBeNull();
  });
});
