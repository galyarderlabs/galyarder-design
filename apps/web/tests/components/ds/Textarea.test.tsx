// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { createRef } from 'react';

import { Textarea } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Textarea', () => {
  it('forwards ref to the textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} rows={3} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
