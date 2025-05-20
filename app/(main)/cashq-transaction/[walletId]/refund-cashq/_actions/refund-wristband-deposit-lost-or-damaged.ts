"use server";

import { db } from "@/db";
import { walletWristband, wristbands } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { WalletWristbandReturnStatusEnum } from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getCurrentDate } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function refundWristbandDepositLostOrDamaged({
  walletId,
  wristbandCode,
}: {
  walletId: bigint;
  wristbandCode: string;
}): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [
        PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_DEPOSIT_WITHDRAW_LOST_DAMAGED,
      ],
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized) throw new Error("User haven't permission");

    await db.transaction(async (tx) => {
      await tx
        .update(walletWristband)
        .set({
          return_status: WalletWristbandReturnStatusEnum.HAS_RETURNED,
          returned_at: getCurrentDate(),
        })
        .where(
          and(
            eq(walletWristband.wallet_id, walletId),
            eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
            eq(
              walletWristband.return_status,
              WalletWristbandReturnStatusEnum.RENTED,
            ),
            eq(walletWristband.wristband_code, wristbandCode),
          ),
        );

      await tx
        .update(wristbands)
        .set({ status: WristbandStatusEnum.LOST_DAMAGED })
        .where(eq(wristbands.code, wristbandCode));
    });
    return {
      status: "success",
      message: "Berhasil retur manual gelang rusak",
      url: `/cashq-transaction/${walletId}/refund-cashq`,
    };
  } catch (error: any) {
    console.error(error);
    return {
      status: "error",
      message: "Gagal retur manual gelang rusak. Terjadi kesalahan pada sistem",
    };
  }
}
