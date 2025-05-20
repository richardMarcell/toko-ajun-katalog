"use server";

import { db } from "@/db";
import {
  bookletUsedPromos,
  walletHistories,
  wallets,
  walletTicketSale,
  walletWristband,
  wristbands,
} from "@/db/schema";
import { salesTicket } from "@/db/schema/sales-ticket";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import getQVoucherValue from "@/lib/services/payments/get-q-voucher-value";
import { storePayment } from "@/lib/services/payments/store-payment";
import { validateMultiplePayments } from "@/lib/services/payments/validate-multiple-payments";
import { can } from "@/lib/services/permissions/can";
import {
  getRecomposeSalesTemporary,
  getSalesTemporaryDiscounted,
  getSalesTemporaryWithTax,
  proccessSalesTransaction,
} from "@/lib/services/sales/proccess-sales-transaction";
import { getCurrentDate } from "@/lib/utils";
import { getValidBooklet } from "@/repositories/domain/general/get-valid-booklet";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { DatabaseTransaction } from "@/types/db-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { SalesTemporary } from "@/types/domains/tickets-booklet-promo/sales/general";
import { User } from "@/types/next-auth";
import { Promo } from "@/types/promo";
import { SalesIncludeRelation } from "@/types/sale";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import authorizePromo from "../../../_libs/authorize-promo";
import { storeSalesValidationSchema } from "./_libs/store-sales-validation-schema";
type ValidatedValues = {
  ticket_sales_temporary: SalesTemporary;
  payments: {
    total_payment: number;
    method: PaymentMethodEnum;
    wristband_code?: string | null;
    cardholder_name?: string | null;
    debit_card_number?: string | null;
    referenced_id?: string | null;
    debit_issuer_bank?: string | null;
    credit_card_number?: string | null;
    qris_issuer?: string | null;
    q_voucher_codes?: string[];
  }[];
  promo_code: string;
  booklet_code?: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeSales(
  preState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    // Authorize user
    await authorizeUser(user);

    // Validate input request
    const validatedValues = await validateRequest(formData);

    // Authorize promo
    const promoCode = validatedValues.promo_code;
    const bookletCode = validatedValues?.booklet_code ?? "";

    const isPromoAuthorized = await authorizePromo(promoCode, bookletCode);
    if (!isPromoAuthorized) {
      return {
        status: "error",
        message:
          "Promo tidak dapat digunakan saat ini. Periksa kembali kode dan ketersediaannya",
      };
    }

    const salesTemporaryToStore = {
      sales_details: validatedValues.ticket_sales_temporary.sales_details.map(
        (detail) => ({
          product_id: detail.product_id,
          price: detail.price,
          qty: detail.qty,
        }),
      ),
    };

    const { wristbandProduct } = await getWristbandProduct();
    const hasWristband =
      validatedValues.ticket_sales_temporary.wristband_qty > 0;

    if (hasWristband && wristbandProduct)
      salesTemporaryToStore.sales_details.push({
        price: Number(wristbandProduct.price),
        product_id: Number(wristbandProduct.id),
        qty: validatedValues.ticket_sales_temporary.wristband_qty,
      });

    const recomposeSalesTemporary = await getRecomposeSalesTemporary(
      salesTemporaryToStore,
    );

    const salesTemporaryDiscounted = await getSalesTemporaryDiscounted(
      recomposeSalesTemporary,
      validatedValues.promo_code,
    );

    const salesTemporaryWithTax = await getSalesTemporaryWithTax(
      salesTemporaryDiscounted,
      SateliteUnitConfig.water_park_ticket.unit_business,
    );

    // Check is payment valid
    const validatedPayment = await validateMultiplePayments({
      grandTotal: salesTemporaryWithTax.grand_total,
      payments: validatedValues.payments,
    });

    if (!validatedPayment.is_valid) {
      return {
        status: "error",
        message: validatedPayment.message,
      };
    }

    let salesId: bigint | null = null;
    await db.transaction(async (tx) => {
      // Store data to table sales
      const sales = await proccessSalesTransaction({
        salesTemporary: salesTemporaryToStore,
        sateliteConfig: SateliteUnitConfig.water_park_ticket,
        transactionType: SalesTransactionTypeEnum.TICKET_SALE,
        tx: tx,
        promoCode: promoCode,
      });
      salesId = sales.id;

      // Store data to table sales ticket
      await tx.insert(salesTicket).values({
        sales_id: salesId,
        customer_name: validatedValues.ticket_sales_temporary.customer_name,
        customer_phone_number:
          validatedValues.ticket_sales_temporary.customer_phone_number,
      });

      if (hasWristband && wristbandProduct) {
        const wristbandQty =
          validatedValues.ticket_sales_temporary.wristband_qty;
        const deposit = Number(wristbandProduct.price);
        const totalDeposit = wristbandQty * deposit;

        // Note: This part is depreceted
        // const walletCashReceiveCreated = await tx
        //   .insert(walletCashReceive)
        //   .values({
        //     grand_total: totalDepositWristband.toString(),
        //     total_payment: totalDepositWristband.toString(),
        //     change_amount: "0",
        //     payment_method: validatedValues.payment_method,
        //     created_by: BigInt(user.id),
        //   })
        //   .$returningId();
        // const walletCashReceiveId = walletCashReceiveCreated[0].id;

        // Store data to wallet table
        const walletId = await storeWallet(validatedValues, totalDeposit, tx);

        // Update data on wristbands table
        await updateWristbandStatusToInUse(validatedValues, tx);

        // Store data to wallet histories table
        const walletHistoryId = await storeWalletHistoryDeposit({
          tx,
          userId: BigInt(user.id),
          totalDeposit,
          wristbandQty,
          salesId: salesId,
          walletId,
        });

        // Store data to wallet wristband table
        await storeWalletWristband(
          walletId,
          walletHistoryId,
          validatedValues,
          tx,
        );

        // Store data to wallet ticket sale
        await tx.insert(walletTicketSale).values({
          wallet_id: walletId,
          ticket_sale_id: salesId as bigint,
        });
      }

      const { promo } = await getValidPromo(promoCode);

      // Store data to booklet used promo table
      await storeBookletUsedPromo({
        promo,
        bookletCode,
        tx,
        userId: BigInt(user.id),
        salesId,
      });

      // Store data to table payments
      await storePaymentData(validatedValues, sales, tx);
    });

    return {
      status: "success",
      message: "Berhasil melakukan pembayaran tiket",
      url: `/tickets-booklet-promo/sales/${Number(salesId)}/receipt`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal melakukan pembayaran tiket. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan pembayaran tiket. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function authorizeUser(user: User) {
  await can({
    permissionNames: [PermissionEnum.TICKET_SALES_STORE],
    user: user,
  });
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeSalesValidationSchema.validate(
    {
      ticket_sales_temporary: JSON.parse(
        formData.get("ticket_sales_temporary") as string,
      ),
      promo_code: formData.get("promo_code"),
      booklet_code: formData.get("booklet_code"),

      payments: JSON.parse(formData.get("payments") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function storeWallet(
  validatedValues: ValidatedValues,
  totalDeposit: number,
  tx: DatabaseTransaction,
): Promise<bigint> {
  const dataWalletToInsert: typeof wallets.$inferInsert = {
    customer_name: validatedValues.ticket_sales_temporary.customer_name,
    customer_phone_number:
      validatedValues.ticket_sales_temporary.customer_phone_number,
    deposit_amount: totalDeposit.toString(),
    saldo: "0",
    deposit_payment_method: validatedValues.payments[0].method,
    code: getCashQCode(),
  };
  const wallet = await tx
    .insert(wallets)
    .values(dataWalletToInsert)
    .$returningId();
  const walletId = wallet[0].id;

  return walletId;
}

async function updateWristbandStatusToInUse(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
): Promise<void> {
  validatedValues.ticket_sales_temporary.wristband_code_list.map(
    async (code) => {
      await tx
        .update(wristbands)
        .set({ status: WristbandStatusEnum.IN_USE })
        .where(eq(wristbands.code, code));
    },
  );
}

async function storeWalletHistoryDeposit({
  tx,
  walletId,
  totalDeposit,
  wristbandQty,
  salesId,
  userId,
}: {
  tx: DatabaseTransaction;
  walletId: bigint;
  totalDeposit: number;
  wristbandQty: number;
  salesId: bigint;
  userId: bigint;
}): Promise<bigint> {
  const walletHistoryCreated = await tx
    .insert(walletHistories)
    .values({
      wallet_id: walletId,
      transaction_type: WalletTransactionTypeEnum.DEPOSIT,
      prev_saldo: "0",
      current_saldo: "0",
      amount: totalDeposit.toString(),
      created_by: userId,
      deposit_wristband_qty: wristbandQty,
      // wallet_cash_receive_id: walletCashReceiveId,
      sale_id: salesId,
    })
    .$returningId();
  const walletHistoryId = walletHistoryCreated[0].id;

  return walletHistoryId;
}

async function storeWalletWristband(
  walletId: bigint,
  walletHistoryId: bigint,
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
): Promise<void> {
  await tx.insert(walletWristband).values(
    validatedValues.ticket_sales_temporary.wristband_code_list.map((code) => ({
      wallet_id: walletId,
      wristband_code: code,
      wallet_history_id: walletHistoryId,
    })),
  );
}

async function storeBookletUsedPromo({
  promo,
  bookletCode,
  tx,
  userId,
  salesId,
}: {
  promo: Promo | null;
  bookletCode: string;
  tx: DatabaseTransaction;
  userId: bigint;
  salesId: bigint;
}): Promise<void> {
  if (promo && promo.is_required_booklet) {
    const { booklet } = await getValidBooklet(bookletCode);

    if (booklet)
      await tx.insert(bookletUsedPromos).values({
        booklet_code: bookletCode,
        booklet_id: booklet.id,
        created_by: userId,
        promo_id: promo.id,
        sales_id: salesId,
      });
  }
}

async function storePaymentData(
  validatedValues: ValidatedValues,
  sales: SalesIncludeRelation,
  tx: DatabaseTransaction,
): Promise<void> {
  let remainingBalance = Number(sales.grand_total);
  for (const payment of validatedValues.payments) {
    const isTunaiTransaction = payment.method === PaymentMethodEnum.TUNAI;

    const changeAmount = isTunaiTransaction
      ? Math.max(0, payment.total_payment - remainingBalance)
      : 0;

    const isQVoucherTransaction =
      payment.method === PaymentMethodEnum.Q_VOUCHER;

    if (isQVoucherTransaction) {
      const voucherList = getQVoucherValue(payment.q_voucher_codes);
      const totalVoucherValue = voucherList.reduce(
        (sum, voucher) => sum + voucher.value,
        0,
      );
      remainingBalance -= totalVoucherValue;
    } else remainingBalance -= payment.total_payment;

    await storePayment({
      salesId: sales.id,
      tx,
      paymentSummary: {
        change_amount: changeAmount,
        total_payment: payment.total_payment,
        payment_method: payment.method as PaymentMethodEnum,
        debit_card_number: payment.debit_card_number,
        cardholder_name: payment.cardholder_name,
        referenced_id: payment.referenced_id,
        debit_issuer_bank: payment.debit_issuer_bank,
        wristband_code: payment.wristband_code,
        wallet_transaction_type: WalletTransactionTypeEnum.FOOD_CORNER_SALE,
        credit_card_number: payment.credit_card_number,
        qris_issuer: payment.qris_issuer,
        q_voucher_codes: payment.q_voucher_codes,
      },
    });
  }
}

function getCashQCode(): string {
  const today = getCurrentDate().toISOString().split("T")[0];
  const timestampt = Date.now();
  const cashQCode = `CHQ/${today}/${timestampt}`;

  return cashQCode;
}
