export enum LockerWalletPaymentStatusEnum {
  UNPAID = "UNPAID",
  PAID = "PAID",
}

export function getLockerWalletPaymentSatatusCase(
  paymentSatatus: LockerWalletPaymentStatusEnum,
): string {
  let lockerPaymentSatatus = "";

  switch (paymentSatatus) {
    case LockerWalletPaymentStatusEnum.UNPAID:
      lockerPaymentSatatus = "Unpaid";
      break;
    case LockerWalletPaymentStatusEnum.PAID:
      lockerPaymentSatatus = "Paid";
      break;
    default:
      lockerPaymentSatatus = "-";
      break;
  }

  return lockerPaymentSatatus;
}
