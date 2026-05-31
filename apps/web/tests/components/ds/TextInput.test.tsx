// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { createRef } from 'react';

import { TextInput } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/TextInput', () => {
  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput ref={ref} placeholder="Search" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('flags invalid state on the wrapping shell and input', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<TextInput ref={ref} invalid placeholder="Email" />);
    expect(container.querySelector('.ds-input[data-invalid="true"]')).toBeTruthy();
    expect(ref.current?.getAttribute('aria-invalid')).toBe('true');
  });
});
