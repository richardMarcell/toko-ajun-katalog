import { UnitBusinessSateliteQubuEnum } from "../enums/UnitBusinessSateliteQubuEnum";
import { WarehouseIdEnum } from "../enums/WarehouseIdEnum";

export const SateliteUnitConfig = {
  food_corner: {
    warehouse_id: WarehouseIdEnum.FOOD_CORNER,
    unit_business: UnitBusinessSateliteQubuEnum.FOOD_CORNER,
  },
  souvenir: {
    warehouse_id: WarehouseIdEnum.SOUVENIR,
    unit_business: UnitBusinessSateliteQubuEnum.SOUVENIR,
  },
  swimming_class: {
    warehouse_id: WarehouseIdEnum.SWIMMING_CLASS,
    unit_business: UnitBusinessSateliteQubuEnum.SOUVENIR,
  },
  locker: {
    warehouse_id: WarehouseIdEnum.LOCKER,
    unit_business: UnitBusinessSateliteQubuEnum.LOCKER,
  },
  entry_pass: {
    warehouse_id: WarehouseIdEnum.ENTRY_PASS,
    unit_business: UnitBusinessSateliteQubuEnum.SOUVENIR,
  },
  dimsum: {
    warehouse_id: WarehouseIdEnum.DIMSUM,
    unit_business: UnitBusinessSateliteQubuEnum.DIMSUM,
  },
  water_park_ticket: {
    warehouse_id: WarehouseIdEnum.WATER_PARK_TICKET,
    unit_business: UnitBusinessSateliteQubuEnum.WATER_PARK_TICKET,
  },
  resto_patio: {
    warehouse_id: WarehouseIdEnum.RESTO_PATIO,
    unit_business: UnitBusinessSateliteQubuEnum.RESTO_PATIO,
  },
};
