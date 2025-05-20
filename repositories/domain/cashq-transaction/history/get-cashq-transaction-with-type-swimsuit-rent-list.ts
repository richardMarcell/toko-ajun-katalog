import { db } from "@/db";

export async function getCashQTransactionWithTypeSwimsuitRentList({
  walletId,
}: {
  walletId: string;
}) {
  const cashqTransactionWithTypeSwimsuitRentList =
    await db.query.swimsuitRentWallet.findMany({
      with: {
        saleDetail: {
          columns: {
            qty: true,
            subtotal: true,
          },
          with: {
            product: {
              columns: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
      where: (swimsuitRentWallet, { eq }) =>
        eq(swimsuitRentWallet.wallet_id, BigInt(walletId)),

      columns: {
        id: true,
        return_status: true,
        created_at: true,
      },
    });

  return {
    cashqTransactionWithTypeSwimsuitRentList:
      cashqTransactionWithTypeSwimsuitRentList,
  };
}
