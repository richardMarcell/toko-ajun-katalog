import { db } from "@/db";
import { walletWristband } from "@/db/schema";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { Wallet } from "@/types/wallet";
import { and, eq } from "drizzle-orm";

export default async function getWallet({
  wristbandCode,
}: {
  wristbandCode: string;
}): Promise<{ wallet: Wallet }> {
  const wristbandRent = await db.query.walletWristband.findFirst({
    where: and(
      eq(walletWristband.wristband_code, wristbandCode),
      eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
    ),
    with: {
      wallet: true,
    },
  });

  if (!wristbandRent) return { wallet: null };

  return {
    wallet: wristbandRent.wallet,
  };
}
