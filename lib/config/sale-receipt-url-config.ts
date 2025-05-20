import { SalesTransactionTypeEnum } from "../enums/SalesTransactionType";
import { UnitBusinessSateliteQubuEnum } from "../enums/UnitBusinessSateliteQubuEnum";

// TODO: change this mechanism cause to difficult to maintain
const saleReceiptUrlConfig: string[][] = [
  [
    UnitBusinessSateliteQubuEnum.DIMSUM,
    SalesTransactionTypeEnum.DIMSUM_SALE,
    "/pos/dimsum/captain-order/:captainOrderId/sales/:id/receipt",
  ],
  [
    UnitBusinessSateliteQubuEnum.FOOD_CORNER,
    SalesTransactionTypeEnum.FOOD_CORNER_SALE,
    "/pos/food-corner/sales/:id/receipt",
  ],
  [
    UnitBusinessSateliteQubuEnum.LOCKER,
    SalesTransactionTypeEnum.BINDING_CASHQ,
    "/cashq-transaction/:walletId/binding-cashq/sales/:id/receipt",
  ],
  [
    UnitBusinessSateliteQubuEnum.LOCKER,
    SalesTransactionTypeEnum.GAZEBO_RENT,
    "/cashq-transaction/:walletId/gazebo-rent/sales/:id/receipt",
  ],
  [
    UnitBusinessSateliteQubuEnum.LOCKER,
    SalesTransactionTypeEnum.LOCKER_RENT,
    "/cashq-transaction/:walletId/locker-rent/sales/:id/receipt",
  ],
  [
    UnitBusinessSateliteQubuEnum.LOCKER,
    SalesTransactionTypeEnum.LOCKER_SOUVENIR_SALE,
    "/pos/locker/sales/:id/receipt",
  ],
  [
    UnitBusinessSateliteQubuEnum.LOCKER,
    SalesTransactionTypeEnum.SWIMSUIT_RENT,
    "/swimsuit-rent/sales/:id/receipt",
  ],
  [
    UnitBusinessSateliteQubuEnum.LOCKER,
    SalesTransactionTypeEnum.TOP_UP,
    "/cashq-transaction/:walletId/top-up/sales/:id/receipt",
  ],
  // NOTE: already handled sale add wristband when locker rent
  [
    UnitBusinessSateliteQubuEnum.LOCKER,
    SalesTransactionTypeEnum.WRISTBAND_RENT,
    "/wristband-rent/sales/:id/receipt",
  ],
  [
    UnitBusinessSateliteQubuEnum.RESTO_PATIO,
    SalesTransactionTypeEnum.RESTO_PATIO_SALE,
    "/pos/resto/patio/captain-order/:captainOrderId/sales/:id/receipt",
  ],
  [
    UnitBusinessSateliteQubuEnum.SOUVENIR,
    SalesTransactionTypeEnum.ENTRY_PASS,
    "/entry-pass/sales/:id/receipt",
  ],
  [
    UnitBusinessSateliteQubuEnum.SOUVENIR,
    SalesTransactionTypeEnum.SOUVENIR_SALE,
    "/pos/souvenir/sales/:id/receipt",
  ],
  [
    UnitBusinessSateliteQubuEnum.SOUVENIR,
    SalesTransactionTypeEnum.SWIMMING_CLASS,
    "/swimming-class/sales/:id/receipt",
  ],
  // NOTE: already handled sale normal ticket, ticket booklet and promo and ticket online
  [
    UnitBusinessSateliteQubuEnum.WATER_PARK_TICKET,
    SalesTransactionTypeEnum.TICKET_SALE,
    "/tickets/sales/:id/receipt",
  ],
];

export default saleReceiptUrlConfig;
