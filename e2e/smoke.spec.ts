import { test, expect, stabilizeTileRequests } from './_helpers';

test('smoke: page loads and map container exists', async ({ page }) => {
  await stabilizeTileRequests(page);

  await page.goto('/');
  await expect(page.locator('#map')).toBeVisible();

  // MapLibre GL JS creates a canvas element inside the map container.
  await expect(page.locator('#map canvas.maplibregl-canvas')).toBeVisible({ timeout: 15_000 });
});
