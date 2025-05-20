import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";

export async function getTaxPercent(
  unitBusiness: UnitBusinessSateliteQubuEnum,
): Promise<number> {
  switch (unitBusiness) {
    case UnitBusinessSateliteQubuEnum.FOOD_CORNER:
    case UnitBusinessSateliteQubuEnum.DIMSUM:
    case UnitBusinessSateliteQubuEnum.LOCKER:
    case UnitBusinessSateliteQubuEnum.SOUVENIR:
      return 10.0;
    case UnitBusinessSateliteQubuEnum.WATER_PARK_TICKET:
      return 25.0;
    case UnitBusinessSateliteQubuEnum.RESTO_PATIO:
      return 11.0;
    default:
      return 0;
  }
}
