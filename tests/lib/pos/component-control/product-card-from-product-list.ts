import { Locator, Page } from "@playwright/test";

export default class ProductCardFromProductList {
  private productRow?: Locator;
  private addButton?: Locator;
  private minusButton?: Locator;
  private qtyDisplay?: Locator;

  private productName: string;

  constructor(private page: Page, productName: string) {
    this.productName = productName;
  }

  async init() {
    this.productRow = await this.page.locator('[data-testid="product-list-table"] > tbody > tr')
      .filter({ hasText: this.productName });
    this.addButton = await this.productRow.getByTestId('qty-control').getByText('+');
    this.minusButton = await this.productRow.getByTestId('qty-control').getByText('-');
    this.qtyDisplay = await this.productRow.getByTestId('qty-display');
  }

  getProductCard(): Locator {
    if (!this.productRow) {
      throw new Error('Product card is not initialized');
    }

    return this.productRow;
  }

  async add(): Promise<void> {
    if (!this.addButton) {
      throw new Error('Add button is not initialized');
    }

    await this.addButton.click();
  }

  async minus(): Promise<void> {
    if (!this.minusButton) {
      throw new Error('Minus button is not initialized');
    }

    await this.minusButton.click();
  }
  
  async getQty(): Promise<string> {
    if (!this.qtyDisplay) {
      throw new Error('Qty display is not initialized');
    }

    const text = await this.qtyDisplay.textContent();
    if (!text) {
      throw new Error('Qty display is not visible');
    }

    return text;
  }

  getAddButton(): Locator {
    if (!this.addButton) {
      throw new Error('Add button is not initialized');
    }

    return this.addButton;
  }

  getMinusButton(): Locator {
    if (!this.minusButton) {
      throw new Error('Minus button is not initialized');
    }

    return this.minusButton;
  }
}