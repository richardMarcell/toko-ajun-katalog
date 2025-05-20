export enum SalesTransactionTypeEnum {
  // Wallet
  CASHQ = "CASHQ",

  // Food Corner
  FOOD_CORNER_SALE = "FOOD CORNER SALE",

  // Locker
  GAZEBO_RENT = "GAZEBO RENT",
  LOCKER_RENT = "LOCKER RENT",
  SWIMSUIT_RENT = "SWIMSUIT RENT",
  LOCKER_SOUVENIR_SALE = "LOCKER SOUVENIR SALE",

  // Souvenir
  ENTRY_PASS = "ENTRY PASS",
  SWIMMING_CLASS = "SWIMMING CLASS",
  SOUVENIR_SALE = "SOUVENIR SALE",

  // Dimsum
  DIMSUM_SALE = "DIMSUM SALE",

  // Water Park Ticket
  TICKET_SALE = "TICKET SALE",
  TICKET_WRISTBAND_FORFEIT = "TICKET WRISTBAND FORFEIT",

  WRISTBAND_RENT = "WRISTBAND RENT",

  TOP_UP = "TOP UP",

  BINDING_CASHQ = "BINDING CASHQ",

  RESTO_PATIO_SALE = "RESTO PATIO SALE",
}

export function getSalesDisplayTransactionType(
  type: SalesTransactionTypeEnum,
): string {
  let transactionType = "";

  switch (type) {
    case SalesTransactionTypeEnum.CASHQ:
      transactionType = "CashQ";
      break;
    case SalesTransactionTypeEnum.FOOD_CORNER_SALE:
      transactionType = "Food Corner Sale";
      break;
    case SalesTransactionTypeEnum.GAZEBO_RENT:
      transactionType = "Gazebo Rent";
      break;
    case SalesTransactionTypeEnum.LOCKER_RENT:
      transactionType = "Locker Rent";
      break;
    case SalesTransactionTypeEnum.SWIMSUIT_RENT:
      transactionType = "Swimsuit Rent";
      break;
    case SalesTransactionTypeEnum.ENTRY_PASS:
      transactionType = "Entry Pass";
      break;
    case SalesTransactionTypeEnum.SWIMMING_CLASS:
      transactionType = "Swimming Class";
      break;
    case SalesTransactionTypeEnum.SOUVENIR_SALE:
      transactionType = "Souvenir Sale";
      break;
    case SalesTransactionTypeEnum.DIMSUM_SALE:
      transactionType = "Dimsum Sale";
      break;
    case SalesTransactionTypeEnum.LOCKER_SOUVENIR_SALE:
      transactionType = "Locker Souvenir Sale";
      break;
    case SalesTransactionTypeEnum.TICKET_SALE:
      transactionType = "Ticket Sale";
      break;
    case SalesTransactionTypeEnum.TICKET_WRISTBAND_FORFEIT:
      transactionType = "Ticket Wristband Forfeit";
      break;
    case SalesTransactionTypeEnum.WRISTBAND_RENT:
      transactionType = "Wristband Rent";
      break;
    case SalesTransactionTypeEnum.TOP_UP:
      transactionType = "Top Up";
      break;
    case SalesTransactionTypeEnum.BINDING_CASHQ:
      transactionType = "Binding CashQ";
      break;
    case SalesTransactionTypeEnum.RESTO_PATIO_SALE:
      transactionType = "Resto Patio Sale";
      break;
    default:
      transactionType = "-";
      break;
  }

  return transactionType;
}
