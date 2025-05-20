import { expect, Locator } from "@playwright/test";
import ProductCardFromProductBoard from "../component-control/product-card-from-product-board";

export default class ProductCardQtyControlFlow {
  constructor(private productCard: ProductCardFromProductBoard) {}

  async run() {
    // test add and remove item from cart
    await expect(this.productCard.getMinusButton()).toBeDisabled();
    await this.productCard.add();
    await this.productCard.add();
    await expect(await this.productCard.getQty()).toBe('2');
    await this.productCard.minus();
    await expect(await this.productCard.getQty()).toBe('1');
    await this.productCard.minus();
    await expect(await this.productCard.getQty()).toBe('0');
    await expect(this.productCard.getMinusButton()).toBeDisabled();
  }
}