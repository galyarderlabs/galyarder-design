/**
 * @feature unified-design-system-redesign
 * @property 7
 * @property 32
 *
 * RTL Playwright snapshots. Captures HomeView, ProjectView, and SettingsDialog
 * at dir="rtl" with locales ar and fa at 1024, 1440, and 1920px viewport widths.
 * Asserts no horizontal clipping (scrollWidth <= clientWidth on every visible
 * descendant) and that the html element carries dir="rtl".
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const STORAGE_KEY = 'galyarder-design:config';
const LOCALE_KEY = 'galyarder-design:locale';

const RTL_LOCALES = ['ar', 'fa'] as const;
const VIEWPORT_WIDTHS = [1024, 1440, 1920] as const;

test.describe.configure({ timeout: 60_000 });

for (const locale of RTL_LOCALES) {
  test.describe(`RTL locale=${locale}`, () => {
    for (const width of VIEWPORT_WIDTHS) {
      test.describe(`viewport=${width}px`, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ width, height: 900 });
          await page.addInitScript(
            ({ configKey, config, localeKey, localeVal }) => {
              window.localStorage.setItem(configKey, JSON.stringify(config));
              window.localStorage.setItem(localeKey, localeVal);
              window.localStorage.setItem('galyarder-design:locale-source', 'manual');
            },
            {
              configKey: STORAGE_KEY,
              localeKey: LOCALE_KEY,
              localeVal: locale,
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
            },
          );

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

        test('home view has no horizontal clipping', async ({ page }) => {
          await page.goto('/', { waitUntil: 'domcontentloaded' });
          await waitForLoading(page);

          const html = page.locator('html');
          await expect(html).toHaveAttribute('dir', 'rtl');
          await expect(html).toHaveAttribute('lang', locale);

          await expect(page.getByTestId('home-hero')).toBeVisible();

          await assertNoHorizontalClipping(page);
        });

        test('workspace view has no horizontal clipping', async ({ page }) => {
          await page.goto('/', { waitUntil: 'domcontentloaded' });
          await waitForLoading(page);

          await page.getByTestId('entry-nav-new-project').click();
          await expect(page.getByTestId('new-project-modal')).toBeVisible();
          await page.getByTestId('new-project-name').fill('RTL test');
          await page.getByTestId('create-project').click();

          await expect(page).toHaveURL(/\/projects\//);
          await expect(page.getByTestId('chat-composer')).toBeVisible();

          const html = page.locator('html');
          await expect(html).toHaveAttribute('dir', 'rtl');

          await assertNoHorizontalClipping(page);
        });

        test('settings dialog has no horizontal clipping', async ({ page }) => {
          await page.goto('/', { waitUntil: 'domcontentloaded' });
          await waitForLoading(page);

          await page.getByRole('button', { name: 'Open settings' }).click();
          const dialog = page.getByRole('dialog');
          await expect(dialog).toBeVisible();

          const html = page.locator('html');
          await expect(html).toHaveAttribute('dir', 'rtl');

          await assertNoHorizontalClipping(page);
        });
      });
    }
  });
}

async function waitForLoading(page: Page) {
  const loading = page.getByText('Loading Galyarder Design');
  await loading.waitFor({ state: 'detached', timeout: 10_000 }).catch(() => {});
}

async function assertNoHorizontalClipping(page: Page) {
  const result = await page.evaluate(() => {
    const clippingElements: string[] = [];
    const elements = document.body.querySelectorAll('*');

    for (const el of elements) {
      const htmlEl = el as HTMLElement;
      if (htmlEl.offsetWidth === 0 || htmlEl.offsetHeight === 0) continue;
      const style = window.getComputedStyle(htmlEl);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      if (style.position === 'fixed' || style.position === 'absolute') continue;

      const scrollW = htmlEl.scrollWidth;
      const clientW = htmlEl.clientWidth;
      if (scrollW > clientW + 1) {
        const tag = htmlEl.tagName.toLowerCase();
        const cls = htmlEl.className ? `.${String(htmlEl.className).split(' ').slice(0, 3).join('.')}` : '';
        const id = htmlEl.id ? `#${htmlEl.id}` : '';
        clippingElements.push(`${tag}${id}${cls} scrollWidth=${scrollW} clientWidth=${clientW}`);
      }
    }

    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) {
      clippingElements.push(`html scrollWidth=${document.documentElement.scrollWidth} clientWidth=${document.documentElement.clientWidth}`);
    }

    return { clippingElements };
  });

  expect(result.clippingElements).toHaveLength(0);
}
