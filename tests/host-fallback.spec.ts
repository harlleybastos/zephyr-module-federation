import { expect, test } from '@playwright/test';

// Guards shareStrategy 'loaded-first' + the lazy-import catch in apps/host.
test('host still renders when the remote is unreachable', async ({ page }) => {
  await page.route('http://localhost:3001/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Host' })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText('Remote unavailable. Reload to retry.');
});
