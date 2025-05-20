"use server";

import { db } from "@/db";
import {
  gazebos,
  gazeboWallet,
  lockers,
  lockerWallet,
  sales,
  salesDetails,
  stockSwimsuitRent,
  swimsuitRentWallet,
  walletHistories,
  wallets,
  walletWristband,
  wristbands,
} from "@/db/schema";
import { GazeboStatusEnum } from "@/lib/enums/GazeboStatusEnum";
import { GazeboWalletReturnStatusEnum } from "@/lib/enums/GazeboWalletReturnStatusEnum";
import { GazeboWalletStatusEnum } from "@/lib/enums/GazeboWalletStatusEnum";
import { LockerStatusEnum } from "@/lib/enums/LockerStatusEnum";
import { LockerWalletReturnStatusEnum } from "@/lib/enums/LockerWalletReturnStatusEnum";
import { LockerWalletStatusEnum } from "@/lib/enums/LockerWalletStatusEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { SwimsuitRentReturnStatusEnum } from "@/lib/enums/SwimsuitRentReturnStatusEnum";
import { WalletStatusEnum } from "@/lib/enums/WalletStatusEnum";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { WalletWristbandReturnStatusEnum } from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { markAsVoid } from "@/lib/services/sales/mark-as-void";
import returnStok from "@/lib/services/sales/return-stok";
import { createYupValidationError, getCurrentDate } from "@/lib/utils";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { DatabaseTransaction } from "@/types/db-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";

const cashQTransactionVoidValidationSchema = yup.object({
  sale_id: yup
    .number()
    .required("Sale ID wajib diisi")
    .typeError("Sale ID wajib diisi dengan karakter yang valid"),
  // TODO: pastikan kode akses user tersedia
  access_code: yup
    .string()
    .required("Kode akses user wajib diisi")
    .typeError("Kode akses user wajib diisi dengan karakter yang valid"),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function voidTransactions(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [PermissionEnum.SALES_VOID],
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized) throw new Error("User haven't permission");

    const validatedValues = await cashQTransactionVoidValidationSchema.validate(
      {
        sale_id: formData.get("sale_id") as string,
        access_code: formData.get("access_code") as string,
      },
      {
        abortEarly: false,
      },
    );

    const isUserAccessCodeValid = true;

    if (!isUserAccessCodeValid) {
      const validationError = createYupValidationError(
        "access_code",
        validatedValues.access_code,
        "User tidak memiliki akses untuk melakukan proses ini",
      );
      throw validationError;
    }

    const saleId = BigInt(validatedValues.sale_id);

    const sale = await db.query.sales.findFirst({
      where: eq(sales.id, saleId),
    });

    if (!sale) throw new Error("Sale not found");

    const salesDetailList = await db.query.salesDetails.findMany({
      columns: {
        product_id: true,
        warehouse_id: true,
        qty: true,
      },
      with: { product: { columns: { stock_type: true } } },
      where: eq(salesDetails.sales_id, saleId),
    });

    await db.transaction(async (tx) => {
      // Flag the sales is voided
      await markAsVoid({
        salesId: sale.id,
        userId: BigInt(user.id),
        tx: tx,
      });

      // TODO: implement void for transaction type:
      // ENTRY_PASS
      // SWIMMING_CLASS

      // Return stock
      if (sale.transaction_type === SalesTransactionTypeEnum.TICKET_SALE) {
        // TODO: handle to return used promo booklet
        const { wristbandProduct } = await getWristbandProduct();

        if (!wristbandProduct) throw new Error("Wristband Product not found");

        if (
          salesDetailList.some(
            (item) => item.product_id === wristbandProduct.id,
          )
        ) {
          await returnStockWristband({
            saleId: sale.id,
            userId: BigInt(user.id),
            tx: tx,
          });
        }
      } else if (
        sale.transaction_type === SalesTransactionTypeEnum.WRISTBAND_RENT
      ) {
        await returnStockWristband({
          saleId: sale.id,
          userId: BigInt(user.id),
          tx: tx,
        });
      } else if (
        sale.transaction_type === SalesTransactionTypeEnum.BINDING_CASHQ
      ) {
        await returnStockWristband({
          saleId: sale.id,
          userId: BigInt(user.id),
          tx: tx,
        });
      } else if (
        sale.transaction_type === SalesTransactionTypeEnum.LOCKER_RENT
      ) {
        await returnStockLocker({
          saleId: sale.id,
          userId: BigInt(user.id),
          tx: tx,
        });
      } else if (
        sale.transaction_type === SalesTransactionTypeEnum.GAZEBO_RENT
      ) {
        await returnStockGazebo({
          saleId: sale.id,
          userId: BigInt(user.id),
          tx: tx,
        });
      } else if (
        sale.transaction_type === SalesTransactionTypeEnum.SWIMSUIT_RENT
      ) {
        await returnStockSwimsuit({
          saleId: sale.id,
          userId: BigInt(user.id),
          tx: tx,
        });
      } else if (sale.transaction_type === SalesTransactionTypeEnum.TOP_UP) {
        returnStockTopUp({ saleId: sale.id, userId: BigInt(user.id), tx: tx });
      } else {
        salesDetailList.map(
          async (salesDetail) =>
            await returnStok({
              warehouseId: salesDetail.warehouse_id,
              productId: salesDetail.product_id,
              stock_type: salesDetail.product.stock_type,
              qty: salesDetail.qty,
              tx: tx,
            }),
        );
      }
    });

    return {
      status: "success",
      message: "Berhasil melakukan void",
      url: `/sales`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      if (error.hasOwnProperty("cause")) {
        return {
          status: "error",
          message: error["cause"],
        };
      }

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
        "Gagal melakukan void. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function returnStockWristband({
  saleId,
  userId,
  tx,
}: {
  saleId: bigint;
  userId: bigint;
  tx: DatabaseTransaction;
}): Promise<void> {
  const walletHistoryTransactionTypeDeposit =
    await tx.query.walletHistories.findFirst({
      columns: {
        wallet_id: true,
        amount: true,
      },
      with: {
        walletWristbands: {
          columns: {
            id: true,
            wristband_code: true,
          },
        },
      },
      where: and(
        eq(walletHistories.sale_id, saleId),
        eq(walletHistories.transaction_type, WalletTransactionTypeEnum.DEPOSIT),
      ),
    });

  if (!walletHistoryTransactionTypeDeposit)
    throw new Error("Wallet history not found");

  const currentTime = getCurrentDate();

  await tx
    .update(walletHistories)
    .set({
      is_void: true,
      voided_by: userId,
      voided_at: currentTime,
    })
    .where(and(eq(walletHistories.sale_id, saleId)));

  // Return wristband and change status wristband
  walletHistoryTransactionTypeDeposit.walletWristbands.map(
    async (wristbandRent) => {
      await tx
        .update(walletWristband)
        .set({
          status: WalletWristbandStatusEnum.CLOSED,
          return_status: WalletWristbandReturnStatusEnum.HAS_RETURNED,
          returned_at: currentTime,
          is_deposit_wristband_returned: true,
          deposit_wristband_returned_by: userId,
          deposit_wristband_returned_at: currentTime,
        })
        .where(
          and(
            eq(walletWristband.wristband_code, wristbandRent.wristband_code),
            eq(walletWristband.id, wristbandRent.id),
          ),
        );

      await tx
        .update(wristbands)
        .set({ status: WristbandStatusEnum.AVAILABLE })
        .where(eq(wristbands.code, wristbandRent.wristband_code));
    },
  );

  const walletId = walletHistoryTransactionTypeDeposit.wallet_id;

  await tx
    .update(wallets)
    .set({
      deposit_amount: sql`${wallets.deposit_amount} - ${walletHistoryTransactionTypeDeposit.amount}`,
    })
    .where(eq(wallets.id, walletId));

  const walletWristbandList = await tx.query.walletWristband.findMany({
    where: and(
      eq(walletWristband.wallet_id, walletId),
      eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
    ),
  });

  // Change status wallet to closed
  if (walletWristbandList.length === 0) {
    const walletHistoriesList = await db
      .select({
        sale_id: walletHistories.sale_id,
      })
      .from(walletHistories)
      .where(
        and(
          eq(
            walletHistories.wallet_id,
            walletHistoryTransactionTypeDeposit.wallet_id,
          ),
          eq(walletHistories.is_void, false),
        ),
      )
      .groupBy(walletHistories.sale_id);

    if (walletHistoriesList.length > 1)
      throw new Error("Wallet has other transactions not yet voided", {
        cause:
          "Gagal melakukan void pada transaksi ini karena masih terdapat transaksi lain yang belum di-void",
      });

    await tx
      .update(wallets)
      .set({
        deposit_amount: "0",
        saldo: "0",
        status: WalletStatusEnum.CLOSED,
      })
      .where(eq(wallets.id, walletId));
  }
}

async function returnStockLocker({
  saleId,
  userId,
  tx,
}: {
  saleId: bigint;
  userId: bigint;
  tx: DatabaseTransaction;
}): Promise<void> {
  const walletHistory = await tx.query.walletHistories.findFirst({
    columns: {
      wallet_id: true,
      amount: true,
    },
    with: {
      lockerWallets: {
        columns: {
          id: true,
          locker_id: true,
        },
      },
    },
    where: and(
      eq(walletHistories.sale_id, saleId),
      eq(
        walletHistories.transaction_type,
        WalletTransactionTypeEnum.LOCKER_RENT,
      ),
    ),
  });

  if (!walletHistory) throw new Error("Wallet history not found");

  const currentTime = getCurrentDate();

  await tx
    .update(walletHistories)
    .set({
      is_void: true,
      voided_by: userId,
      voided_at: currentTime,
    })
    .where(and(eq(walletHistories.sale_id, saleId)));

  // Return locker wallet and change status lokcer
  walletHistory.lockerWallets.map(async (lockerRent) => {
    await tx
      .update(lockerWallet)
      .set({
        status: LockerWalletStatusEnum.CLOSED,
        return_status: LockerWalletReturnStatusEnum.HAS_RETURNED,
        returned_at: currentTime,
      })
      .where(eq(lockerWallet.id, lockerRent.id));

    if (lockerRent.locker_id) {
      await tx
        .update(lockers)
        .set({ status: LockerStatusEnum.AVAILABLE })
        .where(eq(lockers.id, lockerRent.locker_id));
    }
  });

  const walletId = walletHistory.wallet_id;

  await tx
    .update(wallets)
    .set({
      // NOTE: cause the wallet history amount stored with negative value
      saldo: sql`${wallets.saldo} + ${Math.abs(Number(walletHistory.amount))}`,
    })
    .where(eq(wallets.id, walletId));
}

async function returnStockGazebo({
  saleId,
  userId,
  tx,
}: {
  saleId: bigint;
  userId: bigint;
  tx: DatabaseTransaction;
}): Promise<void> {
  const walletHistory = await tx.query.walletHistories.findFirst({
    columns: {
      wallet_id: true,
      amount: true,
    },
    with: {
      gazeboWallets: {
        columns: {
          id: true,
          gazebo_id: true,
        },
      },
    },
    where: and(
      eq(walletHistories.sale_id, saleId),
      eq(
        walletHistories.transaction_type,
        WalletTransactionTypeEnum.GAZEBO_RENT,
      ),
    ),
  });

  if (!walletHistory) throw new Error("Wallet history not found");

  const currentTime = getCurrentDate();

  await tx
    .update(walletHistories)
    .set({
      is_void: true,
      voided_by: userId,
      voided_at: currentTime,
    })
    .where(and(eq(walletHistories.sale_id, saleId)));

  // Return gazebo wallet and change status gazebo
  walletHistory.gazeboWallets.map(async (gazeboRent) => {
    await tx
      .update(gazeboWallet)
      .set({
        status: GazeboWalletStatusEnum.CLOSED,
        return_status: GazeboWalletReturnStatusEnum.HAS_RETURNED,
        returned_at: currentTime,
      })
      .where(eq(gazeboWallet.id, gazeboRent.id));

    if (gazeboRent.gazebo_id) {
      await tx
        .update(gazebos)
        .set({ status: GazeboStatusEnum.AVAILABLE })
        .where(eq(gazebos.id, gazeboRent.gazebo_id));
    }
  });

  const walletId = walletHistory.wallet_id;

  await tx
    .update(wallets)
    .set({
      // NOTE: cause the wallet history amount stored with negative value
      saldo: sql`${wallets.saldo} + ${Math.abs(Number(walletHistory.amount))}`,
    })
    .where(eq(wallets.id, walletId));
}

async function returnStockTopUp({
  saleId,
  userId,
  tx,
}: {
  saleId: bigint;
  userId: bigint;
  tx: DatabaseTransaction;
}): Promise<void> {
  const walletHistory = await tx.query.walletHistories.findFirst({
    columns: {
      wallet_id: true,
      amount: true,
    },
    where: and(
      eq(walletHistories.sale_id, saleId),
      eq(walletHistories.transaction_type, WalletTransactionTypeEnum.TOP_UP),
    ),
  });

  if (!walletHistory) throw new Error("Wallet history not found");

  const currentTime = getCurrentDate();

  await tx
    .update(walletHistories)
    .set({
      is_void: true,
      voided_by: userId,
      voided_at: currentTime,
    })
    .where(and(eq(walletHistories.sale_id, saleId)));

  const walletId = walletHistory.wallet_id;

  await tx
    .update(wallets)
    .set({
      // NOTE: cause the wallet history amount stored with negative value
      saldo: sql`${wallets.saldo} - ${Math.abs(Number(walletHistory.amount))}`,
    })
    .where(eq(wallets.id, walletId));
}

async function returnStockSwimsuit({
  saleId,
  userId,
  tx,
}: {
  saleId: bigint;
  userId: bigint;
  tx: DatabaseTransaction;
}): Promise<void> {
  const walletHistory = await tx.query.walletHistories.findFirst({
    columns: {
      wallet_id: true,
      amount: true,
    },
    where: and(
      eq(walletHistories.sale_id, saleId),
      eq(
        walletHistories.transaction_type,
        WalletTransactionTypeEnum.SWIMSUIT_RENT,
      ),
    ),
  });

  if (!walletHistory) throw new Error("Wallet history not found");

  const saleDetailList = await tx.query.salesDetails.findMany({
    columns: {
      id: true,
      product_id: true,
      qty: true,
    },
    where: eq(salesDetails.sales_id, saleId),
  });

  const currentTime = getCurrentDate();

  await tx
    .update(walletHistories)
    .set({
      is_void: true,
      voided_by: userId,
      voided_at: currentTime,
    })
    .where(and(eq(walletHistories.sale_id, saleId)));

  // Return swimsuit and add stock of swimsuit rent
  saleDetailList.map(async (saleDetail) => {
    await tx
      .update(swimsuitRentWallet)
      .set({
        return_status: SwimsuitRentReturnStatusEnum.HAS_RETURNED,
        returned_at: currentTime,
      })
      .where(eq(swimsuitRentWallet.sales_detail_id, saleDetail.id));

    await tx
      .update(stockSwimsuitRent)
      .set({
        qty: sql`${stockSwimsuitRent.qty} + ${saleDetail.qty}`,
      })
      .where(eq(stockSwimsuitRent.product_id, saleDetail.product_id));
  });

  const walletId = walletHistory.wallet_id;

  await tx
    .update(wallets)
    .set({
      // NOTE: cause the wallet history amount stored with negative value
      saldo: sql`${wallets.saldo} + ${Math.abs(Number(walletHistory.amount))}`,
    })
    .where(eq(wallets.id, walletId));
}
