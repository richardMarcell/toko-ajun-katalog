export enum WalletWristbandReturnStatusEnum {
  RENTED = "RENTED",
  HAS_RETURNED = "HAS RETURNED",
  NOT_RETURNED = "NOT RETURNED",
}

export function getWalletWristbandReturnDisplayStatus(
  status: WalletWristbandReturnStatusEnum,
): string {
  let returnStatus = "";

  switch (status) {
    case WalletWristbandReturnStatusEnum.RENTED:
      returnStatus = "Rented";
      break;
    case WalletWristbandReturnStatusEnum.HAS_RETURNED:
      returnStatus = "Has Returned";
      break;
    case WalletWristbandReturnStatusEnum.NOT_RETURNED:
      returnStatus = "Not Returned";
      break;
    default:
      returnStatus = "-";
      break;
  }

  return returnStatus;
}
