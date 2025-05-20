import { db } from "@/db";
import { wallets, walletWristband } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import PanelTopUp from "./_components/panel-top-up";

type WalletType = {
  id: bigint;
  saldo: string;
  walletWristbands: WalletWristbandType[];
};

type WalletWristbandType = {
  wristband_code: string;
};

export default async function CashqTopUpPage({
  params,
}: {
  params: Promise<{ walletId: string }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_TOP_UP_CREATE],
    user: user,
  });

  const { walletId } = await params;

  const walletList = await db
    .select({
      id: wallets.id,
      saldo: wallets.saldo,
      // TODO: saat filter kode gelang yang muncul hanya kode gelang yang ada dalam filter
      walletWristbands: sql`JSON_ARRAYAGG(
            JSON_OBJECT(
              'wristband_code', ${walletWristband.wristband_code}
            )
          )`.as("walletWristbands"),
    })
    .from(wallets)
    .where(eq(wallets.id, BigInt(walletId)))
    .leftJoin(walletWristband, eq(walletWristband.wallet_id, wallets.id))
    .groupBy(wallets.id);

  const walletListMapped: WalletType[] = walletList.map((wallet) => ({
    ...wallet,
    walletWristbands: wallet.walletWristbands
      ? (wallet.walletWristbands as WalletWristbandType[])
      : [],
  }));

  const walletMapped = walletListMapped[0];

  return <PanelTopUp wallet={walletMapped} />;
}
