import { Locator, Page } from "@playwright/test";

export default class ProductCardFromProductBoard {
  private productCard?: Locator;
  private addButton?: Locator;
  private minusButton?: Locator;
  private qtyDisplay?: Locator;

  private productName: string;

  constructor(private page: Page, productName: string) {
    this.productName = productName;
  }

  async init() {
    this.productCard = await this.page.locator('[data-testid="product-list"] >div').filter({ hasText: this.productName });
    this.addButton = await this.productCard.getByTestId('qty-control').getByText('+');
    this.minusButton = await this.productCard.getByTestId('qty-control').getByText('-');
    this.qtyDisplay = await this.productCard.getByTestId('qty-display');
  }

  getProductCard(): Locator {
    if (!this.productCard) {
      throw new Error('Product card is not initialized');
    }

    return this.productCard;
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