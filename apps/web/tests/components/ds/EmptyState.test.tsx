// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Button, EmptyState } from '../../../src/components/ds';

afterEach(() => cleanup());

describe('ds/EmptyState', () => {
  it('forwards ref to the wrapping div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyState ref={ref} title="No projects yet" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders title, description, and primary action', () => {
    render(
      <EmptyState
        title="No projects yet"
        description="Create your first project to get started."
        action={<Button variant="primary">Create project</Button>}
      />,
    );
    expect(screen.getByRole('heading', { name: 'No projects yet' })).toBeTruthy();
    expect(screen.getByText('Create your first project to get started.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Create project' })).toBeTruthy();
  });
});
