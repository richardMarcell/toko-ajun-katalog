import { test, expect } from '@playwright/test';

test('login failed', async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByRole('textbox', { name: 'Masukkan email' }).click();
  await page.getByRole('textbox', { name: 'Masukkan email' }).fill('random@email.com');
  await page.getByRole('textbox', { name: 'Masukkan password' }).click();
  await page.getByRole('textbox', { name: 'Masukkan password' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/auth/login');
  
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(await page.getByText('Login gagal')).toBeVisible();
});

test('login success', async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByRole('textbox', { name: 'Masukkan email' }).click();

  await expect(page).toHaveTitle('Qubu Resort - Satellite');

  await page.getByRole('textbox', { name: 'Masukkan email' }).fill('superadmin@satelite.app');
  await page.getByRole('textbox', { name: 'Masukkan password' }).click();
  await page.getByRole('textbox', { name: 'Masukkan password' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/pos/food-corner/order');
});

