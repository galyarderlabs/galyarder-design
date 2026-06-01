// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SkillsSection } from '../../src/components/SkillsSection';
import { I18nProvider } from '../../src/i18n';
import type { AppConfig } from '../../src/types';
import type { SkillSummary } from '@galyarder-design/contracts';

// Mock ResizeObserver and scrollIntoView for Combobox/cmdk/JSDOM compatibility
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

const originalFetch = globalThis.fetch;

const TEST_CONFIG: AppConfig = {
  mode: 'daemon',
  apiKey: '',
  baseUrl: '',
  model: '',
  agentId: null,
  skillId: null,
  designSystemId: null,
  disabledSkills: [],
};

function makeSkill(overrides: Partial<SkillSummary>): SkillSummary {
  return {
    id: 'skill',
    name: 'Skill',
    description: 'A skill',
    triggers: [],
    mode: 'prototype',
    previewType: 'html',
    designSystemRequired: true,
    defaultFor: [],
    upstream: null,
    hasBody: true,
    examplePrompt: '',
    aggregatesExamples: false,
    source: 'built-in',
    ...overrides,
  };
}

function renderSkillsSection(skills: SkillSummary[], skillDetails: Record<string, any> = {}) {
  const setCfg = vi.fn();
  globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    if (url === '/api/skills' && (!init || init.method === undefined)) {
      return new Response(JSON.stringify({ skills }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
    if (url.startsWith('/api/skills/') && (!init || init.method === undefined)) {
      const parts = url.split('/');
      const id = parts[parts.length - 1] as string;
      const detail = skillDetails[id] || { id, name: id, body: `Body for ${id}` };
      return new Response(JSON.stringify(detail), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({}), { status: 404 });
  }) as typeof fetch;

  render(
    <I18nProvider initial="en">
      <SkillsSection
        cfg={TEST_CONFIG}
        setCfg={setCfg}
      />
    </I18nProvider>,
  );
  return { fetchMock: globalThis.fetch as ReturnType<typeof vi.fn>, setCfg };
}

describe('SkillsSection', () => {
  afterEach(() => {
    cleanup();
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('renders active skills and category badges in a card grid', async () => {
    renderSkillsSection([
      makeSkill({
        id: 'test-skill',
        name: 'Test Skill',
        description: 'Test description',
        category: 'code-generation',
        mode: 'prototype',
      }),
    ]);

    const cardTitle = await screen.findByText('Test Skill');
    expect(cardTitle).toBeTruthy();

    const cardDesc = screen.getByText('Test description');
    expect(cardDesc).toBeTruthy();

    const categoryBadge = screen.getByText('Code Generation');
    expect(categoryBadge).toBeTruthy();

    const modeBadge = screen.getByText('prototype');
    expect(modeBadge).toBeTruthy();
  });

  it('toggles the switch to enable/disable skills via local config setCfg', async () => {
    const { setCfg } = renderSkillsSection([
      makeSkill({
        id: 'toggle-skill',
        name: 'Toggle Skill',
      }),
    ]);

    const switchEl = await screen.findByRole('switch', { name: /Toggle/i });
    expect(switchEl).toBeTruthy();
    expect(switchEl.getAttribute('aria-checked')).toBe('true');

    fireEvent.click(switchEl);

    expect(setCfg).toHaveBeenCalled();
    const call = setCfg.mock.calls[0];
    if (!call) throw new Error('Expected setCfg to be called');
    const updater = call[0];
    const nextCfg = updater({ disabledSkills: [] });
    expect(nextCfg.disabledSkills).toContain('toggle-skill');
  });

  it('clicking a card activates the inline detail surface, fetching its body dynamically', async () => {
    const { fetchMock } = renderSkillsSection(
      [
        makeSkill({
          id: 'detail-skill',
          name: 'Detail Skill',
          description: 'A beautiful skill',
        }),
      ],
      {
        'detail-skill': {
          id: 'detail-skill',
          name: 'Detail Skill',
          body: 'DYNAMIC_BODY_CONTENT',
        },
      },
    );

    const cardTrigger = await screen.findByRole('button', { name: /Open Detail Skill detail/i });
    fireEvent.click(cardTrigger);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/skills/detail-skill');
    });

    const detailHeader = await screen.findByRole('heading', { name: 'Detail Skill', level: 3 });
    expect(detailHeader).toBeTruthy();

    const bodyText = await screen.findByText('DYNAMIC_BODY_CONTENT');
    expect(bodyText).toBeTruthy();

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByText('DYNAMIC_BODY_CONTENT')).toBeNull();
    });
  });

  it('renders derived parameter controls and controls state in the inline detail surface', async () => {
    renderSkillsSection(
      [
        makeSkill({
          id: 'param-skill',
          name: 'Param Skill',
          surface: 'web',
          speakerNotes: true,
          examplePrompt: 'initial custom prompt',
        }),
      ],
      {
        'param-skill': {
          id: 'param-skill',
          name: 'Param Skill',
          body: 'some body',
        },
      },
    );

    const cardTrigger = await screen.findByRole('button', { name: /Open Param Skill detail/i });
    fireEvent.click(cardTrigger);

    const parametersHeader = await screen.findByRole('heading', { name: 'Parameters', level: 4 });
    expect(parametersHeader).toBeTruthy();

    const surfaceLabel = screen.getAllByText('Surface')[0];
    expect(surfaceLabel).toBeTruthy();

    const notesLabel = screen.getByText('Speaker notes');
    expect(notesLabel).toBeTruthy();

    const promptInput = screen.getByDisplayValue('initial custom prompt');
    expect(promptInput).toBeTruthy();

    fireEvent.change(promptInput, { target: { value: 'updated custom prompt' } });
    expect(screen.getByDisplayValue('updated custom prompt')).toBeTruthy();
  });
});
