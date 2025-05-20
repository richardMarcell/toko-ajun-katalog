"use server";

import { db } from "@/db";
import { wallets, walletWristband, wristbands } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";

const updateChangeWristbandValidationSchema = yup.object({
  wallet_id: yup
    .number()
    .required("Wallet ID wajib diisi")
    .typeError("Wallet ID wajib diisi dengan karakter yang valid"),
  wristband_code_1: yup
    .string()
    .required("Kode CashQ 1 wajib diisi")
    .typeError("Kode CashQ 1 wajib diisi dengan karakter yang valid"),
  wristband_code_2: yup
    .string()
    .required("Kode CashQ 2 wajib diisi")
    .typeError("Kode CashQ 2 wajib diisi dengan karakter yang valid"),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateChangeWristband(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_UPDATE_CHANGE_WRISTBAND],
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized) throw new Error("User haven't permission");

    const validatedValues = await updateChangeWristbandValidationSchema.validate(
      {
        wallet_id: formData.get("wallet_id") as string,
        wristband_code_1: formData.get("wristband_code_1"),
        wristband_code_2: formData.get("wristband_code_2"),
      },
      {
        abortEarly: false,
      },
    );

    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.id, BigInt(validatedValues.wallet_id)),
    });

    if (!wallet) throw new Error("Wallet not found");

    await db.transaction(async (tx) => {
      await tx
        .update(walletWristband)
        .set({
          wristband_code: validatedValues.wristband_code_2,
        })
        .where(
          and(
            eq(walletWristband.wallet_id, wallet.id),
            eq(
              walletWristband.wristband_code,
              validatedValues.wristband_code_1,
            ),
          ),
        );

      // chnage old status wristband to available
      await tx
        .update(wristbands)
        .set({
          status: WristbandStatusEnum.AVAILABLE,
        })
        .where(eq(wristbands.code, validatedValues.wristband_code_1));
        
      // chnage new status wristband to in use
      await tx
        .update(wristbands)
        .set({
          status: WristbandStatusEnum.IN_USE,
        })
        .where(eq(wristbands.code, validatedValues.wristband_code_2));
    });

    return {
      status: "success",
      message: "Berhasil mengganti gelang",
      url: `/cashq-transaction/${wallet.id}/locker-rent`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message: "Gagal mengganti gelang. Terjadi kesalahan pada sistem",
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
        "Gagal mengganti gelang. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
