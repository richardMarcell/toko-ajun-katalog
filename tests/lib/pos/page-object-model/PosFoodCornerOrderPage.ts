import { Page } from "@playwright/test";
import ProductCardFromProductBoard from "../component-control/product-card-from-product-board";
import { OrderTypeEnum } from "@/lib/enums/OrderTypeEnum";
import ProductCardFromProductList from "../component-control/product-card-from-product-list";

type OrderDetail = {
  productName: string;
  qty: number;
}

type FillOrderProps = {
  order: OrderDetail[];
  orderType: OrderTypeEnum;
  customerName: string;
  tableNumber: string;
}

class PosFoodCornerOrderPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/pos/food-corner/order');
  }

  async fillOrder({
    order,
    customerName,
    tableNumber,
    orderType,
  }: FillOrderProps) {
    await this.addProducts(order);
    await this.addCustomerName(customerName);
    await this.selectOrderType(orderType);
    await this.selectTableNumber(tableNumber);
  }

  async addProducts(order: OrderDetail[]) {
    for (const item of order) {
      const product = new ProductCardFromProductBoard(this.page, item.productName);
      await product.init();

      for (let i = 0; i < item.qty; i++) {
        await product.add();
      }
    }
  }

  async addProductFromList(order: OrderDetail[]) {
    for (const item of order) {
      const product = new ProductCardFromProductList(this.page, item.productName);
      await product.init();

      for (let i = 0; i < item.qty; i++) {
        await product.add();
      }
    }
  }

  async selectTenant(tenantTestId: string) {
    const tenantBadge = await this.page.getByTestId(`${tenantTestId}`);
    await tenantBadge.click();
  }

  async switchDisplayMode(displayMode: 'BOARD' | 'LIST') {
    const displayModeButton = await this.page.getByTestId(`display-mode-${displayMode.toLowerCase()}`);
    await displayModeButton.click();
  }

  async addCustomerName(customerName: string) {
    const customerNameInput = await this.page.getByRole('textbox', { name: 'Customer\'s Name' });
    await customerNameInput.fill(customerName);
  }

  async selectTableNumber(tableNumber: string) {
    const tableNumberInput = await this.page.getByTestId('input-table-number');
    await tableNumberInput.dispatchEvent('click');

    await this.page.getByRole('option', {
      name: tableNumber,
    }).dispatchEvent('click');
    // await this.page.getByText(tableNumber).click();
  }

  async selectOrderType(orderType: OrderTypeEnum) {
    const orderTypeBadge = await this.page.getByTestId(`order-type-badge-${orderType.toString()}`);
    await orderTypeBadge.click();
  }

  async order() {
    const buttonOrder = await this.page.getByRole('button', { name: 'Order', exact: true });
    await buttonOrder.click();
  }
  
}

export default PosFoodCornerOrderPage;