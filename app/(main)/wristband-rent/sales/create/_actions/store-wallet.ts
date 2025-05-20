"use server";

import { db } from "@/db";
import {
  walletHistories,
  wallets,
  walletWristband,
  wristbands,
} from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { isCashQStoreToSalesTable } from "@/lib/helper";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { storePayment } from "@/lib/services/payments/store-payment";
import { can } from "@/lib/services/permissions/can";
import { proccessSalesTransaction } from "@/lib/services/sales/proccess-sales-transaction";
import { getCurrentDate } from "@/lib/utils";
import { getTopUpProduct } from "@/repositories/domain/general/get-top-up-product";
import { getWristbandProduct } from "@/repositories/domain/general/get-wristband-product";
import { DatabaseTransaction } from "@/types/db-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { SalesIncludeRelation } from "@/types/sale";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeSalesValidationSchema } from "./_libs/store-sales-validation-schema";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import { validateMultiplePayments } from "@/lib/services/payments/validate-multiple-payments";
import getQVoucherValue from "@/lib/services/payments/get-q-voucher-value";

type ValidatedValues = {
  wristband_rent: {
    saldo?: number | null;
    quantity: number;
    customer_name: string;
    customer_phone_number: string;
    wristband_rent_code: string[];
  };
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
};

type SalesTemporary = {
  sales_details: {
    product_id: number;
    qty: number;
    price: number;
  }[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function storeWallet(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const permissionNames = [PermissionEnum.WRISTBAND_RENT_WALLET_STORE];
    const isAuthorized = await can({
      permissionNames: permissionNames,
      user: user,
    });

    if (!isAuthorized)
      throw new PermissionDeniedError({
        userId: user.id,
        userName: user.name,
        deniedPermissions: permissionNames.toString(),
      });

    // let walletCashReceiveId: bigint | null = null;
    let salesId: bigint | null = null;
    const validatedValues = await validateRequest(formData);
    const isCashQStoreToSales = isCashQStoreToSalesTable();
    const { wristbandProduct } = await getWristbandProduct();
    const { topUpProduct } = await getTopUpProduct();

    const deposit = wristbandProduct ? Number(wristbandProduct.price) : 0;

    const totalDeposit = deposit * validatedValues.wristband_rent.quantity;
    const totalTopUpSaldo = validatedValues.wristband_rent.saldo ?? 0;
    const grandTotal = totalDeposit + totalTopUpSaldo;

    const validatedPayment = await validateMultiplePayments({
      grandTotal: grandTotal,
      payments: validatedValues.payments,
    });

    if (!validatedPayment.is_valid) {
      return {
        status: "error",
        message: validatedPayment.message,
      };
    }

    await db.transaction(async (tx) => {
      // Store Data Wallet
      const walletId = await storeWalletData(
        validatedValues,
        totalDeposit,
        totalTopUpSaldo,
        tx,
      );

      // Store Data Wallet Cash Receive
      // const walletCashReceiveIdStored = await storeWalletCashReceive(
      //   validatedValues,
      //   tx,
      //   grandTotal,
      //   BigInt(user.id),
      // );
      // walletCashReceiveId = walletCashReceiveIdStored;

      if (isCashQStoreToSales) {
        const salesTemporary: SalesTemporary = {
          sales_details: [],
        };

        if (wristbandProduct) {
          salesTemporary.sales_details.push({
            product_id: Number(wristbandProduct.id),
            qty: validatedValues.wristband_rent.quantity,
            price: deposit,
          });
        }

        if (topUpProduct && totalTopUpSaldo > 0) {
          salesTemporary.sales_details.push({
            product_id: Number(topUpProduct.id),
            qty: 1,
            price: totalTopUpSaldo,
          });
        }

        const sales = await proccessSalesTransaction({
          salesTemporary: salesTemporary,
          sateliteConfig: SateliteUnitConfig.locker,
          transactionType: SalesTransactionTypeEnum.WRISTBAND_RENT,
          tx: tx,
        });
        salesId = sales.id;

        // Store data to table payments
        await storePaymentData(validatedValues, sales, tx);
      }

      // Store wallet history deposit
      await storeWalletHistoryDeposit({
        salesId: salesId as bigint,
        totalDeposit,
        tx,
        userId: BigInt(user.id),
        validatedValues,
        walletId,
      });

      // Store wallet history top up
      if (totalTopUpSaldo > 0) {
        await storeWalletHistoryTopUp({
          salesId: salesId as bigint,
          totalTopUpSaldo,
          tx,
          userId: BigInt(user.id),
          walletId,
        });
      }
    });

    return {
      status: "success",
      message: "Berhasil melakukan pembayaran",
      url: `/wristband-rent/sales/${salesId}/receipt`,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof PermissionDeniedError) {
      return {
        status: "error",
        message:
          "Gagal melakukan pembayaran. User tidak memiliki izin untuk melakukan tindakan ini",
      };
    }

    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message: "Gagal melakukan pembayaran. Terjadi kesalahan pada sistem",
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
        "Gagal melakukan pembayaran. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storeSalesValidationSchema.validate(
    {
      wristband_rent: JSON.parse(formData.get("wristband_rent") as string),

      payments: JSON.parse(formData.get("payments") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function storeWalletData(
  validatedValues: ValidatedValues,
  totalDeposit: number,
  totalTopUpSaldo: number,
  tx: DatabaseTransaction,
): Promise<bigint> {
  const dataWalletToInsert: typeof wallets.$inferInsert = {
    customer_name: validatedValues.wristband_rent.customer_name,
    customer_phone_number: validatedValues.wristband_rent.customer_phone_number,
    deposit_amount: totalDeposit.toString(),
    saldo: totalTopUpSaldo.toString(),
    // NOTE: deprecated - check before remove the column
    deposit_payment_method: validatedValues.payments[0].method,
    code: getCashQCode(),
  };

  // change status wristband to in use
  validatedValues.wristband_rent.wristband_rent_code.map(async (code) => {
    await tx
      .update(wristbands)
      .set({ status: WristbandStatusEnum.IN_USE })
      .where(eq(wristbands.code, code));
  });

  const wallet = await tx
    .insert(wallets)
    .values(dataWalletToInsert)
    .$returningId();

  const walletId = wallet[0].id;

  return walletId;
}

function getCashQCode(): string {
  const today = getCurrentDate().toISOString().split("T")[0];
  const timestampt = Date.now();
  const cashQCode = `CHQ/${today}/${timestampt}`;

  return cashQCode;
}

// async function storeWalletCashReceive(
//   validatedValues: ValidatedValues,
//   tx: DatabaseTransaction,
//   grandTotal: number,
//   userId: bigint,
// ): Promise<bigint> {
//   const paymentMethod = validatedValues.payment_method;
//   const isTunaiTransaction =
//     validatedValues.payment_method === PaymentMethodEnum.TUNAI;
//   const totalPayment = isTunaiTransaction
//     ? validatedValues.total_payment
//     : grandTotal;
//   const changeAmount = isTunaiTransaction
//     ? validatedValues.total_payment - grandTotal
//     : 0;

//   const walletCashReceiveCreated = await tx
//     .insert(walletCashReceive)
//     .values({
//       grand_total: grandTotal.toString(),
//       total_payment: totalPayment.toString(),
//       change_amount: changeAmount.toString(),
//       created_by: userId,
//       payment_method: paymentMethod,
//     })
//     .$returningId();

//   const walletCashReceiveId = walletCashReceiveCreated[0].id;

//   return walletCashReceiveId;
// }

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
        wallet_transaction_type: WalletTransactionTypeEnum.WRISTBAND_RENT,
        credit_card_number: payment.credit_card_number,
        qris_issuer: payment.qris_issuer,
        q_voucher_codes: payment.q_voucher_codes,
      },
    });
  }
}

async function storeWalletHistoryDeposit({
  walletId,
  totalDeposit,
  userId,
  validatedValues,
  salesId,
  tx,
}: {
  walletId: bigint;
  totalDeposit: number;
  userId: bigint;
  validatedValues: ValidatedValues;
  salesId: bigint;
  tx: DatabaseTransaction;
}): Promise<void> {
  const walletHistoryCreated = await tx
    .insert(walletHistories)
    .values({
      wallet_id: walletId,
      transaction_type: WalletTransactionTypeEnum.DEPOSIT,
      prev_saldo: "0",
      current_saldo: "0",
      amount: totalDeposit.toString(),
      created_by: userId,
      deposit_wristband_qty: validatedValues.wristband_rent.quantity,
      sale_id: salesId,
    })
    .$returningId();

  const walletHistoryId = walletHistoryCreated[0].id;

  await storeWalletWristband({
    walletId,
    walletHistoryId,
    wristbandCodeList: validatedValues.wristband_rent.wristband_rent_code,
    tx,
  });
}

async function storeWalletWristband({
  walletId,
  walletHistoryId,
  wristbandCodeList,
  tx,
}: {
  walletId: bigint;
  walletHistoryId: bigint;
  wristbandCodeList: string[];
  tx: DatabaseTransaction;
}): Promise<void> {
  await tx.insert(walletWristband).values(
    wristbandCodeList.map((code) => ({
      wallet_id: walletId,
      wristband_code: code,
      wallet_history_id: walletHistoryId,
    })),
  );
}

async function storeWalletHistoryTopUp({
  walletId,
  totalTopUpSaldo,
  userId,
  salesId,
  tx,
}: {
  walletId: bigint;
  totalTopUpSaldo: number;
  userId: bigint;
  salesId: bigint;
  tx: DatabaseTransaction;
}): Promise<void> {
  await tx.insert(walletHistories).values({
    wallet_id: walletId,
    transaction_type: WalletTransactionTypeEnum.TOP_UP,
    prev_saldo: "0",
    current_saldo: totalTopUpSaldo.toString(),
    amount: totalTopUpSaldo.toString(),
    created_by: userId,
    sale_id: salesId,
  });
}
