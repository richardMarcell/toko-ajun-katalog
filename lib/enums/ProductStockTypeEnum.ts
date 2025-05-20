export enum ProductStockTypeEnum {
  STOCK = "STOCK",
  NON_STOCK = "NON STOCK",
}

export function getProductStockTypeCase(type: ProductStockTypeEnum): string {
  let stockType = "";

  switch (type) {
    case ProductStockTypeEnum.STOCK:
      stockType = "Stock";
      break;
    case ProductStockTypeEnum.NON_STOCK:
      stockType = "Non Stock";
      break;
    default:
      stockType = "-";
      break;
  }

  return stockType;
}
