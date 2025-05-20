"use server";

import { db } from "@/db";
import { lockerWallet, wallets, wristbands } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import PermissionDeniedError from "@/lib/exceptions/permission-denied-error";
import RecordNotFoundError from "@/lib/exceptions/record-not-found-error";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";

const updateAddWristbandValidationSchema = yup.object({
  wallet_id: yup
    .number()
    .required("Wallet ID wajib diisi")
    .typeError("Wallet ID wajib diisi dengan karakter yang valid"),
  locker_wallet_id: yup
    .number()
    .required("Loker wallet ID wajib diisi")
    .typeError("Loker wallet ID wajib diisi dengan karakter yang valid"),
  quantity: yup
    .number()
    .typeError("Jumlah wajib diisi dengan angka yang valid")
    .required("Jumlah wajib diisi"),
  wristband_rent_code: yup
    .array()
    .of(
      yup
        .string()
        .test(
          "is-wristband-available",
          "CashQ belum dikembalikan, silakan melakukan pengembalian CashQ",
          async function (code) {
            const wristband = await db.query.wristbands.findFirst({
              where: eq(wristbands.code, code as string),
            });

            if (!wristband) return false;
            if (wristband.status === WristbandStatusEnum.IN_USE) return false;

            return true;
          },
        )
        .required("CashQ code wajib diisi"),
    )
    .min(1, "Wajib mengisi setidaknya 1 CashQ code")
    .required("Detail penjualan wajib diisi"),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateAddWristband(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const permissionNames = [
      PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_UPDATE_ADD_WRISTBAND,
    ];

    const isAuthorized = await can({
      permissionNames,
      user: user,
      isRedirectToForbiddenPage: false,
    });

    // TODO: implement this throw custom exception to all server action
    if (!isAuthorized)
      throw new PermissionDeniedError({
        userId: user.id,
        userName: user.name,
        deniedPermissions: permissionNames.toString(),
      });

    const validatedValues = await updateAddWristbandValidationSchema.validate(
      {
        wallet_id: formData.get("wallet_id") as string,
        locker_wallet_id: formData.get("locker_wallet_id") as string,
        quantity: formData.get("quantity"),
        wristband_rent_code: JSON.parse(
          formData.get("wristband_rent_code") as string,
        ),
      },
      {
        abortEarly: false,
      },
    );

    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.id, BigInt(validatedValues.wallet_id)),
    });

    // TODO: implement this throw custom exception to all server action
    if (!wallet)
      throw new RecordNotFoundError({
        table: "wallet",
        query: { id: validatedValues.wallet_id },
      });

    const lockerRent = await db.query.lockerWallet.findFirst({
      where: eq(lockerWallet.id, BigInt(validatedValues.locker_wallet_id)),
    });

    if (!lockerRent)
      throw new RecordNotFoundError({
        table: "lockerWallet",
        query: { id: validatedValues.locker_wallet_id },
      });

    return {
      status: "success",
      message: "Berhasil data penambahan gelang",
      url: `/cashq-transaction/${wallet.id}/locker-rent/${lockerRent.id}/sales/create`,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof PermissionDeniedError) {
      return {
        status: "error",
        message:
          "Gagal data penambahan gelang. User tidak memiliki izin untuk melakukan tindakan ini",
      };
    }

    if (error instanceof RecordNotFoundError) {
      return {
        status: "error",
        message:
          "Gagal data penambahan gelang. Data yang ingin diproses tidak ditemukan",
      };
    }

    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message: "Gagal data penambahan gelang. Terjadi kesalahan pada sistem",
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
        "Gagal data penambahan gelang. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
