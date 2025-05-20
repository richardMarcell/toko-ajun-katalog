export enum WalletStatusEnum {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export function getWalletStatusCase(status: WalletStatusEnum): string {
  let walletStatus = "";

  switch (status) {
    case WalletStatusEnum.OPEN:
      walletStatus = "Open";
      break;
    case WalletStatusEnum.CLOSED:
      walletStatus = "Closed";
      break;
    default:
      walletStatus = "-";
      break;
  }

  return walletStatus;
}
