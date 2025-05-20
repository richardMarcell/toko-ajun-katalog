export enum SalesStatusEnum {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export function getSalesStatusCase(status: SalesStatusEnum): string {
  let salesStatus = "";

  switch (status) {
    case SalesStatusEnum.OPEN:
      salesStatus = "Open";
      break;
    case SalesStatusEnum.CLOSED:
      salesStatus = "Closed";
      break;
    default:
      salesStatus = "-";
      break;
  }

  return salesStatus;
}
