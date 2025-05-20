import { db } from "@/db";

export async function getCashQTransactionWithTypeGazeboRentList({
  walletId,
}: {
  walletId: string;
}) {
  const cashqTransactionWithTypeGazeboRentList =
    await db.query.gazeboWallet.findMany({
      with: {
        gazebo: {
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
      where: (gazeboWallet, { eq }) =>
        eq(gazeboWallet.wallet_id, BigInt(walletId)),

      columns: {
        id: true,
        return_status: true,
        created_at: true,
      },
    });

  return {
    cashqTransactionWithTypeGazeboRentList:
      cashqTransactionWithTypeGazeboRentList,
  };
}
