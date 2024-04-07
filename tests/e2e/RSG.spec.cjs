/*
// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:10000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Menú de Navegación/);
});

test('list testings', async ({ page }) => {
  await page.goto('http://localhost:10000/covid-testings');

  // Click the get started link.
  await page.click('.load-button');
  
  // Expects page to have a heading with the name of Installation.
  //await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  let countries= (await page.locator('.testingItem').all())
  let coutriesNumber = countries.length;

  expect(coutriesNumber).toBeGreaterThan(0);
});
*/
/////////////////////////////////////////

const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:10000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Menú de Navegación/);
});


test('list testings', async ({ page }) => {
  await page.goto('http://localhost:10000/covid-testings');

  // Click the "Cargar Datos" button.
  await page.click('.load-button');

  // Expects page to have a heading with the name of Installation.
  //await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  let countries = (await page.locator('.testingItem').all());
  let coutriesNumber = countries.length;

  expect(coutriesNumber).toBeGreaterThan(0);
});

test('create testing', async ({ page }) => {
  await page.goto('http://localhost:10000/covid-testings');

  // Click the "Crear" button.
  await page.click('.create-button');

  // Fill out the form
  await page.fill('#countryCodeInput', 'ExampleCountry');
  await page.fill('#levelInput', 'High');
  await page.fill('#regionInput', 'RegionX');
  await page.fill('#regionNameInput', 'Region Name X');
  await page.fill('#newCasesInput', '100');
  await page.fill('#testsDoneInput', '500');
  await page.fill('#populationInput', '10000');
  await page.fill('#testingRateInput', '5');
  await page.fill('#positivityRateInput', '2');
  await page.fill('#testingDataSourceInput', 'Example Source');

  // Submit the form
  await page.click('#submitButton');

  // Expect some behavior after submitting the form, such as a new testing being added to the list.
});

test('edit testing', async ({ page }) => {

  await page.goto('http://localhost:10000/covid-testings');

  // Click the "Cargar Datos" button.
  await page.click('.load-button');

  await page.goto(`http://localhost:10000/covid-testings/Spain/2022-W39`);
  

  // Modificar los valores de los campos de entrada
  await page.fill('#countryCodeInput', 'NewCountryCode');
  await page.fill('#levelInput', 'NewLevel');
  await page.fill('#regionInput', 'NewRegion');
  await page.fill('#regionNameInput', 'NewRegionName');
  await page.fill('#newCasesInput', '200');
  await page.fill('#testsDoneInput', '1000');
  await page.fill('#populationInput', '20000');
  await page.fill('#testingRateInput', '10');
  await page.fill('#positivityRateInput', '5');
  await page.fill('#testingDataSourceInput', 'NewDataSource');

  // Hacer clic en el botón de guardar
  await page.click('#editButton');

  // Esperar un tiempo prudencial para que se realice la edición (puedes ajustar este tiempo según la velocidad de tu aplicación)
  await page.waitForTimeout(1000);

  // Comprobar si la edición se realizó correctamente (puedes agregar aquí cualquier verificación adicional necesaria)
  const updatedCountryCode = await page.$eval('#levelInput', (input) => input.value);
  expect(updatedCountryCode).toEqual('NewLevel');
});



test('delete all testings', async ({ page }) => {
  await page.goto('http://localhost:10000/covid-testings');

  // Click the "Eliminar todo" button.
  await page.click('.delete-button');

  // Expect some behavior after clicking the delete button, such as all testings being removed from the list.
});
