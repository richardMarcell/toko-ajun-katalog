export enum SalesLockerRentPromoTypeEnum {
  WITHOUT_PROMO = "WITHOUT PROMO",
  PROMO = "PROMO",
  BOOKLET = "BOOKLET",
}

export function getSalesLockerRentPromoTypeDisplayStatus(type: SalesLockerRentPromoTypeEnum): string {
  let promoType = "";

  switch (type) {
    case SalesLockerRentPromoTypeEnum.WITHOUT_PROMO:
      promoType = "Tanpa Promo";
      break;
    case SalesLockerRentPromoTypeEnum.PROMO:
      promoType = "Promo";
      break;
    case SalesLockerRentPromoTypeEnum.BOOKLET:
      promoType = "Booklet";
      break;
    default:
      promoType = "-";
      break;
  }

  return promoType;
}

export function getSalesLockerRentPromoTypeDisplayAllowd(): SalesLockerRentPromoTypeEnum[] {
  return [
    SalesLockerRentPromoTypeEnum.WITHOUT_PROMO,
    SalesLockerRentPromoTypeEnum.PROMO,
    SalesLockerRentPromoTypeEnum.BOOKLET,
  ];
}
