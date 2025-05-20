import { db } from "@/db";

export async function getCashQTransactionWithTypeLockerRentList({
  walletId,
}: {
  walletId: string;
}) {
  const cashqTransactionWithTypeLockerRentList =
    await db.query.lockerWallet.findMany({
      with: {
        locker: {
          columns: {
            label: true,
            type: true,
          },
        },
        user: {
          columns: {
            name: true,
          },
        },
      },
      where: (lockerWallet, { eq }) =>
        eq(lockerWallet.wallet_id, BigInt(walletId)),

      columns: {
        id: true,
        return_status: true,
        created_at: true,
      },
    });

  return {
    cashqTransactionWithTypeLockerRentList:
      cashqTransactionWithTypeLockerRentList,
  };
}
