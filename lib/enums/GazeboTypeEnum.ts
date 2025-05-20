import { ProductConfig } from "../config/product-config";

export enum GazeboTypeEnum {
  FAMILY = "FAMILY",
  VIP = "VIP",
}

export function getGazeboDisplayType(type: GazeboTypeEnum): string {
  let gazeboType = "";

  switch (type) {
    case GazeboTypeEnum.FAMILY:
      gazeboType = "Family";
      break;
    case GazeboTypeEnum.VIP:
      gazeboType = "VIP";
      break;
    default:
      gazeboType = "-";
      break;
  }

  return gazeboType;
}

export function getGazeboPrice(type: GazeboTypeEnum): number {
  let gazeboPrice = 0;

  switch (type) {
    case GazeboTypeEnum.FAMILY:
      gazeboPrice = 200000;
      break;
    case GazeboTypeEnum.VIP:
      gazeboPrice = 400000;
      break;
    default:
      gazeboPrice = 0;
      break;
  }

  return gazeboPrice;
}

export function getGazeboTypeWithProductCode(productCode: string): string {
  if (productCode === "10000033") {
    return GazeboTypeEnum.FAMILY;
  } else if (productCode === "10000034") {
    return GazeboTypeEnum.VIP;
  } else return "-";
}

export function getGazeboProductId(type: GazeboTypeEnum): bigint | undefined {
  switch (type) {
    case GazeboTypeEnum.VIP:
      return ProductConfig.gazebo.vip.id;
    case GazeboTypeEnum.FAMILY:
      return ProductConfig.gazebo.family.id;
    default:
      return undefined;
  }
}
