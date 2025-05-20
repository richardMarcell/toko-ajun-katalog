import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";

export default function getPaymentMethod(options?: {
  isIncludeCashQ?: boolean;
}): PaymentMethodEnum[] {
  const { isIncludeCashQ = true } = options ?? {};

  if (isIncludeCashQ) return getPaymentMethodsForGeneral();

  return getPaymentMethodsExcludeCashQ();
}

export function getPaymentMethodOnRestoPatio(): PaymentMethodEnum[] {
  return [
    PaymentMethodEnum.TUNAI,
    PaymentMethodEnum.DEBIT,
    PaymentMethodEnum.QRIS,
    PaymentMethodEnum.CREDIT_CARD,
    PaymentMethodEnum.TRANSFER_BILL,
    PaymentMethodEnum.Q_VOUCHER,
  ];
}

export function getPaymentMethodOnDimsum(): PaymentMethodEnum[] {
  return [
    PaymentMethodEnum.TUNAI,
    PaymentMethodEnum.DEBIT,
    PaymentMethodEnum.QRIS,
    PaymentMethodEnum.CREDIT_CARD,
    PaymentMethodEnum.TRANSFER_BILL,
    PaymentMethodEnum.Q_VOUCHER,
  ];
}

export function getPaymentMethodsForGeneral(): PaymentMethodEnum[] {
  return [
    PaymentMethodEnum.TUNAI,
    PaymentMethodEnum.DEBIT,
    PaymentMethodEnum.CASH_Q,
    PaymentMethodEnum.QRIS,
    PaymentMethodEnum.CREDIT_CARD,
    PaymentMethodEnum.TRANSFER_BILL,
    PaymentMethodEnum.Q_VOUCHER,
  ];
}

export function getPaymentMethodsExcludeCashQ(): PaymentMethodEnum[] {
  return [
    PaymentMethodEnum.TUNAI,
    PaymentMethodEnum.DEBIT,
    PaymentMethodEnum.QRIS,
    PaymentMethodEnum.CREDIT_CARD,
    PaymentMethodEnum.TRANSFER_BILL,
    PaymentMethodEnum.Q_VOUCHER,
  ];
}
