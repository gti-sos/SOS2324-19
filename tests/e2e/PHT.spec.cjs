// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:10000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Menú de Navegación/);
});


test('list countries', async ({ page }) => {
  await page.goto('http://localhost:10000/eu-payment-info');

  // Click the get started link.
  await page.click('#cargarDatos');
  
  // Expects page to have a heading with the name of Installation.
  //await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  let countries= (await page.locator('.countryItem').all())
  let coutriesNumber = countries.length;

  expect(coutriesNumber).toBeGreaterThan(0);
});