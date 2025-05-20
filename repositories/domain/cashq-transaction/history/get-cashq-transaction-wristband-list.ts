import { db } from "@/db";

export async function getCashQTransactionWristbandList({
  walletId,
}: {
  walletId: string;
}) {
  const cashqTransactionWristbandList =
    await db.query.walletWristband.findMany({
      where: (walletWristband, {eq}) => eq(walletWristband.wallet_id, BigInt(walletId)),
      columns: {
        wristband_code: true,
        return_status: true,
      }
    });

  return {
    cashqTransactionWristbandList: cashqTransactionWristbandList,
  };
}
