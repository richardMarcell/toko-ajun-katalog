import { db } from "@/db";

export async function getWalletGeneralInformation({
  walletId,
}: {
  walletId: string;
}) {
  const walletGeneralInformation = await db.query.wallets.findFirst({
    where: (wallets, { eq }) => eq(wallets.id, BigInt(walletId)),
    columns: {
      deposit_amount: true,
      customer_name: true,
      customer_phone_number: true,
      created_at: true,
    },
  });

  return {
    walletGeneralInformation: walletGeneralInformation,
  };
}
