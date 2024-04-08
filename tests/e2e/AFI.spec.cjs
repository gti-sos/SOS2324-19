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
  await page.click('.cargarDatos');

  // Expects page to have a heading with the name of Installation.
  //await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  await page.waitForTimeout(2000);
  let stats= (await page.locator('#testingItem').all())
  let statsNumber = stats.length;

  expect(statsNumber).toBeGreaterThan(0);
});


test('create testing', async ({ page }) => {
  await page.goto('http://localhost:10000/policy-program-stats');

  // Click the "Crear" button.
  await page.click('.create-button');

  // Fill out the form
  await page.fill('#countryimput', 'AJ');
  await page.fill('#cciimput', 'AHDH2737744');
  await page.fill('#short_titleimput', 'HCHCDUCD');
  await page.fill('#yearimput', '2020');
  await page.fill('#priorityimput', 'A.2');
  await page.fill('#fundimput', 'AODR');
  await page.fill('#tooimput', '3');
  await page.fill('#fi_nameimput', 'DNNDEUNE');
  await page.fill('#fi_addressimput', 'UBUBUB');
  await page.fill('#is_set_up_at_union_levelimput', 'DCUDCUDC');
  await page.fill('#fi_typeimput', 'BBYBB');
  await page.fill('#ex_ante_completion_dateimput', 'HHHHH');
  await page.fill('#funding_agreement_signature_dateimput', 'YYGYG');
  await page.fill('#total_amount_committed_to_fiimput', '77662');
  await page.fill('#esif_amount_committed_to_fiimput', '666666');
  await page.fill('#total_amount_paid_to_fiimput', '377777');
  await page.fill('#esif_amount_paid_to_fiimput', '6655555');
  await page.fill('#management_costs_amountimput', '7777777');
  await page.fill('#base_renumeration_amountimput', '6666666');
  await page.fill('#performance_based_renumeration_paid_amountimput', '66666');
  await page.fill('#total_amount_committed_to_final_recipientsimput', '7777777');
  await page.fill('#esif_amount_committed_to_final_recipientsimput', '67776655');
  await page.fill('#total_amount_paid_to_final_recipientsimput', '777777');
  await page.fill('#esif_amount_paid_to_final_recipientsimput', '66666');
  await page.fill('#to_code_short_titleimput', 'CJNCNCNCNDUN');
  await page.fill('#to_long_titleimput', 'HGGDGGDG');

  // Submit the form
  await page.click('.submit-button');
  await page.waitForTimeout(200);

  let Newdata = (await page.locator('#testingItem').all());
  let Newlen = Newdata.length;

  expect(Newlen).toBeGreaterThan(0);
  // Expect some behavior after submitting the form, such as a new testing being added to the list.
});


// test('edit testing', async ({ page }) => {

//   await page.goto('http://localhost:10000/policy-program-stats');

//   // Click the "Cargar Datos" button.

//   await page.goto(`http://localhost:10000/policy-program-stats/AT/2020`);


//   // Modificar los valores de los campos de entrada
//   await page.fill('#cciimpute', 'DG77273737');

//   // Hacer clic en el botón de guardar
//   await page.click('#editButton');

//   await page.click('.delete-button');
// });

test('delete all testings', async ({ page }) => {
  await page.goto('http://localhost:10000/policy-program-stats');

  // Click the "Eliminar todo" button.
  await page.click('.delete-button');

  await page.waitForTimeout(1000);


  let countries = (await page.locator('#testingItem').all());

  expect(countries.length).toEqual(0);
  // Expect some behavior after clicking the delete button, such as all testings being removed from the list.
});


