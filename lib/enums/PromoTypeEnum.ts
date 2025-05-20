export enum PromoTypeEnum {
  NOMINAL = "NOMINAL",
  PERCENTAGE = "PERCENTAGE",
}

export function getPromoTypeCase(type: PromoTypeEnum): string {
  let promoType = "";

  switch (type) {
    case PromoTypeEnum.NOMINAL:
      promoType = "Nominal";
      break;
    case PromoTypeEnum.PERCENTAGE:
      promoType = "Percentage";
      break;
    default:
      promoType = "-";
      break;
  }

  return promoType;
}
