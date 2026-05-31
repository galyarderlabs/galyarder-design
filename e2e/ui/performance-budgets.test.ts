/**
 * @feature unified-design-system-redesign
 * @property 9
 *
 * Lighthouse-driven performance test. Measures:
 * 1. FCP cold ≤ 1200ms on HomeView
 * 2. FCP warm ≤ 600ms on HomeView (second load with cache)
 * 3. LCP ≤ 2500ms on HomeView
 * 4. CLS contribution from non-streaming surfaces is zero
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const STORAGE_KEY = 'galyarder-design:config';

test.describe.configure({ timeout: 60_000 });

test.describe('performance budgets', () => {
  test.beforeEach(async ({ page }) => {
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

  test('FCP cold load ≤ 1200ms on HomeView', async ({ page }) => {
    // Clear browser cache for cold load
    const client = await page.context().newCDPSession(page);
    await client.send('Network.clearBrowserCache');

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const metrics = await collectPerformanceMetrics(page);

    // FCP should be ≤ 1200ms on cold load
    expect(metrics.fcp).toBeGreaterThan(0);
    expect(metrics.fcp).toBeLessThanOrEqual(1200);
  });

  test('FCP warm load ≤ 600ms on HomeView', async ({ page }) => {
    // First load to warm the cache
    await page.goto('/', { waitUntil: 'load' });
    await waitForLoading(page);

    // Second load with cache
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const metrics = await collectPerformanceMetrics(page);

    // FCP should be ≤ 600ms on warm load
    expect(metrics.fcp).toBeGreaterThan(0);
    expect(metrics.fcp).toBeLessThanOrEqual(600);
  });

  test('LCP ≤ 2500ms on HomeView', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await waitForLoading(page);

    const metrics = await collectPerformanceMetrics(page);

    // LCP should be ≤ 2500ms
    expect(metrics.lcp).toBeGreaterThan(0);
    expect(metrics.lcp).toBeLessThanOrEqual(2500);
  });

  test('CLS is zero outside streaming message container', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await waitForLoading(page);

    // Wait for layout to settle
    await page.waitForTimeout(2000);

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as PerformanceEntry & {
              hadRecentInput?: boolean;
              value?: number;
              sources?: Array<{ node?: Node }>;
            };
            if (!layoutShift.hadRecentInput && layoutShift.value) {
              // Check if the shift source is outside the streaming container
              const streamingContainer = document.querySelector(
                '[data-testid="chat-messages"], [class*="streaming"], [class*="chat-message"]',
              );
              const allOutsideStreaming = layoutShift.sources?.every((source) => {
                if (!source.node) return false;
                return streamingContainer ? !streamingContainer.contains(source.node) : true;
              });
              if (allOutsideStreaming) {
                clsValue += layoutShift.value;
              }
            }
          }
        });

        observer.observe({ type: 'layout-shift', buffered: true });

        // Resolve after a short delay to collect buffered entries
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 500);
      });
    });

    // CLS from non-streaming surfaces should be ≤ 0.01 (effectively zero)
    expect(cls).toBeLessThanOrEqual(0.01);
  });
});

async function waitForLoading(page: Page) {
  const loading = page.getByText('Loading Galyarder Design');
  await loading.waitFor({ state: 'detached', timeout: 10_000 }).catch(() => {});
}

async function collectPerformanceMetrics(page: Page) {
  return page.evaluate(() => {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find((e) => e.name === 'first-contentful-paint');
    const fcp = fcpEntry ? fcpEntry.startTime : 0;

    // LCP from PerformanceObserver — collect from largest-contentful-paint entries
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    const lastLcp = lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1] : null;
    const lcp = lastLcp ? lastLcp.startTime : 0;

    return { fcp, lcp };
  });
}
