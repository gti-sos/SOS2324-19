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
  await page.waitForTimeout(3000);

  // Expects page to have a heading with the name of Installation.
  //await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  let countries= (await page.locator('.countryItem').all())
  let coutriesNumber = countries.length; 

  expect(coutriesNumber).toBeGreaterThan(0);
});


test('eliminar countries', async ({ page }) => {
  await page.goto('http://localhost:10000/eu-payment-info');

  // Click the get started link.
  await page.click('#eliminarDatos');
  
  // Expects page to have a heading with the name of Installation.
  //await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  let countries= (await page.locator('.countryItem').all())
  let coutriesNumber = countries.length;

  expect(coutriesNumber).toBeLessThanOrEqual(1);
});


test('edit testing', async ({ page }) => {
  // Ir a la página de edición del testing específico
  await page.goto('http://localhost:10000/eu-payment-info');

  await page.click('#crearDatos');

  // Esperar un tiempo prudencial para que se realice la edición (puedes ajustar este tiempo según la velocidad de tu aplicación)
  await page.waitForTimeout(1000);

 
});


