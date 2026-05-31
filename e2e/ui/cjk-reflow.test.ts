/**
 * @feature unified-design-system-redesign
 * @property 7
 *
 * CJK reflow snapshots. Captures HomeView, ProjectView, and SettingsDialog
 * at locales ja and ko at 1024, 1440, and 1920px viewport widths.
 * Asserts no glyph extends beyond the inner padding box of any Card element
 * and that controls grow or wrap rather than truncate without indication.
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const STORAGE_KEY = 'galyarder-design:config';
const LOCALE_KEY = 'galyarder-design:locale';

const CJK_LOCALES = ['ja', 'ko'] as const;
const VIEWPORT_WIDTHS = [1024, 1440, 1920] as const;

test.describe.configure({ timeout: 60_000 });

for (const locale of CJK_LOCALES) {
  test.describe(`CJK locale=${locale}`, () => {
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

        test('home view CJK reflow — no card overflow', async ({ page }) => {
          await page.goto('/', { waitUntil: 'domcontentloaded' });
          await waitForLoading(page);

          const html = page.locator('html');
          await expect(html).toHaveAttribute('lang', locale);

          await expect(page.getByTestId('home-hero')).toBeVisible();

          await assertNoCardOverflow(page);
          await assertNoUnexpectedTruncation(page);
        });

        test('workspace view CJK reflow — no card overflow', async ({ page }) => {
          await page.goto('/', { waitUntil: 'domcontentloaded' });
          await waitForLoading(page);

          await page.getByTestId('entry-nav-new-project').click();
          await expect(page.getByTestId('new-project-modal')).toBeVisible();
          await page.getByTestId('new-project-name').fill('CJK test');
          await page.getByTestId('create-project').click();

          await expect(page).toHaveURL(/\/projects\//);
          await expect(page.getByTestId('chat-composer')).toBeVisible();

          await assertNoCardOverflow(page);
          await assertNoUnexpectedTruncation(page);
        });

        test('settings dialog CJK reflow — no card overflow', async ({ page }) => {
          await page.goto('/', { waitUntil: 'domcontentloaded' });
          await waitForLoading(page);

          await page.getByRole('button', { name: 'Open settings' }).click();
          const dialog = page.getByRole('dialog');
          await expect(dialog).toBeVisible();

          await assertNoCardOverflow(page);
        });
      });
    }
  });
}

async function waitForLoading(page: Page) {
  const loading = page.getByText('Loading Galyarder Design');
  await loading.waitFor({ state: 'detached', timeout: 10_000 }).catch(() => {});
}

/** Assert no text overflows the inner padding box of any Card-like element. */
async function assertNoCardOverflow(page: Page) {
  const result = await page.evaluate(() => {
    const violations: string[] = [];

    // Target elements that carry Card semantics or card-like styling
    const cards = document.querySelectorAll(
      '[class*="card"], [class*="Card"], [data-testid*="card"], article, section, .ds-card',
    );

    for (const card of cards) {
      const el = card as HTMLElement;
      if (el.offsetWidth === 0 || el.offsetHeight === 0) continue;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;

      const paddingLeft = parseFloat(style.paddingLeft);
      const paddingRight = parseFloat(style.paddingRight);
      const innerWidth = el.clientWidth - paddingLeft - paddingRight;

      // Check if any child text overflows the inner area
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const textNode = walker.currentNode;
        const range = document.createRange();
        range.selectNodeContents(textNode);
        const rects = range.getClientRects();
        for (const rect of rects) {
          const cardRect = el.getBoundingClientRect();
          const cardInnerLeft = cardRect.left + paddingLeft;
          const cardInnerRight = cardRect.right - paddingRight;
          if (rect.left < cardInnerLeft - 1 || rect.right > cardInnerRight + 1) {
            const text = textNode.textContent?.slice(0, 40) ?? '';
            violations.push(`text "${text}…" overflows card inner box`);
            break;
          }
        }
      }
    }

    return { violations };
  });

  expect(result.violations).toHaveLength(0);
}

/** Assert buttons and interactive controls don't truncate text via ellipsis without tooltip. */
async function assertNoUnexpectedTruncation(page: Page) {
  const result = await page.evaluate(() => {
    const violations: string[] = [];

    const controls = document.querySelectorAll('button, [role="button"], a, label, [class*="badge"], [class*="Badge"], [class*="tag"], [class*="Tag"]');

    for (const ctrl of controls) {
      const el = ctrl as HTMLElement;
      if (el.offsetWidth === 0 || el.offsetHeight === 0) continue;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;

      // If the element uses text-overflow: ellipsis, it must have a title or aria-label
      if (style.textOverflow === 'ellipsis' || style.overflow === 'hidden') {
        if (el.scrollWidth > el.clientWidth + 1) {
          const hasTooltip = el.hasAttribute('title') || el.hasAttribute('aria-label');
          if (!hasTooltip) {
            const text = el.textContent?.trim().slice(0, 40) ?? '';
            violations.push(`control "${text}" is truncated without tooltip/aria-label`);
          }
        }
      }
    }

    return { violations };
  });

  expect(result.violations).toHaveLength(0);
}
