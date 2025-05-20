export enum OrderStatusEnum {
  PREPARING = "PREPARING",
  SERVE = "SERVE",
}

export function getOrderStatusDisplay(status: OrderStatusEnum): string {
  let orderStatus = "";

  switch (status) {
    case OrderStatusEnum.PREPARING:
      orderStatus = "Preparing";
      break;
    case OrderStatusEnum.SERVE:
      orderStatus = "Serve";
      break;
    default:
      orderStatus = "-";
      break;
  }

  return orderStatus;
}
