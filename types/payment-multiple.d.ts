import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";

export type PaymentMethod = PaymentMethodEnum;

type PaymentBase = {
  method: PaymentMethod;
  total_payment: number;
};

export type PaymentTunai = PaymentBase & {
  method: PaymentMethodEnum.TUNAI;
};

export type PaymentDebit = PaymentBase & {
  method: PaymentMethodEnum.DEBIT;
  cardholder_name: string;
  debit_card_number: string;
  debit_issuer_bank: string;
  referenced_id: string;
};

export type PaymentCashQ = PaymentBase & {
  method: PaymentMethodEnum.CASH_Q;
  wristband_code: string;
};

export type PaymentQris = PaymentBase & {
  method: PaymentMethodEnum.QRIS;
  qris_issuer: string;
};

export type PaymentCreditCard = PaymentBase & {
  method: PaymentMethodEnum.CREDIT_CARD;
  credit_card_number: string;
};

export type PaymentTransferBill = PaymentBase & {
  method: PaymentMethodEnum.TRANSFER_BILL;
  room_number: string;
};

export type PaymentQVoucher = PaymentBase & {
  method: PaymentMethodEnum.Q_VOUCHER;
  q_voucher_codes: string[];
};

export type PaymentMultiple =
  | PaymentTunai
  | PaymentDebit
  | PaymentCashQ
  | PaymentQris
  | PaymentCreditCard
  | PaymentTransferBill
  | PaymentQVoucher;
