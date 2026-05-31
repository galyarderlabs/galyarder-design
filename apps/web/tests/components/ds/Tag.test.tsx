// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Tag } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Tag', () => {
  it('forwards ref to the wrapping span', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Tag ref={ref}>typescript</Tag>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('exposes a remove button when onRemove is provided', () => {
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} removeLabel="Remove typescript">
        typescript
      </Tag>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Remove typescript' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
