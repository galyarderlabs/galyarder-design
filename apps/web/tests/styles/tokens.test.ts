import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const tokens = readFileSync(
  new URL('../../src/styles/tokens.css', import.meta.url),
  'utf8',
);

describe('design tokens', () => {
  it('declares the 12-step neutral ramp in :root and dark variants', () => {
    for (let i = 0; i <= 11; i += 1) {
      expect(tokens).toContain(`--neutral-${i}:`);
    }
  });

  it('declares the spacing scale and semantic aliases', () => {
    for (const step of [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24]) {
      expect(tokens).toContain(`--space-${step}:`);
    }
    expect(tokens).toMatch(/--gutter:\s*var\(--space-\d+\);/);
    expect(tokens).toMatch(/--section-gap:\s*var\(--space-\d+\);/);
    expect(tokens).toMatch(/--card-padding:\s*var\(--space-\d+\);/);
  });

  it('declares the motion easing as cubic-bezier(0.23, 1, 0.32, 1)', () => {
    expect(tokens).toContain('cubic-bezier(0.23, 1, 0.32, 1)');
  });

  it('declares enter/exit duration tokens at 200ms / 140ms', () => {
    expect(tokens).toMatch(/--duration-enter:\s*200ms/);
    expect(tokens).toMatch(/--duration-exit:\s*140ms/);
  });

  it('declares a strictly ordered z-index scale', () => {
    const re =
      /--z-base:\s*(\d+);[\s\S]*--z-dropdown:\s*(\d+);[\s\S]*--z-sticky:\s*(\d+);[\s\S]*--z-overlay:\s*(\d+);[\s\S]*--z-modal:\s*(\d+);[\s\S]*--z-toast:\s*(\d+);/;
    const match = tokens.match(re);
    expect(match).toBeTruthy();
    if (!match) return;
    const values = match.slice(1).map(Number);
    for (let i = 1; i < values.length; i += 1) {
      const prev = values[i - 1];
      const curr = values[i];
      if (prev === undefined || curr === undefined) throw new Error('z-index regex parse failed');
      expect(curr).toBeGreaterThan(prev);
    }
  });

  it('collapses every duration to 0ms under prefers-reduced-motion', () => {
    expect(tokens).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    const reducedBlock = tokens.split('@media (prefers-reduced-motion: reduce)')[1] ?? '';
    expect(reducedBlock).toContain('--duration-snap: 0ms');
    expect(reducedBlock).toContain('--duration-base: 0ms');
    expect(reducedBlock).toContain('--duration-gentle: 0ms');
    expect(reducedBlock).toContain('--duration-enter: 0ms');
    expect(reducedBlock).toContain('--duration-exit: 0ms');
  });

  it('exposes the density multiplier and compact override', () => {
    expect(tokens).toMatch(/--density-multiplier:\s*1;/);
    expect(tokens).toContain('[data-density="compact"]');
    expect(tokens).toMatch(/--density-multiplier:\s*0\.85/);
  });
});
