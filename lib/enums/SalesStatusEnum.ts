export enum SalesStatusEnum {
  CLOSED = "CLOSED",
  PREPARING = "PREPARING",
  READY = "READY",
  OPEN = "OPEN",
}

export function getSalesStatusCase(status: SalesStatusEnum): string {
  let salesStatus = "";

  switch (status) {
    case SalesStatusEnum.CLOSED:
      salesStatus = "Closed";
      break;
    case SalesStatusEnum.PREPARING:
      salesStatus = "Preparing";
      break;
    case SalesStatusEnum.READY:
      salesStatus = "Ready";
      break;
    case SalesStatusEnum.OPEN:
      salesStatus = "Open";
      break;
    default:
      salesStatus = "-";
      break;
  }

  return salesStatus;
}
