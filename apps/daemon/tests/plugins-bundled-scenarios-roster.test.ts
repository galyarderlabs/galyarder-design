// Plan §3.N4 / spec §23.3.3 — bundled scenario plugins roster.
//
// Each `taskKind` enum value (new-generation / code-migration /
// figma-migration / tune-collab) maps to exactly one *canonical* bundled
// `gd.kind: 'scenario'` plugin under `plugins/_official/scenarios/`.
// The daemon's bundled boot walker registers all sibling scenarios; the
// canonical winner per taskKind is selected by `collectBundledScenarios`
// using the `gd-<taskKind>` id rule, so additional scenarios (e.g.
// `gd-media-generation`) can ride along without hijacking the
// pipeline-fallback.

import path from 'node:path';
import url from 'node:url';
import { readFile, readdir, stat } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const scenariosRoot = path.join(repoRoot, 'plugins', '_official', 'scenarios');

const CANONICAL = new Map<string, { taskKind: string; pipelineStages: string[] }>([
  ['gd-new-generation',  { taskKind: 'new-generation',  pipelineStages: ['discovery', 'plan', 'generate', 'critique'] }],
  ['gd-figma-migration', { taskKind: 'figma-migration', pipelineStages: ['extract', 'tokens', 'generate', 'critique'] }],
  ['gd-code-migration',  { taskKind: 'code-migration',  pipelineStages: ['import', 'tokens', 'plan', 'verify', 'review', 'handoff'] }],
  ['gd-tune-collab',     { taskKind: 'tune-collab',     pipelineStages: ['direction', 'patch', 'critique', 'handoff'] }],
]);

// Non-canonical scenarios. These ride on a canonical taskKind but
// don't win the pipeline-fallback for it. The kind → scenario map in
// `@galyarder-design/contracts/scenario-defaults` is what routes UX
// project kinds (image / video / audio) onto these plugins. Export
// starters sit here too: they are user-facing plugins for downstream
// handoff, but they must not become the canonical tune-collab fallback.
const SIBLINGS = new Map<string, { taskKind: string }>([
  ['gd-default',          { taskKind: 'new-generation' }],
  ['gd-media-generation', { taskKind: 'new-generation' }],
  ['gd-plugin-authoring', { taskKind: 'new-generation' }],
  ['gd-design-refine',    { taskKind: 'tune-collab' }],
  ['gd-react-export',     { taskKind: 'tune-collab' }],
  ['gd-nextjs-export',    { taskKind: 'tune-collab' }],
  ['gd-vue-export',       { taskKind: 'tune-collab' }],
]);

describe('plugins/_official/scenarios roster', () => {
  it('contains every canonical scenario folder (plus the documented siblings)', async () => {
    const entries = await readdir(scenariosRoot, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
    const expected = [...CANONICAL.keys(), ...SIBLINGS.keys()].sort();
    expect(dirs).toEqual(expected);
  });

  for (const [folder, expected] of CANONICAL) {
    it(`${folder} declares gd.kind='scenario' + the canonical pipeline shape`, async () => {
      const manifestPath = path.join(scenariosRoot, folder, 'galyarder-design.json');
      const skillPath = path.join(scenariosRoot, folder, 'SKILL.md');
      expect((await stat(manifestPath)).isFile()).toBe(true);
      expect((await stat(skillPath)).isFile()).toBe(true);
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
      expect(manifest.name).toBe(folder);
      expect(manifest.gd.kind).toBe('scenario');
      expect(manifest.gd.taskKind).toBe(expected.taskKind);
      const stageIds = manifest.gd.pipeline.stages.map((s: { id: string }) => s.id);
      expect(stageIds).toEqual(expected.pipelineStages);
    });
  }

  for (const [folder, expected] of SIBLINGS) {
    it(`${folder} declares gd.kind='scenario' + a non-empty pipeline + the documented taskKind`, async () => {
      const manifestPath = path.join(scenariosRoot, folder, 'galyarder-design.json');
      const skillPath = path.join(scenariosRoot, folder, 'SKILL.md');
      expect((await stat(manifestPath)).isFile()).toBe(true);
      expect((await stat(skillPath)).isFile()).toBe(true);
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
      expect(manifest.name).toBe(folder);
      expect(manifest.gd.kind).toBe('scenario');
      expect(manifest.gd.taskKind).toBe(expected.taskKind);
      expect(Array.isArray(manifest.gd.pipeline?.stages)).toBe(true);
      expect(manifest.gd.pipeline.stages.length).toBeGreaterThan(0);
      // Sibling scenarios MUST NOT use the canonical id, otherwise the
      // pipeline-fallback dedupe rule (`id === gd-<taskKind>`) would
      // mis-select the sibling as the canonical winner.
      expect(folder).not.toBe(`gd-${expected.taskKind}`);
    });
  }

  it('gd-default is hidden and asks for task type through a GenUI surface', async () => {
    const manifestPath = path.join(scenariosRoot, 'gd-default', 'galyarder-design.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    expect(manifest.gd.hidden).toBe(true);
    expect(manifest.gd.pipeline.stages[0].id).toBe('task-type');
    expect(manifest.gd.genui.surfaces).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'task-type',
          kind: 'choice',
          trigger: expect.objectContaining({ stageId: 'task-type' }),
        }),
      ]),
    );
  });
});
