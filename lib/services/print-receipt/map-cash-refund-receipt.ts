import { User } from "@/types/next-auth";
import { CashRefundReceipt } from "@/types/cash-refund-receipt";
import { WalletCashRefund } from "@/types/wallet-cash-refund";
import { WalletCashRefundDetail } from "@/types/wallet-cash-refund-detail";

type MapCashRefundReceipt = Pick<
  WalletCashRefund,
  "id" | "created_at" | "total_refund"
> & {
  createBy: Pick<User, "name">;
  walletCashRefundDetails: Array<
    Pick<WalletCashRefundDetail, "item_name" | "item_qty" | "subtotal">
  >;
};

export default function mapCashRefundReceipt({
  walletCashRefund,
}: {
  walletCashRefund: MapCashRefundReceipt;
}): CashRefundReceipt {
  return {
    id: Number(walletCashRefund.id),
    op: walletCashRefund.createBy.name,
    date: walletCashRefund.created_at,
    total_refund: Number(walletCashRefund.total_refund),
    cash_refund_details: walletCashRefund.walletCashRefundDetails.map(
      (walletCashRefundDetail) => ({
        item: walletCashRefundDetail.item_name,
        qty: walletCashRefundDetail.item_qty,
        subtotal: Number(walletCashRefundDetail.subtotal),
      }),
    ),
  };
}
