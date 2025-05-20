export enum WalletTransactionTypeEnum {
  DEPOSIT = "DEPOSIT",
  WRISTBAND_RENT = "WRISTBAND RENT",
  GAZEBO_RENT = "GAZEBO RENT",
  LOCKER_RENT = "LOCKER RENT",
  SWIMSUIT_RENT = "SWIMSUIT RENT",
  TOP_UP = "TOP UP",
  DEPOSIT_FORFEIT = "DEPOSIT FORFEIT",
  DEPOSIT_WITHDRAW = "DEPOSIT WITHDRAW",
  SALDO_WITHDRAW = "SALDO WITHDRAW",
  FOOD_CORNER_SALE = "FOOD CORNER SALE",
  LOCKER_SOUVENIR_SALE = "LOCKER SOUVENIR SALE",
  ENTRY_PASS = "ENTRY PASS",
  SWIMMING_CLASS = "SWIMMING CLASS",
  SOUVENIR_SALE = "SOUVENIR SALE",
  DIMSUM_SALE = "DIMSUM SALE",
  TICKET_SALE = "TICKET SALE",
  TICKET_WRISTBAND_FORFEIT = "TICKET WRISTBAND FORFEIT",
}

export function getWalletTransactionTypeEnumCase(
  status: WalletTransactionTypeEnum,
): string {
  let transactionType = "";

  switch (status) {
    case WalletTransactionTypeEnum.DEPOSIT:
      transactionType = "Deposit";
      break;
    case WalletTransactionTypeEnum.WRISTBAND_RENT:
      transactionType = "Wristband Rent";
      break;
    case WalletTransactionTypeEnum.GAZEBO_RENT:
      transactionType = "Gazebo Rent";
      break;
    case WalletTransactionTypeEnum.LOCKER_RENT:
      transactionType = "Locker Rent";
      break;
    case WalletTransactionTypeEnum.SWIMSUIT_RENT:
      transactionType = "Swimsuit Rent";
      break;
    case WalletTransactionTypeEnum.TOP_UP:
      transactionType = "Top Up";
      break;
    case WalletTransactionTypeEnum.DEPOSIT_FORFEIT:
      transactionType = "Deposit Forfeit";
      break;
    case WalletTransactionTypeEnum.DEPOSIT_WITHDRAW:
      transactionType = "Deposit Withdraw";
      break;
    case WalletTransactionTypeEnum.SALDO_WITHDRAW:
      transactionType = "Saldo Withdraw";
      break;
    case WalletTransactionTypeEnum.FOOD_CORNER_SALE:
      transactionType = "Food Corner Sale";
      break;
    case WalletTransactionTypeEnum.LOCKER_SOUVENIR_SALE:
      transactionType = "Locker Souvenir Sale";
      break;
    case WalletTransactionTypeEnum.ENTRY_PASS:
      transactionType = "Entry Pass";
      break;
    case WalletTransactionTypeEnum.SWIMMING_CLASS:
      transactionType = "Swimming Class";
      break;
    case WalletTransactionTypeEnum.SOUVENIR_SALE:
      transactionType = "Souvenir Sale";
      break;
    case WalletTransactionTypeEnum.DIMSUM_SALE:
      transactionType = "Dimsum Sale";
      break;
    case WalletTransactionTypeEnum.TICKET_SALE:
      transactionType = "Ticket Offline Sale";
      break;
    case WalletTransactionTypeEnum.TICKET_WRISTBAND_FORFEIT:
      transactionType = "Ticket Wristband Forfeit";
      break;
    default:
      transactionType = "-";
      break;
  }

  return transactionType;
}
