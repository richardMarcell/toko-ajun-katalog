import { walletCashRefundDetails, walletCashRefunds } from "@/db/schema";
import { DatabaseTransaction } from "@/types/db-transaction";

type WalletCashRefundDetail = {
  item_name: string;
  item_product_id: bigint;
  item_qty: number;
  subtotal: string;
};

type StoreWalletCashRefundProps = {
  totalRefund: string;
  refundDetails: WalletCashRefundDetail[];
  userId: bigint;
  tx: DatabaseTransaction;
};

export default async function storeWalletCashRefund({
  totalRefund,
  refundDetails,
  userId,
  tx,
}: StoreWalletCashRefundProps): Promise<{ walletCashRefundId: bigint }> {
  const walletCashRefund = await tx
    .insert(walletCashRefunds)
    .values({
      total_refund: totalRefund,
      created_by: userId,
    })
    .$returningId();

  const walletCashRefundId = walletCashRefund[0].id;

  await tx.insert(walletCashRefundDetails).values(
    refundDetails.map((refundDetail) => ({
      ...refundDetail,
      wallet_cash_refund_id: walletCashRefundId,
    })),
  );

  return { walletCashRefundId: walletCashRefundId };
}
