// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:10000/esif-payments');
  await expect(page).toHaveTitle(/Menú de Navegación/);
});

test('list testings', async ({ page }) => {
  await page.goto('http://localhost:10000/esif-payments');

  await page.click('#LoadDataButton');
  await page.waitForTimeout(4000);

  let data = (await page.locator('#DataItem').all());
  let len = data.length;

  expect(len).toBeGreaterThan(0);
});

test('create testing', async ({ page }) => {
  await page.goto('http://localhost:10000/esif-payments');

  await page.click('#nxtButton');
  await page.click('#nxtButton');
  await page.click('#nxtButton');

  let data = (await page.locator('#DataItem').all());
  let len = data.length;

  await page.click('#CreateButton');

  await page.fill('#ms', 'FR');
  await page.fill('#ms_name', 'France');
  await page.fill('#cci', '2014FR05M9OP001');
  await page.fill('#title', 'Youth Employment - FR - ESF/YEI');
  await page.fill('#fund', 'YEI Specific Allocation');
  await page.fill('#category_of_region', 'no');
  await page.fill('#year', '2019');
  await page.fill('#net_planned_eu_amount', '334883138');
  await page.fill('#cumulative_initial_pre_financing', '6479079.6');
  await page.fill('#cumulative_additional_initial_pre_financing', '62631102.8');
  await page.fill('#recovery_of_initial_pre_financing', '0');
  await page.fill('#cumulative_annual_pre_financing', '28518390.29');
  await page.fill('#pre_financing_covered_by_expenditure', '7263707.11');
  await page.fill('#recovery_of_annual_pre_financing', '11783891.79');
  await page.fill('#net_pre_financing', '78580973.79');
  await page.fill('#cumulative_interim_payments', '178211442.06');
  await page.fill('#recovery_of_expenses', '7219112.08');
  await page.fill('#net_interim_payments', '178256037.09');
  await page.fill('#total_net_payments', '256837010.88');
  await page.fill('#eu_payment_rate', '76.694518695056');
  await page.fill('#eu_payment_rate_on_planned_eu_amount', '76.694518695056');

  await page.waitForTimeout(2000);
  await page.click('#SendButton');
  await page.waitForTimeout(4000);

  let Newdata = (await page.locator('#DataItem').all());
  let Newlen = Newdata.length;

  expect(Newlen).toBeGreaterThan(len);
});

test('delete all testings', async ({ page }) => {
  await page.goto('http://localhost:10000/esif-payments');

  await page.click('#DeleteDataButton');

  await page.waitForTimeout(1000);

  let data = (await page.locator('#DataItem').all());
  let len = data.length;
  expect(data.length).toEqual(0);
});
