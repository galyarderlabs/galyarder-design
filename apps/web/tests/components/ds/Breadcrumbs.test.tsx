// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Breadcrumbs } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/Breadcrumbs', () => {
  it('forwards ref and marks the last item as current', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Breadcrumbs
        ref={ref}
        items={[
          { label: 'Home', href: '/' },
          { label: 'Project' },
        ]}
      />,
    );
    expect(ref.current?.tagName.toLowerCase()).toBe('nav');
    const current = screen.getByText('Project').closest('[aria-current]');
    expect(current?.getAttribute('aria-current')).toBe('page');
  });
});
