export enum LockerWalletReturnStatusEnum {
  HAS_RETURNED = "HAS RETURNED",
  NOT_RETURNED = "NOT RETURNED",
}

export function getLockerWalletReturnDisplayStatus(
  status: LockerWalletReturnStatusEnum,
): string {
  let returnStatus = "";

  switch (status) {
    case LockerWalletReturnStatusEnum.HAS_RETURNED:
      returnStatus = "Has Returned";
      break;
    case LockerWalletReturnStatusEnum.NOT_RETURNED:
      returnStatus = "Not Returned";
      break;
    default:
      returnStatus = "-";
      break;
  }

  return returnStatus;
}
