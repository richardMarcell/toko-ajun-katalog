import { db } from "@/db";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";

export async function getCashQTransactionWithTypeTopUpList({
  walletId,
}: {
  walletId: string;
}) {
  const cashqTransactionWithTypeTopUpList =
    await db.query.walletHistories.findMany({
      with: { user: { columns: { name: true } } },
      where: (walletHistories, { eq, and }) =>
        and(
          eq(walletHistories.wallet_id, BigInt(walletId)),
          eq(
            walletHistories.transaction_type,
            WalletTransactionTypeEnum.TOP_UP,
          ),
        ),

      columns: {
        id: true,
        amount: true,
        created_at: true,
      },
    });

  return {
    cashqTransactionWithTypeTopUpList: cashqTransactionWithTypeTopUpList,
  };
}
