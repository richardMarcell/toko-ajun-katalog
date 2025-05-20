"use server";

import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { redirect } from "next/navigation";
import { storeWalletTemporaryValidationSchema } from "./_lib/store-wallet-temporary-validation-schema";
import * as yup from "yup";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeWalletTemporary(
  preState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [PermissionEnum.WRISTBAND_RENT_WALLET_CREATE],
      user: user,
      isRedirectToForbiddenPage: false,
    });
    
    if (!isAuthorized) throw new Error("User haven't permission");

    // TODO: fix wristband_rent_code can accept the same code in the same request
    await storeWalletTemporaryValidationSchema.validate(
      {
        quantity: formData.get("quantity"),
        saldo: formData.get("saldo"),
        customer_name: formData.get("customer_name"),
        customer_phone_number: formData.get("customer_phone_number"),
        wristband_rent_code: JSON.parse(
          formData.get("wristband_rent_code") as string,
        ),
      },
      {
        abortEarly: false,
      },
    );

    return {
      status: "success",
      message: "Berhasil menyimpan data penyewaan gelang",
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data penyewaan gelang. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data penyewaan gelang. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
