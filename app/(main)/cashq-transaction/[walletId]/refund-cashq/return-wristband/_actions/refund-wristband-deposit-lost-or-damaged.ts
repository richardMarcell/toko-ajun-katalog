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
import { createYupValidationError, getCurrentDate } from "@/lib/utils";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { ServerActionResponse } from "@/types/domains/server-action";
import { and, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function refundWristbandDepositLostOrDamaged({
  walletId,
  userAccessCode,
}: {
  walletId: bigint;
  userAccessCode: string;
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

    const isUserAccessCodeValid = true;

    if (!isUserAccessCodeValid) {
      const validationError = createYupValidationError(
        "access_code",
        userAccessCode,
        "User tidak memiliki akses untuk melakukan proses ini",
      );
      throw validationError;
    }

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

    const walletWristbandNotReturnedList =
      await db.query.walletWristband.findMany({
        where: and(
          eq(walletWristband.wallet_id, walletId),
          eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
          eq(
            walletWristband.return_status,
            WalletWristbandReturnStatusEnum.NOT_RETURNED,
          ),
        ),
      });

    const wristbandLostOrDamagedTotal = walletWristbandNotReturnedList.length;

    const totalForfeit =
      Number(wristbandProduct.price) * wristbandLostOrDamagedTotal;

    const totalDepostMinusForfeit =
      Number(wallet.deposit_amount) - totalForfeit;

    await db.transaction(async (tx) => {
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
            inArray(
              walletWristband.wristband_code,
              walletWristbandNotReturnedList.map(
                (walletWristband) => walletWristband.wristband_code,
              ),
            ),
            eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
          ),
        );

      const { walletCashRefundId } = await storeWalletCashRefund({
        totalRefund: totalForfeit.toString(),
        refundDetails: walletWristbandNotReturnedList.map((walletWristband) => {
          return {
            // TODO: change the format to #000001
            item_name: "Gelang #" + walletWristband.id.toString(),
            item_product_id: wristbandProduct.id,
            item_qty: 1,
            subtotal: wristbandProduct.price,
          };
        }),
        userId: BigInt(user.id),
        tx: tx,
      });

      await tx.insert(walletHistories).values({
        wallet_id: wallet.id,
        wallet_cash_refund_id: walletCashRefundId,
        transaction_type: WalletTransactionTypeEnum.DEPOSIT_WITHDRAW,
        prev_saldo: wallet.deposit_amount,
        current_saldo: totalDepostMinusForfeit.toString(),
        amount: "-" + totalForfeit.toString(),
        created_by: BigInt(user.id),
      });

      await tx
        .update(wallets)
        .set({
          deposit_amount: totalDepostMinusForfeit.toString(),
        })
        .where(eq(wallets.id, wallet.id));
    });

    return {
      status: "success",
      message: "Berhasil mengembalikan deposit gelang yang rusak atau hilang",
      url: `/cashq-transaction/${wallet.id}/refund-cashq/receipt-deposit-withdraw-lost-or-damaged-wristband-only`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message: "Gagal melakukan void. Terjadi kesalahan pada sistem",
      };
    }

    const errors: { [key: string]: string } = {};
    if (error.inner) {
      error.inner.forEach((e: any) => {
        if (e.path) {
          errors[e.path] = e.message;
        }
      });
    }

    return {
      status: "error",
      message:
        "Gagal mengembalikan deposit gelang yang rusak atau hilang. Terjadi kesalahan pada sistem",
      errors: errors,
    };
  }
}
