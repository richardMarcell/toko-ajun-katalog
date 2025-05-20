export enum WalletWristbandStatusEnum {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export function getWalletWristbandStatusCase(
  status: WalletWristbandStatusEnum,
): string {
  let walletWristbandStatus = "";

  switch (status) {
    case WalletWristbandStatusEnum.OPEN:
      walletWristbandStatus = "Open";
      break;
    case WalletWristbandStatusEnum.CLOSED:
      walletWristbandStatus = "Close";
      break;
    default:
      walletWristbandStatus = "-";
      break;
  }

  return walletWristbandStatus;
}
