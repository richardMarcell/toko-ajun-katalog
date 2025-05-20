import { ProductConfig } from "../config/product-config";

export enum LockerTypeEnum {
  STANDARD = "STANDARD",
  FAMILY = "FAMILY",
}

export function getLockerDisplayType(type: LockerTypeEnum): string {
  let lockerType = "";

  switch (type) {
    case LockerTypeEnum.STANDARD:
      lockerType = "Standar";
      break;
    case LockerTypeEnum.FAMILY:
      lockerType = "Family";
      break;
    default:
      lockerType = "-";
      break;
  }

  return lockerType;
}

export function getLockerPrice(type: LockerTypeEnum): number {
  let lockerPrice = 0;

  switch (type) {
    case LockerTypeEnum.STANDARD:
      lockerPrice = 20000;
      break;
    case LockerTypeEnum.FAMILY:
      lockerPrice = 30000;
      break;
    default:
      lockerPrice = 0;
      break;
  }

  return lockerPrice;
}

export function getLockerTypeWithProductCode(productCode: string): string {
  if (productCode === "10000026") {
    return LockerTypeEnum.STANDARD;
  } else if (productCode === "10000027") {
    return LockerTypeEnum.FAMILY;
  } else return "-";
}

export function getLockerProductId(type: LockerTypeEnum): bigint | undefined {
  switch (type) {
    case LockerTypeEnum.STANDARD:
      return ProductConfig.locker.standard.id;
    case LockerTypeEnum.FAMILY:
      return ProductConfig.locker.family.id;
    default:
      return undefined;
  }
}
