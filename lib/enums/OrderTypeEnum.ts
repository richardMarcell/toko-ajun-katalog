export enum OrderTypeEnum {
  DINE_IN = "DINE IN",
  TAKE_AWAY = "TAKE AWAY",
}

export function getOrderTypeCase(type: OrderTypeEnum): string {
  let orderType = "";

  switch (type) {
    case OrderTypeEnum.DINE_IN:
      orderType = "Dine In";
      break;
    case OrderTypeEnum.TAKE_AWAY:
      orderType = "Take Away";
      break;
    default:
      orderType = "-";
      break;
  }

  return orderType;
}
