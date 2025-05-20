export enum PaymentMethodEnum {
  TUNAI = "TUNAI",
  DEBIT = "DEBIT",
  CASH_Q = "CASHQ",
  QRIS = "QRIS",
  DEPOSIT = "DEPOSIT",
  OTA_REDEMPTION = "OTA REDEMPTION",
  CREDIT_CARD = "CREDIT CARD",
  TRANSFER_BILL = "TRANSFER BILL",
  Q_VOUCHER = "Q VOUCHER",
}

export function getPaymentMethodCase(method: PaymentMethodEnum): string {
  let paymentMethod = "";

  switch (method) {
    case PaymentMethodEnum.TUNAI:
      paymentMethod = "Tunai";
      break;
    case PaymentMethodEnum.DEBIT:
      paymentMethod = "Debit";
      break;
    case PaymentMethodEnum.CASH_Q:
      paymentMethod = "CashQ";
      break;
    case PaymentMethodEnum.QRIS:
      paymentMethod = "QRIS";
      break;
    case PaymentMethodEnum.DEPOSIT:
      paymentMethod = "Deposit";
      break;
    case PaymentMethodEnum.OTA_REDEMPTION:
      paymentMethod = "OTA Redemption";
      break;
    case PaymentMethodEnum.CREDIT_CARD:
      paymentMethod = "Credit Card";
      break;
    case PaymentMethodEnum.TRANSFER_BILL:
      paymentMethod = "Transfer Bill";
      break;
    case PaymentMethodEnum.Q_VOUCHER:
      paymentMethod = "Q Voucher";
      break;
    default:
      paymentMethod = "-";
      break;
  }

  return paymentMethod;
}
