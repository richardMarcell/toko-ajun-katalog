export enum SalesGazeboRentPromoTypeEnum {
  WITHOUT_PROMO = "WITHOUT PROMO",
  PROMO = "PROMO",
  BOOKLET = "BOOKLET",
}

export function getSalesGazeboRentPromoTypeDisplayStatus(type: SalesGazeboRentPromoTypeEnum): string {
  let promoType = "";

  switch (type) {
    case SalesGazeboRentPromoTypeEnum.WITHOUT_PROMO:
      promoType = "Tanpa Promo";
      break;
    case SalesGazeboRentPromoTypeEnum.PROMO:
      promoType = "Promo";
      break;
    case SalesGazeboRentPromoTypeEnum.BOOKLET:
      promoType = "Booklet";
      break;
    default:
      promoType = "-";
      break;
  }

  return promoType;
}

export function getSalesGazeboRentPromoTypeDisplayAllowd(): SalesGazeboRentPromoTypeEnum[] {
  return [
    SalesGazeboRentPromoTypeEnum.WITHOUT_PROMO,
    SalesGazeboRentPromoTypeEnum.PROMO,
    SalesGazeboRentPromoTypeEnum.BOOKLET,
  ];
}
