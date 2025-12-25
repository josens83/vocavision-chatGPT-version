import { test, expect } from '@playwright/test';

const LCP_BUDGET_MS = 4000;
const CLS_BUDGET = 0.1;

test.describe('Landing performance budgets', () => {
  test('keeps LCP/CLS within budget on home page', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__cls = 0;
      (window as any).__lcp = 0;

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LayoutShift[]) {
          if (!entry.hadRecentInput) {
            (window as any).__cls += entry.value;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        (window as any).__lcp = lastEntry?.renderTime || lastEntry?.loadTime || 0;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const metrics = await page.evaluate(() => ({
      lcp: (window as any).__lcp,
      cls: (window as any).__cls,
    }));

    expect(metrics.lcp).toBeGreaterThan(0);
    expect(metrics.lcp).toBeLessThanOrEqual(LCP_BUDGET_MS);
    expect(metrics.cls).toBeLessThanOrEqual(CLS_BUDGET);
  });
});
