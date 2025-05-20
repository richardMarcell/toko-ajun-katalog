import { db } from "@/db";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";

export async function getWalletHistory({
  walletHistoryId,
  walletCashReceiveId,
}: {
  walletHistoryId: string;
  walletCashReceiveId: string;
}) {
  const walletHistory = await db.query.walletHistories.findFirst({
    where: (walletHistories, { eq, and }) =>
      and(
        eq(walletHistories.wallet_cash_receive_id, BigInt(walletCashReceiveId)),
        eq(walletHistories.id, BigInt(walletHistoryId)),
        eq(walletHistories.transaction_type, WalletTransactionTypeEnum.DEPOSIT),
      ),
    with: {
      wallet: true,
      walletCashReceive: true,
    },
  });

  return {
    walletHistory: walletHistory,
  };
}
