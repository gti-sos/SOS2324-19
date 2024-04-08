const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:10000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Menú de Navegación/);
});

test('list testings', async ({ page }) => {
  await page.goto('http://localhost:10000/covid-testings');

  // Click the "Cargar Datos" button.
  await page.click('#loadData');
  await page.waitForTimeout(3000);

  let countries = (await page.locator('#testingItem').all());
  let coutriesNumber = countries.length;

  expect(coutriesNumber).toBeGreaterThan(0);
});

test('create testing', async ({ page }) => {
  await page.goto('http://localhost:10000/covid-testings');

  await page.click('#deleteAllButton');

  await page.waitForTimeout(200);

  await page.click('#createButton');

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

  await page.click('#submitButton');
  await page.waitForTimeout(200);

  let Newdata = (await page.locator('#testingItem').all());
  let Newlen = Newdata.length;

  expect(Newlen).toBeGreaterThan(0);
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

});

test('delete all testings', async ({ page }) => {
  await page.goto('http://localhost:10000/covid-testings');

  await page.click('#deleteAllButton');

  await page.waitForTimeout(1000);


  let countries = (await page.locator('#testingItem').all());

  expect(countries.length).toEqual(0);
});
