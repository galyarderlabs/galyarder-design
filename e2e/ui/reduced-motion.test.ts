/**
 * @feature unified-design-system-redesign
 * @property 5
 * @property 6
 *
 * Reduced-motion smoke pass. Toggles prefers-reduced-motion: reduce and asserts:
 * 1. Every --duration-* CSS token resolves to 0ms
 * 2. Skeleton shimmer animation is disabled
 * 3. Decorative transitions render as instantaneous state changes
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const STORAGE_KEY = 'galyarder-design:config';

test.describe.configure({ timeout: 30_000 });

test.describe('reduced-motion', () => {
  test.beforeEach(async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.addInitScript(({ configKey, config }) => {
      window.localStorage.setItem(configKey, JSON.stringify(config));
    }, {
      configKey: STORAGE_KEY,
      config: {
        mode: 'daemon',
        apiKey: '',
        baseUrl: 'https://api.anthropic.com',
        model: 'claude-sonnet-4-5',
        agentId: 'mock',
        skillId: null,
        designSystemId: null,
        onboardingCompleted: true,
        agentModels: {},
        privacyDecisionAt: 1,
        telemetry: { metrics: false, content: false, artifactManifest: false },
      },
    });

    await page.route('**/api/agents', async (route) => {
      await route.fulfill({
        json: {
          agents: [
            {
              id: 'mock',
              name: 'Mock Agent',
              bin: 'mock-agent',
              available: true,
              version: 'test',
              models: [{ id: 'default', label: 'Default' }],
            },
          ],
        },
      });
    });

    await page.route('**/api/app-config', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await route.fulfill({
        json: {
          config: {
            onboardingCompleted: true,
            agentId: 'mock',
            skillId: null,
            designSystemId: null,
            agentModels: {},
            privacyDecisionAt: 1,
            telemetry: { metrics: false, content: false, artifactManifest: false },
          },
        },
      });
    });
  });

  test('all --duration-* tokens resolve to 0ms under reduced motion', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForLoading(page);

    const result = await page.evaluate(() => {
      const root = document.documentElement;
      const computed = window.getComputedStyle(root);
      const durationTokens: { name: string; value: string }[] = [];

      // Walk all CSS custom properties on :root
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
              for (const prop of rule.style) {
                if (prop.startsWith('--duration-')) {
                  const val = computed.getPropertyValue(prop).trim();
                  durationTokens.push({ name: prop, value: val });
                }
              }
            }
          }
        } catch {
          // Cross-origin sheets may throw
        }
      }

      const nonZero = durationTokens.filter((t) => t.value !== '0ms' && t.value !== '0s' && t.value !== '0');
      return { durationTokens, nonZero };
    });

    expect(result.nonZero).toHaveLength(0);
  });

  test('skeleton shimmer animation is disabled under reduced motion', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForLoading(page);

    const result = await page.evaluate(() => {
      // Check the skeleton CSS class for animation
      const skeletons = document.querySelectorAll('[class*="skeleton"], [class*="Skeleton"], .ds-skeleton');
      const violations: string[] = [];

      for (const el of skeletons) {
        const style = window.getComputedStyle(el as HTMLElement);
        const animation = style.animationName;
        const duration = style.animationDuration;

        if (animation !== 'none' && animation !== '') {
          // Duration must be 0ms if animation name exists
          if (duration !== '0ms' && duration !== '0s' && duration !== '0') {
            violations.push(`skeleton has animation "${animation}" with duration "${duration}"`);
          }
        }
      }

      // Also check the shimmer keyframe doesn't run
      const allAnimated = document.querySelectorAll('*');
      for (const el of allAnimated) {
        const style = window.getComputedStyle(el as HTMLElement);
        if (style.animationName?.includes('shimmer') || style.animationName?.includes('pulse')) {
          if (style.animationDuration !== '0ms' && style.animationDuration !== '0s' && style.animationDuration !== '0') {
            violations.push(`element has shimmer/pulse animation with duration "${style.animationDuration}"`);
          }
        }
      }

      return { violations };
    });

    expect(result.violations).toHaveLength(0);
  });

  test('accordion collapse/expand is instantaneous under reduced motion', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForLoading(page);

    // Navigate to settings which has accordion sections
    await page.getByRole('button', { name: 'Open settings' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const result = await page.evaluate(() => {
      const violations: string[] = [];
      const collapsibles = document.querySelectorAll('.accordion-collapsible, [class*="accordion"]');

      for (const el of collapsibles) {
        const style = window.getComputedStyle(el as HTMLElement);
        const transition = style.transition;
        const duration = style.transitionDuration;

        // If a transition exists, its duration must be 0ms
        if (transition && transition !== 'none' && transition !== '') {
          if (duration !== '0ms' && duration !== '0s' && duration !== '0') {
            violations.push(`accordion has transition with duration "${duration}"`);
          }
        }
      }

      return { violations };
    });

    expect(result.violations).toHaveLength(0);
  });
});

async function waitForLoading(page: Page) {
  const loading = page.getByText('Loading Galyarder Design');
  await loading.waitFor({ state: 'detached', timeout: 10_000 }).catch(() => {});
}
