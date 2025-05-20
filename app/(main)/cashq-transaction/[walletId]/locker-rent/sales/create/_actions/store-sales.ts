"use server";
import { db } from "@/db";
import { bookletUsedPromos, lockerWallet, wallets } from "@/db/schema";
import { salesLockerRent } from "@/db/schema/sales-locker-rent";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { getLockerTypeWithProductCode } from "@/lib/enums/LockerTypeEnum";
import { LockerWalletPaymentStatusEnum } from "@/lib/enums/LockerWalletPaymentStatusEnum";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesLockerRentPromoTypeEnum } from "@/lib/enums/SalesLockerPromoTypeEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { WalletStatusEnum } from "@/lib/enums/WalletStatusEnum";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { storePayment } from "@/lib/services/payments/store-payment";
import { validatePayment } from "@/lib/services/payments/validate-payment";
import { can } from "@/lib/services/permissions/can";
import {
  getRecomposeSalesTemporary,
  getSalesTemporaryDiscounted,
  getSalesTemporaryWithTax,
  proccessSalesTransaction,
} from "@/lib/services/sales/proccess-sales-transaction";
import { getValidBooklet } from "@/repositories/domain/general/get-valid-booklet";
import { getValidBookletPromo } from "@/repositories/domain/general/get-valid-booklet-promo";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import { Booklet } from "@/types/booklet";

import { ServerActionResponse } from "@/types/domains/server-action";
import { Promo } from "@/types/promo";
import { and, count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";

const storeSalesValidationSchema = yup.object({
  wallet_id: yup
    .number()
    .required("Wallet ID wajib diisi")
    .typeError("Wallet ID wajib diisi dengan karakter yang valid"),
  locker_type_id: yup
    .number()
    .required("Tipe loker diisi")
    .typeError("Tipe loker diisi dengan karakter yang valid"),
  locker_type_name: yup
    .string()
    .required("Nama tipe loker diisi")
    .typeError("Nama tipe loker diisi dengan karakter yang valid"),
  locker_price: yup
    .number()
    .required("Harga tipe loker diisi")
    .typeError("Harga tipe loker diisi dengan karakter yang valid"),
  promo_type: yup
    .string()
    .required("Promo wajib diisi")
    .typeError("Promo wajib diisi dengan karakter yang valid"),
  promo_code: yup
    .string()
    .when("promo_type", {
      is: SalesLockerRentPromoTypeEnum.PROMO,
      then: (schema) => schema.required("Kode promo wajib diisi"),
      otherwise: (schema) => schema.notRequired(),
    })
    .test(
      "is-promo-code-exists",
      "Kode promo yang dimasukkan tidak valid atau sudah tidak berlaku, silahkan masukkan kode promo yang lain",
      async function (promoCode) {
        if (!promoCode) return true;

        const { promo } = await getValidPromo(promoCode);

        if (!promo) return false;

        return true;
      },
    )
    .typeError("Kode promo wajib diisi dengan karakter yang valid"),
  booklet_code: yup
    .string()
    .when("promo_type", {
      is: SalesLockerRentPromoTypeEnum.BOOKLET,
      then: (schema) => schema.required("Kode booklet wajib diisi"),
      otherwise: (schema) => schema.notRequired(),
    })
    .typeError("Kode booklet wajib diisi dengan karakter yang valid"),
  booklet_promo_code: yup
    .string()
    .when("promo_type", {
      is: SalesLockerRentPromoTypeEnum.BOOKLET,
      then: (schema) => schema.required("Kode promo booklet wajib diisi"),
      otherwise: (schema) => schema.notRequired(),
    })
    .typeError("Kode promo booklet wajib diisi dengan karakter yang valid"),
  total_gross: yup
    .number()
    .typeError("Total penjualan kotor wajib diisi dengan angka yang valid")
    .required("Total penjualan kotor wajib diisi"),
});

export type SalesDetailRequest = {
  product_id: number;
  qty: number;
};

export type SalesDetail = {
  product_id: number;
  code: string;
  name: string;
  price: number;
  description: string;
  qty: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeSales(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_STORE],
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized) throw new Error("User haven't permission");

    const walletId = formData.get("wallet_id") as string;
    const validatedValues = await storeSalesValidationSchema.validate(
      {
        wallet_id: walletId,
        locker_type_id: formData.get("locker_type_id"),
        locker_type_name: formData.get("locker_type_name"),
        locker_price: formData.get("locker_price"),
        promo_type: formData.get("promo_type"),
        promo_code: formData.get("promo_code"),
        booklet_code: formData.get("booklet_code"),
        booklet_promo_code: formData.get("booklet_promo_code"),
        total_gross: formData.get("total_gross"),
      },
      {
        abortEarly: false,
      },
    );

    const bookletPromoCode = validatedValues.booklet_promo_code ?? "";
    const bookletCode = validatedValues?.booklet_code ?? "";

    let promoCode: string | undefined = "";
    if (validatedValues.promo_type === SalesLockerRentPromoTypeEnum.PROMO)
      promoCode = validatedValues.promo_code;
    else if (
      validatedValues.promo_type === SalesLockerRentPromoTypeEnum.BOOKLET
    ) {
      const isPromoAuthorized = await authorizePromo(
        bookletPromoCode,
        bookletCode,
      );
      if (!isPromoAuthorized) {
        return {
          status: "error",
          message:
            "Promo tidak dapat digunakan saat ini. Periksa kembali kode dan ketersediaannya",
        };
      }

      promoCode = validatedValues.booklet_promo_code;
    }

    // NOTE: now just accept payment method CashQ
    const wallet = await db.query.wallets.findFirst({
      where: and(
        eq(wallets.id, BigInt(validatedValues.wallet_id)),
        eq(wallets.status, WalletStatusEnum.OPEN),
      ),
      with: {
        walletWristbands: true,
      },
    });

    if (!wallet) {
      const validationError = new yup.ValidationError([], validatedValues, "");
      validationError.inner.push(
        new yup.ValidationError(
          "CashQ tidak ditemukan",
          validatedValues.wallet_id,
          "wallet",
        ),
      );
      throw validationError;
    }

    // Recompose sales data by retrieving the latest product prices and tax requirements from the database
    const recomposeSalesTemporary = await getRecomposeSalesTemporary({
      sales_details: [
        {
          price: validatedValues.locker_price,
          product_id: validatedValues.locker_type_id,
          qty: 1,
        },
      ],
    });

    // Apply promo (if any) to the recomposed sales data
    const salesTemporaryDiscounted = await getSalesTemporaryDiscounted(
      recomposeSalesTemporary,
      promoCode,
    );

    // Add tax calculations to the discounted sales data based on the business unit's tax configuration
    const salesTemporaryWithTax = await getSalesTemporaryWithTax(
      salesTemporaryDiscounted,
      SateliteUnitConfig.locker.unit_business,
    );

    const validatedPayment = await validatePayment({
      grandTotal: salesTemporaryWithTax.grand_total,
      paymentMethod: PaymentMethodEnum.CASH_Q,
      totalPayment: 0,
      wristbandCode: wallet.walletWristbands[0].wristband_code,
    });

    if (!validatedPayment.is_valid) {
      return {
        status: "error",
        message: validatedPayment.message,
      };
    }

    let salesId: bigint | null = null;
    await db.transaction(async (tx) => {
      const sales = await proccessSalesTransaction({
        salesTemporary: {
          sales_details: [
            {
              price: validatedValues.locker_price,
              product_id: validatedValues.locker_type_id,
              qty: 1,
            },
          ],
        },
        sateliteConfig: SateliteUnitConfig.locker,
        transactionType: SalesTransactionTypeEnum.LOCKER_RENT,
        tx: tx,
        promoCode: promoCode,
      });
      salesId = sales.id;

      await tx.insert(salesLockerRent).values({
        sales_id: salesId,
        promo_type: validatedValues.promo_type,
      });

      // Store data to booklet used promo table
      if (validatedValues.promo_type === SalesLockerRentPromoTypeEnum.BOOKLET) {
        const { promo } = await getValidPromo(promoCode ?? "");
        if (promo && promo.is_required_booklet) {
          const { booklet } = await getValidBooklet(bookletCode);

          if (booklet)
            await tx.insert(bookletUsedPromos).values({
              booklet_code: bookletCode,
              booklet_id: booklet.id,
              created_by: BigInt(user.id),
              promo_id: promo.id,
              sales_id: salesId,
            });
        }
      }

      // Store data to table payments
      const { walletHistoryId } = await storePayment({
        salesId: salesId,
        tx: tx,
        paymentSummary: {
          change_amount: 0,
          total_payment: Number(sales.grand_total),
          payment_method: PaymentMethodEnum.CASH_Q,
          wristband_code: wallet.walletWristbands[0].wristband_code,
          wallet_transaction_type: WalletTransactionTypeEnum.LOCKER_RENT,
        },
      });

      await tx.insert(lockerWallet).values({
        wallet_id: BigInt(validatedValues.wallet_id),
        wallet_history_id: walletHistoryId!,
        type: getLockerTypeWithProductCode(sales.salesDetails[0].product.code),
        payment_status: LockerWalletPaymentStatusEnum.PAID,
        created_by: BigInt(user.id),
      });
    });

    return {
      status: "success",
      message: "Berhasil menyimpan data Top-Up CashQ",
      url: `/cashq-transaction/${walletId}/locker-rent/sales/${salesId}/receipt`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data Top-Up CashQ. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data Top-Up CashQ. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function authorizePromo(
  promoCode: string,
  bookletCode: string,
): Promise<boolean> {
  const { promo } = await getValidPromo(promoCode);
  if (!promo) return false;

  if (promo.is_required_booklet) {
    const { booklet } = await getValidBooklet(bookletCode);
    if (!booklet) return false;

    const { bookletPromo } = await getValidBookletPromo(booklet, promo);
    if (!bookletPromo) return false;

    const totalBookletUsedPromo = await getTotalBookletUsedPromo(
      bookletCode,
      booklet,
      promo,
    );

    if (totalBookletUsedPromo >= bookletPromo.qty) return false;
  }

  return true;
}

async function getTotalBookletUsedPromo(
  bookletCode: string,
  booklet: Booklet,
  promo: Promo,
): Promise<number> {
  const totalBookletUsedPromo = await db
    .select({
      count: count(),
    })
    .from(bookletUsedPromos)
    .where(
      and(
        eq(bookletUsedPromos.booklet_code, bookletCode),
        eq(bookletUsedPromos.promo_id, promo.id),
        eq(bookletUsedPromos.booklet_id, booklet.id),
      ),
    );

  return totalBookletUsedPromo[0].count;
}
