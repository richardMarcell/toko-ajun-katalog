import { test, expect } from '@playwright/test';
import ProductCardFromProductBoard from './lib/pos/component-control/product-card-from-product-board';
import ProductCardQtyControlFlow from './lib/pos/test-flow/product-card-qty-control-flow';
import PosFoodCornerOrderPage from './lib/pos/page-object-model/PosFoodCornerOrderPage';
import { OrderTypeEnum } from '@/lib/enums/OrderTypeEnum';
import PosFoodCornerSaleCreatePage from './lib/pos/page-object-model/PosFoodCornerSaleCreatePage';

test.use({ storageState: 'auth.json' });

const totalPrice = 107800;
const totalPriceDisplay = 'Rp 107.800';
const fillOrderParams = {
  order: [
    { productName: 'Hao Kao', qty: 3 },
    { productName: 'Nasi Goreng Seafood', qty: 2 },
    { productName: 'Fried Tofu Skin', qty: 1 },
  ],
  orderType: OrderTypeEnum.DINE_IN,
  customerName: 'John Doe',
  tableNumber: '015',
}

test('it should show tenant', async ({ page }) => {
  await page.goto('/pos/food-corner/order');
  await expect(page.locator('[data-testid="tenants-button"]').getByText('All Items')).toBeVisible();
  await expect(page.locator('[data-testid="tenant-all-items"]').getByText('All Items')).toBeVisible();

  await expect(page.getByTestId('tenant-all-items').getByText('All Items')).toBeVisible();
  await expect(page.getByTestId('tenant-all-items').getByText('10 Items')).toBeVisible();

  await expect(page.getByTestId('tenant-1').getByText('Katsuya')).toBeVisible();
  await expect(page.getByTestId('tenant-1').getByText('4 Items')).toBeVisible();

  await expect(page.getByTestId('tenant-2').getByText('Nasi Goreng Station')).toBeVisible();
  await expect(page.getByTestId('tenant-2').getByText('3 Items')).toBeVisible();

  await expect(page.getByTestId('tenant-3').getByText('Qubu')).toBeVisible();
  await expect(page.getByTestId('tenant-3').getByText('3 Items')).toBeVisible();
});

test('it should able to add and remove products from cart', async ({ page }) => {
  await page.goto('/pos/food-corner/order');

  const nasiGorengCard = new ProductCardFromProductBoard(page, 'Nasi Goreng Seafood');
  await nasiGorengCard.init();
  await new ProductCardQtyControlFlow(nasiGorengCard).run();

  const friedTofuSkinCard = new ProductCardFromProductBoard(page, 'Fried Tofu Skin');
  await friedTofuSkinCard.init();
  await new ProductCardQtyControlFlow(friedTofuSkinCard).run();

  const mieAyamCard = new ProductCardFromProductBoard(page, 'Mie Ayam');
  await mieAyamCard.init();
  await new ProductCardQtyControlFlow(mieAyamCard).run();

  const esTehManisCard = new ProductCardFromProductBoard(page, 'Es Teh Manis');
  await esTehManisCard.init();
  await new ProductCardQtyControlFlow(esTehManisCard).run();
});

test('it should add product from list view to cart', async ({ page }) => {
  const posFoodCornerOrderPage = new PosFoodCornerOrderPage(page);
  await posFoodCornerOrderPage.goto();

  await posFoodCornerOrderPage.switchDisplayMode('LIST');
  await posFoodCornerOrderPage.addProductFromList(fillOrderParams.order);

  await expect(page.getByTestId('cart-product-list').locator('> div')).toHaveCount(3);
  for (const product of fillOrderParams.order) {
    const productCard = await page.getByTestId('cart-product-list')
      .locator('> div')
      .filter({ hasText: product.productName });
    await expect(productCard).toBeVisible();
    await expect(productCard.getByTestId('qty-display')).toHaveText(product.qty.toString());
  }
});

test('it should show product list table', async ({ page }) => {
  const posFoodCornerOrderPage = new PosFoodCornerOrderPage(page);
  await posFoodCornerOrderPage.goto();

  await posFoodCornerOrderPage.switchDisplayMode('LIST');
  await expect(page.getByTestId('product-list-table')).toBeVisible();

  await posFoodCornerOrderPage.switchDisplayMode('BOARD');
  await expect(page.getByTestId('product-list')).not.toBeVisible();
});

test('it should show mandatory fields', async ({ page }) => {
  await page.goto('/pos/food-corner/order');

  const selectBoxTableNumber = await page.getByTestId('input-table-number');
  await expect(selectBoxTableNumber).toBeVisible();

  const buttonOrder = await page.getByRole('button', { name: 'Order', exact: true });
  await expect(buttonOrder).toBeVisible();

  const inputCustomerName = await page.getByTestId('input-customer-name');
  await expect(inputCustomerName).toBeVisible();
});

test('should complete order flow', async ({ page }) => {
  const posFoodCornerOrderPage = new PosFoodCornerOrderPage(page);
  await posFoodCornerOrderPage.goto();

  await posFoodCornerOrderPage.fillOrder(fillOrderParams);

  // assert cart items
  await expect(page.getByTestId('cart-product-list').locator('> div')).toHaveCount(3);
  await expect(page.getByTestId('order-type-badge-DINE IN')).toHaveClass(/border-blue-400 text-qubu_blue/);

  for (const product of fillOrderParams.order) {
    const productCard = await page.getByTestId('cart-product-list')
      .locator('> div')
      .filter({ hasText: product.productName });
    await expect(productCard).toBeVisible();
    await expect(productCard.getByTestId('qty-display')).toHaveText(product.qty.toString());
  }

  await posFoodCornerOrderPage.order();
  await expect(page).toHaveURL(/pos\/food-corner\/sales\/create/);

  // assert order summary
  const table = await page.getByTestId('table-order-items');
  await expect(table).toBeVisible();

  const orderItems = await table.locator('> tbody').getByRole('row');
  await expect(orderItems).toHaveCount(fillOrderParams.order.length);

  const tableContentRecords = table.locator('> tbody').getByRole('row');
  for (const product of fillOrderParams.order) {
    const productCard = tableContentRecords.filter({ hasText: product.productName });
    await expect(productCard).toHaveCount(1);
    await expect(productCard.getByTestId('qty-display')).toHaveText(product.qty.toString());
  }
  await expect(page.getByTestId('total-payment-display')).toHaveText(totalPriceDisplay);

  const posFoodCornerSaleCreatePage = new PosFoodCornerSaleCreatePage(page);
  await posFoodCornerSaleCreatePage.fillPaymentForm({
    paymentMethod: 'Tunai',
    totalPayment: totalPrice,
  });

  await posFoodCornerSaleCreatePage.clickPayAndPrintReceiptButton();
  await expect(page).toHaveURL(/pos\/food-corner\/sales\/\d+\/receipt/);

  // await page.getByRole('button', { name: 'Bayar & Cetak Struk' }).click();

  // await expect(page.getByText('Nominal pembayaran harus lebih besar atau sama dengan total keseluruhan')).toBeVisible();
  
  // await page.getByTestId('input-total-payment').fill('107800');
  // await page.getByRole('button', { name: 'Bayar & Cetak Struk' }).click();
});

test('should show error if payment method is not selected', async ({ page }) => {
  const posFoodCornerOrderPage = new PosFoodCornerOrderPage(page);
  await posFoodCornerOrderPage.goto();

  await posFoodCornerOrderPage.fillOrder(fillOrderParams);
  await posFoodCornerOrderPage.order();

  const posFoodCornerSaleCreatePage = new PosFoodCornerSaleCreatePage(page);
  await posFoodCornerSaleCreatePage.clickPayAndPrintReceiptButton();

  await expect(
    await page.getByText('Metode pembayaran yang diterima hanya Tunai, Debit, Qris atau CashQ')
  ).toBeVisible();
});

test('should show error if total payment is less than total price', async ({ page }) => {
  const posFoodCornerOrderPage = new PosFoodCornerOrderPage(page);
  await posFoodCornerOrderPage.goto();

  await posFoodCornerOrderPage.fillOrder(fillOrderParams);
  await posFoodCornerOrderPage.order();

  const posFoodCornerSaleCreatePage = new PosFoodCornerSaleCreatePage(page);
  await posFoodCornerSaleCreatePage.selectPaymentMethod('Debit');
  await posFoodCornerSaleCreatePage.clickPayAndPrintReceiptButton();

  await expect(
    await page.getByText('Nominal pembayaran harus lebih besar atau sama dengan total keseluruhan')
  ).toBeVisible();

  await posFoodCornerSaleCreatePage.fillTotalPayment(totalPrice - 1);
  await posFoodCornerSaleCreatePage.clickPayAndPrintReceiptButton();

  await expect(
    await page.getByText('Nominal pembayaran harus lebih besar atau sama dengan total keseluruhan')
  ).toBeVisible();
});
