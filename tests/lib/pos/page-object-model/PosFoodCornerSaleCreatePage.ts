import { expect, Page } from "@playwright/test";

export default class PosFoodCornerSaleCreatePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/pos/food-corner/sales/create');
  }

  async fillPaymentForm({
    paymentMethod,
    totalPayment,
  }: {
    paymentMethod: string;
    totalPayment: number;
  }) {
    await this.selectPaymentMethod(paymentMethod);
    await this.fillTotalPayment(totalPayment);
  }

  async selectPaymentMethod(paymentMethod: string) {
    const comboboxPaymentMethod = await this.page.getByTestId('combobox-payment-method');
    await comboboxPaymentMethod.click();

    await expect(this.page.getByLabel(paymentMethod).getByText(paymentMethod)).toBeVisible();
    await this.page.getByLabel(paymentMethod).click();
  }
  
  async fillTotalPayment(totalPayment: number) {
    await this.page.getByTestId('input-total-payment').fill(totalPayment.toString());
  }

  async clickPayAndPrintReceiptButton() {
    await this.page.getByRole('button', { name: 'Bayar & Cetak Struk' }).click();
  }


  async assertOrderSummary() {
    // await expect(this.page.getByTestId('order-summary')).toBeVisible();
  }
}