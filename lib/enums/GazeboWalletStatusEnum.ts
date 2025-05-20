export enum GazeboWalletStatusEnum {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export function getGazeboWalletStatusCase(status: GazeboWalletStatusEnum): string {
  let gazeboWalletStatus = "";

  switch (status) {
    case GazeboWalletStatusEnum.OPEN:
      gazeboWalletStatus = "Open";
      break;
    case GazeboWalletStatusEnum.CLOSED:
      gazeboWalletStatus = "Closed";
      break;
    default:
      gazeboWalletStatus = "-";
      break;
  }

  return gazeboWalletStatus;
}
