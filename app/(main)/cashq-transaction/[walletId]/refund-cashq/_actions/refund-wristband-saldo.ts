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
  wristbands,
} from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { GazeboStatusEnum } from "@/lib/enums/GazeboStatusEnum";
import { GazeboWalletReturnStatusEnum } from "@/lib/enums/GazeboWalletReturnStatusEnum";
import { GazeboWalletStatusEnum } from "@/lib/enums/GazeboWalletStatusEnum";
import { LockerStatusEnum } from "@/lib/enums/LockerStatusEnum";
import { LockerWalletReturnStatusEnum } from "@/lib/enums/LockerWalletReturnStatusEnum";
import { LockerWalletStatusEnum } from "@/lib/enums/LockerWalletStatusEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { WalletStatusEnum } from "@/lib/enums/WalletStatusEnum";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { WalletWristbandReturnStatusEnum } from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import storeWalletCashRefund from "@/lib/services/refund-wristband/store-wallet-cash-refund";
import { proccessSalesTransaction } from "@/lib/services/sales/proccess-sales-transaction";
import { getCurrentDate } from "@/lib/utils";
import { getTopUpProduct } from "@/repositories/domain/general/get-top-up-product";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { ServerActionResponse } from "@/types/domains/server-action";
import { and, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function refundWristbandForfeitDepositSaldoForLostOrDamaged({
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

    const { wristbandProduct } = await getWristbandProduct();

    if (!wristbandProduct) throw new Error("Product wristband not found");

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

    const walletWristbandHasReturnedList =
      await db.query.walletWristband.findMany({
        where: and(
          eq(walletWristband.wallet_id, walletId),
          eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
          eq(
            walletWristband.return_status,
            WalletWristbandReturnStatusEnum.HAS_RETURNED,
          ),
          eq(walletWristband.is_deposit_wristband_returned, false),
        ),
      });

    const walletWristbandRentedList = await db.query.walletWristband.findMany({
      where: and(
        eq(walletWristband.wallet_id, walletId),
        eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
        eq(
          walletWristband.return_status,
          WalletWristbandReturnStatusEnum.RENTED,
        ),
        eq(walletWristband.is_deposit_wristband_returned, false),
      ),
    });

    const wristbandLostOrDamagedTotal = walletWristbandRentedList.length;

    const totalForfeit =
      Number(wristbandProduct.price) * wristbandLostOrDamagedTotal;

    const totalDepostWithoutForfeit =
      Number(wallet.deposit_amount) - totalForfeit;

    await db.transaction(async (tx) => {
      if (wristbandLostOrDamagedTotal > 0) {
        await tx
          .update(walletWristband)
          .set({
            status: WalletWristbandStatusEnum.CLOSED,
            return_status: WalletWristbandReturnStatusEnum.NOT_RETURNED,
          })
          .where(
            and(
              eq(walletWristband.wallet_id, wallet.id),
              eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
              eq(
                walletWristband.return_status,
                WalletWristbandReturnStatusEnum.RENTED,
              ),
            ),
          );

        await tx
          .update(wristbands)
          .set({ status: WristbandStatusEnum.LOST_DAMAGED })
          .where(
            inArray(
              wristbands.code,
              walletWristbandRentedList.map(
                ({ wristband_code }) => wristband_code,
              ),
            ),
          );
        const sales = await proccessSalesTransaction({
          salesTemporary: {
            sales_details: [
              {
                product_id: Number(wristbandProduct.id),
                price: Number(wristbandProduct.price),
                qty: wristbandLostOrDamagedTotal,
              },
            ],
          },
          sateliteConfig: SateliteUnitConfig.locker,
          transactionType: SalesTransactionTypeEnum.TICKET_WRISTBAND_FORFEIT,
          tx: tx,
        });
        const salesId = sales.id;

        await tx.insert(walletHistories).values({
          wallet_id: wallet.id,
          sale_id: salesId,
          transaction_type: WalletTransactionTypeEnum.DEPOSIT_FORFEIT,
          prev_saldo: wallet.deposit_amount,
          current_saldo: totalDepostWithoutForfeit.toString(),
          amount: "-" + totalForfeit.toString(),
          created_by: BigInt(user.id),
        });
      }

      const totalWalletWristbandHasReturned =
        walletWristbandHasReturnedList.length;

      const totalDepositRefund =
        totalWalletWristbandHasReturned * Number(wristbandProduct.price);

      const refundDetails = [];

      if (totalWalletWristbandHasReturned > 0) {
        refundDetails.push({
          item_name: wristbandProduct.description,
          item_product_id: wristbandProduct.id,
          item_qty: totalWalletWristbandHasReturned,
          subtotal: totalDepositRefund.toString(),
        });
      }

      refundDetails.push({
        item_name: topUpProduct.description,
        item_product_id: topUpProduct.id,
        item_qty: 1,
        subtotal: wallet.saldo,
      });

      const { walletCashRefundId } = await storeWalletCashRefund({
        totalRefund: (
          totalDepostWithoutForfeit + Number(wallet.saldo)
        ).toString(),
        refundDetails,
        userId: BigInt(user.id),
        tx: tx,
      });

      if (totalWalletWristbandHasReturned > 0) {
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
            ),
          );

        await tx.insert(walletHistories).values({
          wallet_id: wallet.id,
          wallet_cash_refund_id: walletCashRefundId,
          transaction_type: WalletTransactionTypeEnum.DEPOSIT_WITHDRAW,
          prev_saldo: totalDepostWithoutForfeit.toString(),
          current_saldo: "0",
          amount: "-" + totalDepostWithoutForfeit.toString(),
          created_by: BigInt(user.id),
        });
      }

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
        .update(wallets)
        .set({
          deposit_amount: "0",
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
      message:
        "Berhasil melakukan memotong deposit gelang, mengembalikan deposit gelang dan mengembalikan saldo CashQ",
      url: `/cashq-transaction/${wallet.id}/refund-cashq/receipt-lost-or-damaged-wristband`,
    };
  } catch (error: any) {
    console.error(error);

    return {
      status: "error",
      message:
        "Gagal melakukan memotong deposit gelang, mengembalikan deposit gelang dan mengembalikan saldo CashQ. Terjadi kesalahan pada sistem",
      errors: error,
    };
  }
}
