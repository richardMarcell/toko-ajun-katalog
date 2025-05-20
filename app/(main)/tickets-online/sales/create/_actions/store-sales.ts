"use server";

import { db } from "@/db";
import { salesTicket } from "@/db/schema/sales-ticket";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { storePayment } from "@/lib/services/payments/store-payment";
import { can } from "@/lib/services/permissions/can";
import { proccessSalesTransaction } from "@/lib/services/sales/proccess-sales-transaction";
import { ServerActionResponse } from "@/types/domains/server-action";
import { User } from "@/types/next-auth";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storeSalesValidationSchema } from "./_libs/store-sales-validation-schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeSales(
  preState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  // Authorize user
  await authorizeUser(user);

  let salesId: bigint | null = null;
  try {
    // Validate input request
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      // Store data to table sales
      const sales = await proccessSalesTransaction({
        salesTemporary: {
          sales_details: validatedValues.sales_details,
        },
        sateliteConfig: SateliteUnitConfig.water_park_ticket,
        transactionType: SalesTransactionTypeEnum.TICKET_SALE,
        tx: tx,
      });
      salesId = sales.id;

      // Store data to table sales ticket
      await tx.insert(salesTicket).values({
        sales_id: salesId,
        customer_name: validatedValues.customer_name,
        customer_phone_number: validatedValues.customer_phone_number,
      });

      // Store data to table payment
      await storePayment({
        salesId: salesId,
        tx: tx,
        paymentSummary: {
          total_payment: Number(sales.grand_total),
          payment_method: PaymentMethodEnum.OTA_REDEMPTION,
          ota_redeem_code: validatedValues.ota_redeem_code,
          vendor_type_code: validatedValues.vendor_type_code,
          change_amount: 0,
          wallet_transaction_type: WalletTransactionTypeEnum.TICKET_SALE,
        },
      });
    });

    return {
      status: "success",
      message: "Berhasil melakukan pembayaran tiket",
      url: `/tickets-online/sales/${Number(salesId)}/receipt`,
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

    console.error(errors);

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

async function validateRequest(formData: FormData) {
  const validatedValues = await storeSalesValidationSchema.validate(
    {
      sales_details: JSON.parse(formData.get("sales_details") as string),
      customer_name: formData.get("customer_name"),
      customer_phone_number: formData.get("customer_phone_number"),
      customer_origin_id: formData.get("customer_origin_id"),
      ota_redeem_code: formData.get("ota_redeem_code"),
      vendor_type_code: formData.get("vendor_type_code"),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}
