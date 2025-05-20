import { db } from "@/db";

export async function getWalletHistory({
  salesId,
}: {
  salesId: bigint;
}): Promise<{
  walletHistory: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    amount: string;
    created_by: bigint;
    transaction_type: string;
    wallet_id: bigint;
    sale_id: bigint | null;
    wallet_cash_receive_id: bigint | null;
    prev_saldo: string;
    current_saldo: string;
    deposit_wristband_qty: number | null;
    walletCashReceive: { grand_total: string } | null;
  } | null;
}> {
  const walletHistory = await db.query.walletHistories.findFirst({
    with: { walletCashReceive: { columns: { grand_total: true } } },
    where: (walletHistories, { eq }) => eq(walletHistories.sale_id, salesId),
  });

  if (!walletHistory)
    return {
      walletHistory: null,
    };

  return {
    walletHistory: walletHistory,
  };
}
