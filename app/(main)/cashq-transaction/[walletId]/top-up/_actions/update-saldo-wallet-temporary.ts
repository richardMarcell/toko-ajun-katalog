"use server";

import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { can } from "@/lib/services/permissions/can";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { ServerActionResponse } from "@/types/domains/server-action";
import { getTopUpProduct } from "@/repositories/domain/general/get-top-up-product";
import { formatNumberToCurrency } from "@/lib/utils";

const storeTopUpWalletTemporaryValidationSchema = yup.object({
  // TODO: tambahkan validasi untuk memastikan wallet_id exsists dan berstatus OPEN
  wallet_id: yup
    .number()
    .required("Wallet ID wajib diisi")
    .typeError("Wallet ID wajib diisi dengan karakter yang valid"),
  amount: yup
    .number()
    .required("Saldo wajib diisi")
    .typeError("Saldo wajib diisi dengan karakter yang valid")
    .test({
      name: "is-saldo-valid",
      skipAbsent: true,
      async test(saldo) {
        if (saldo < 1) {
          return this.createError({
            message: "Saldo wajib diisi",
          });
        }

        const { topUpProduct } = await getTopUpProduct();
        if (!topUpProduct) return true;

        if (saldo < Number(topUpProduct.price)) {
          return this.createError({
            message: `Minimum pengisian saldo adalah ${formatNumberToCurrency(Number(topUpProduct.price))}`,
          });
        }

        if (saldo % 10000 !== 0) {
          return this.createError({
            message: "Mohon masukkan saldo dalam kelipatan Rp10.000.",
          });
        }

        return true;
      },
    }),
  current_saldo: yup
    .number()
    .required("Sisa saldo wajib diisi")
    .typeError("Sisa saldo wajib diisi dengan karakter yang valid"),
  wristband_code: yup
    .string()
    .required("CashQ Code wajib diisi")
    .typeError("CashQ Code wajib diisi dengan karakter yang valid"),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function updateSaldoWalletTemporary(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.CASHQ_TRANSACTION_TOP_UP_CREATE],
    user: user,
  });
  try {
    await storeTopUpWalletTemporaryValidationSchema.validate(
      {
        wallet_id: formData.get("wallet_id"),
        amount: formData.get("amount"),
        current_saldo: formData.get("current_saldo"),
        wristband_code: formData.get("wristband_code"),
      },
      {
        abortEarly: false,
      },
    );

    return {
      status: "success",
      message: "Berhasil menyimpan data Top-Up CashQ",
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
