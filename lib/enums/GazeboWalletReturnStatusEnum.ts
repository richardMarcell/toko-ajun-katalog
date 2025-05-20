export enum GazeboWalletReturnStatusEnum {
  HAS_RETURNED = "HAS RETURNED",
  NOT_RETURNED = "NOT RETURNED",
}

export function getGazeboWalletReturnDisplayStatus(
  status: GazeboWalletReturnStatusEnum,
): string {
  let returnStatus = "";

  switch (status) {
    case GazeboWalletReturnStatusEnum.HAS_RETURNED:
      returnStatus = "Has Returned";
      break;
    case GazeboWalletReturnStatusEnum.NOT_RETURNED:
      returnStatus = "Not Returned";
      break;
    default:
      returnStatus = "-";
      break;
  }

  return returnStatus;
}
