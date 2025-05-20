export enum UnitBusinessSateliteQubuEnum {
  RESTO_PATIO = "RESTO PATIO",
  DIMSUM = "DIMSUM",
  SOUVENIR = "SOUVENIR",
  WATER_PARK_TICKET = "WATER PARK TICKET",
  FOOD_CORNER = "FOOD CORNER",
  LOCKER = "LOCKER",
}

export function getDisplayUnitBusinessSatelite(
  unitBusinessSateliteQubuEnum: UnitBusinessSateliteQubuEnum,
) {
  let unitSateliteQubu = "";

  switch (unitBusinessSateliteQubuEnum) {
    case UnitBusinessSateliteQubuEnum.RESTO_PATIO:
      unitSateliteQubu = "Resto Patio";
      break;
    case UnitBusinessSateliteQubuEnum.DIMSUM:
      unitSateliteQubu = "Dimsum";
      break;
    case UnitBusinessSateliteQubuEnum.SOUVENIR:
      unitSateliteQubu = "Souvenir";
      break;
    case UnitBusinessSateliteQubuEnum.WATER_PARK_TICKET:
      unitSateliteQubu = "Water Park Ticket";
      break;
    case UnitBusinessSateliteQubuEnum.FOOD_CORNER:
      unitSateliteQubu = "Food Corner";
      break;
    case UnitBusinessSateliteQubuEnum.LOCKER:
      unitSateliteQubu = "Locker";
      break;
    default:
      unitSateliteQubu = "-";
      break;
  }

  return unitSateliteQubu;
}
