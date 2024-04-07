// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:10000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Menú de Navegación/);
});


test('list stats', async ({ page }) => {
  await page.goto('http://localhost:10000/policy-program-stats');

  // Click the get started link.
  await page.click('#cargarDatos');

  // Expects page to have a heading with the name of Installation.
  //await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  await page.waitForTimeout(2000);
  let stats= (await page.locator('.statsItem').all())
  let statsNumber = stats.length;

  expect(statsNumber).toBeGreaterThan(0);
});
