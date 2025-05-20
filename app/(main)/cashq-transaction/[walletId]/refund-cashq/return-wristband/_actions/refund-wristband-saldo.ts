"use server";

import { db } from "@/db";
import {
  gazebos,
  gazeboWallet,
  lockers,
  lockerWallet,
  walletHistories,
  wallets,
  walletWristband,
} from "@/db/schema";
import { GazeboStatusEnum } from "@/lib/enums/GazeboStatusEnum";
import { GazeboWalletReturnStatusEnum } from "@/lib/enums/GazeboWalletReturnStatusEnum";
import { GazeboWalletStatusEnum } from "@/lib/enums/GazeboWalletStatusEnum";
import { LockerStatusEnum } from "@/lib/enums/LockerStatusEnum";
import { LockerWalletReturnStatusEnum } from "@/lib/enums/LockerWalletReturnStatusEnum";
import { LockerWalletStatusEnum } from "@/lib/enums/LockerWalletStatusEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { WalletStatusEnum } from "@/lib/enums/WalletStatusEnum";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import storeWalletCashRefund from "@/lib/services/refund-wristband/store-wallet-cash-refund";
import { getCurrentDate } from "@/lib/utils";
import { getTopUpProduct } from "@/repositories/domain/general/get-top-up-product";
import { ServerActionResponse } from "@/types/domains/server-action";
import { and, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function refundWristbandSaldo({
  walletId,
}: {
  walletId: bigint;
}): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [
        PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_SALDO_WITHDRAW,
      ],
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized) throw new Error("User haven't permission");

    const { topUpProduct } = await getTopUpProduct();

    if (!topUpProduct) throw new Error("Product top up not found");

    const wallet = await db.query.wallets.findFirst({
      with: {
        lockerWallets: true,
        gazeboWallets: true,
      },
      where: eq(wallets.id, walletId),
    });

    if (!wallet) throw new Error("Wallet not found");

    await db.transaction(async (tx) => {
      const { walletCashRefundId } = await storeWalletCashRefund({
        totalRefund: wallet.saldo,
        refundDetails: [
          {
            item_name: "CashQ",
            item_product_id: topUpProduct.id,
            item_qty: 1,
            subtotal: wallet.saldo,
          },
        ],
        userId: BigInt(user.id),
        tx: tx,
      });

      await tx.insert(walletHistories).values({
        wallet_id: wallet.id,
        wallet_cash_refund_id: walletCashRefundId,
        transaction_type: WalletTransactionTypeEnum.SALDO_WITHDRAW,
        prev_saldo: wallet.saldo,
        current_saldo: "0",
        amount: "-" + wallet.saldo,
        created_by: BigInt(user.id),
      });

      await tx
        .update(walletWristband)
        .set({ status: WalletWristbandStatusEnum.CLOSED })
        .where(
          and(
            eq(walletWristband.wallet_id, wallet.id),
            eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
          ),
        );

      await tx
        .update(wallets)
        .set({
          saldo: "0",
          status: WalletStatusEnum.CLOSED,
        })
        .where(eq(wallets.id, wallet.id));

      const currentTime = getCurrentDate();
      await tx
        .update(lockerWallet)
        .set({
          status: LockerWalletStatusEnum.CLOSED,
          return_status: LockerWalletReturnStatusEnum.HAS_RETURNED,
          returned_at: currentTime,
        })
        .where(eq(lockerWallet.wallet_id, wallet.id));

      await tx
        .update(lockers)
        .set({
          status: LockerStatusEnum.AVAILABLE,
        })
        .where(
          inArray(
            lockers.id,
            wallet.lockerWallets
              .map((lockerWallet) => lockerWallet.locker_id)
              .filter((id): id is bigint => id !== null && id !== undefined),
          ),
        );

      await tx
        .update(gazeboWallet)
        .set({
          status: GazeboWalletStatusEnum.CLOSED,
          return_status: GazeboWalletReturnStatusEnum.HAS_RETURNED,
          returned_at: currentTime,
        })
        .where(eq(gazeboWallet.wallet_id, wallet.id));

      await tx
        .update(gazebos)
        .set({
          status: GazeboStatusEnum.AVAILABLE,
        })
        .where(
          inArray(
            gazebos.id,
            wallet.gazeboWallets
              .map((gazeboWallet) => gazeboWallet.gazebo_id)
              .filter((id): id is bigint => id !== null && id !== undefined),
          ),
        );
    });

    return {
      status: "success",
      message: "Berhasil mengembalikan saldo CashQ",
      url: `/cashq-transaction/${wallet.id}/refund-cashq/receipt-saldo-withdraw-only`,
    };
  } catch (error: any) {
    console.error(error);

    return {
      status: "error",
      message: "Gagal mengembalikan saldo CashQ. Terjadi kesalahan pada sistem",
      errors: error,
    };
  }
}
