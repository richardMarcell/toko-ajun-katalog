export enum LockerWalletStatusEnum {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export function getLockerWalletStatusCase(status: LockerWalletStatusEnum): string {
  let walletStatus = "";

  switch (status) {
    case LockerWalletStatusEnum.OPEN:
      walletStatus = "Open";
      break;
    case LockerWalletStatusEnum.CLOSED:
      walletStatus = "Closed";
      break;
    default:
      walletStatus = "-";
      break;
  }

  return walletStatus;
}
