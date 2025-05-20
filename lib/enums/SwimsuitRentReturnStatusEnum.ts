export enum SwimsuitRentReturnStatusEnum {
  HAS_RETURNED = "HAS RETURNED",
  NOT_RETURNED = "NOT RETURNED",
}

export function getSwimsuitRentReturnStatusCase(
  status: SwimsuitRentReturnStatusEnum,
): string {
  let returnStatus = "";

  switch (status) {
    case SwimsuitRentReturnStatusEnum.HAS_RETURNED:
      returnStatus = "Has Returned";
      break;
    case SwimsuitRentReturnStatusEnum.NOT_RETURNED:
      returnStatus = "Not Returned";
      break;
    default:
      returnStatus = "-";
      break;
  }

  return returnStatus;
}
