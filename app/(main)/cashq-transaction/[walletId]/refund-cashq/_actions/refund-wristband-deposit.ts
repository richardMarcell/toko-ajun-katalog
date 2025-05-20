"use server";

import { db } from "@/db";
import { walletHistories, wallets, walletWristband } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { WalletWristbandReturnStatusEnum } from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import storeWalletCashRefund from "@/lib/services/refund-wristband/store-wallet-cash-refund";
import { getCurrentDate } from "@/lib/utils";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { ServerActionResponse } from "@/types/domains/server-action";
import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function refundWristbandDeposit({
  walletId,
}: {
  walletId: bigint;
}): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [
        PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_DEPOSIT_WITHDRAW,
      ],
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized) throw new Error("User haven't permission");

    const { wristbandProduct } = await getWristbandProduct();

    if (!wristbandProduct) throw new Error("Product wristband not found");

    const wallet = await db.query.wallets.findFirst({
      columns: {
        id: true,
        deposit_amount: true,
      },
      where: eq(wallets.id, walletId),
    });

    if (!wallet) throw new Error("Wallet not found");

    const walletWristbandHasReturnedList =
      await db.query.walletWristband.findMany({
        where: and(
          eq(walletWristband.wallet_id, wallet.id),
          eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
          eq(
            walletWristband.return_status,
            WalletWristbandReturnStatusEnum.HAS_RETURNED,
          ),
          eq(walletWristband.is_deposit_wristband_returned, false),
        ),
      });

    const totalWalletWristbandHasReturned =
      walletWristbandHasReturnedList.length;

    if (totalWalletWristbandHasReturned === 0) {
      return {
        status: "success",
        message:
          "Seluruh deposit gelang dengan status dikembalikan sudah berhasil direfund.",
        url: `/cashq-transaction/${wallet.id}/refund-cashq`,
      };
    }

    const totalDepositRefund =
      totalWalletWristbandHasReturned * Number(wristbandProduct.price);

    await db.transaction(async (tx) => {
      const { walletCashRefundId } = await storeWalletCashRefund({
        totalRefund: totalDepositRefund.toString(),
        refundDetails: [
          {
            item_name: wristbandProduct.description,
            item_product_id: wristbandProduct.id,
            item_qty: totalWalletWristbandHasReturned,
            subtotal: totalDepositRefund.toString(),
          },
        ],
        userId: BigInt(user.id),
        tx: tx,
      });

      await tx.insert(walletHistories).values({
        wallet_id: wallet.id,
        wallet_cash_refund_id: walletCashRefundId,
        transaction_type: WalletTransactionTypeEnum.DEPOSIT_WITHDRAW,
        prev_saldo: wallet.deposit_amount,
        current_saldo: (
          Number(wallet.deposit_amount) - totalDepositRefund
        ).toString(),
        amount: "-" + totalDepositRefund.toString(),
        created_by: BigInt(user.id),
      });

      await tx
        .update(walletWristband)
        .set({
          status: WalletWristbandStatusEnum.CLOSED,
          is_deposit_wristband_returned: true,
          deposit_wristband_returned_by: BigInt(user.id),
          deposit_wristband_returned_at: getCurrentDate(),
        })
        .where(
          and(
            eq(walletWristband.wallet_id, wallet.id),
            eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
            eq(
              walletWristband.return_status,
              WalletWristbandReturnStatusEnum.HAS_RETURNED,
            ),
            eq(walletWristband.is_deposit_wristband_returned, false),
          ),
        );

      await tx
        .update(wallets)
        .set({
          deposit_amount: sql`${wallets.deposit_amount} - ${totalDepositRefund}`,
        })
        .where(eq(wallets.id, wallet.id));
    });

    return {
      status: "success",
      message: "Berhasil mengembalikan deposit gelang",
      url: `/cashq-transaction/${wallet.id}/refund-cashq/receipt-deposit-withdraw-only`,
    };
  } catch (error: any) {
    console.error(error);

    if (error.hasOwnProperty("cause")) {
      return {
        status: "error",
        message: error["cause"],
      };
    }

    return {
      status: "error",
      message:
        "Gagal mengembalikan deposit gelang. Terjadi kesalahan pada sistem",
      errors: error,
    };
  }
}
