export enum GazeboWalletPaymentStatusEnum {
  UNPAID = "UNPAID",
  PAID = "PAID",
}

export function getGazeboWalletPaymentSatatusCase(
  paymentSatatus: GazeboWalletPaymentStatusEnum,
): string {
  let gazeboPaymentSatatus = "";

  switch (paymentSatatus) {
    case GazeboWalletPaymentStatusEnum.UNPAID:
      gazeboPaymentSatatus = "Unpaid";
      break;
    case GazeboWalletPaymentStatusEnum.PAID:
      gazeboPaymentSatatus = "Paid";
      break;
    default:
      gazeboPaymentSatatus = "-";
      break;
  }

  return gazeboPaymentSatatus;
}
