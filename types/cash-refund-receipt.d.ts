import { CashRefundReceiptDetail } from "./cash-refund-receipt-detail";

export type CashRefundReceipt = {
  id: number;
  op: string;
  date: Date;
  total_refund: number;
  cash_refund_details: CashRefundReceiptDetail[];
};
