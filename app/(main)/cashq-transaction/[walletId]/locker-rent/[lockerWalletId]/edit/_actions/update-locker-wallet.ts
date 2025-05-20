"use server";

import { db } from "@/db";
import { lockers, lockerWallet, wallets } from "@/db/schema";
import { LockerStatusEnum } from "@/lib/enums/LockerStatusEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";

const updateLockerWalletValidationSchema = yup.object({
  wallet_id: yup
    .number()
    .required("Wallet ID wajib diisi")
    .typeError("Wallet ID wajib diisi dengan karakter yang valid"),
  locker_wallet_id: yup
    .number()
    .required("Loker wallet ID wajib diisi")
    .typeError("Loker wallet ID wajib diisi dengan karakter yang valid"),
  locker_ids: yup
    .array()
    .of(yup.number().typeError("Loker ID diisi dengan karakter yang valid"))
    .required("Loker ID wajib diisi"),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateLockerWallet(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_UPDATE],
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized) throw new Error("User haven't permission");

    const lockerwalletId = formData.get("locker_wallet_id") as string;
    const validatedValues = await updateLockerWalletValidationSchema.validate(
      {
        wallet_id: formData.get("wallet_id") as string,
        locker_wallet_id: lockerwalletId,
        locker_ids: JSON.parse(formData.get("locker_ids") as string),
      },
      {
        abortEarly: false,
      },
    );

    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.id, BigInt(validatedValues.wallet_id)),
    });

    if (!wallet) throw new Error("Wallet not found");

    const lockerRent = await db.query.lockerWallet.findFirst({
      where: eq(lockerWallet.id, BigInt(validatedValues.locker_wallet_id)),
    });

    if (!lockerRent) throw new Error("Locker wallet not found");

    await db.transaction(async (tx) => {
      if (lockerRent.locker_id !== null) {
        await tx
          .update(lockers)
          .set({
            status: LockerStatusEnum.AVAILABLE,
          })
          .where(eq(lockers.id, lockerRent.locker_id));
      }

      const selectedLockerId = validatedValues.locker_ids[0];

      await tx
        .update(lockers)
        .set({
          status: LockerStatusEnum.IN_USE,
        })
        .where(eq(lockers.id, BigInt(selectedLockerId as number)));

      await tx
        .update(lockerWallet)
        .set({
          locker_id: BigInt(selectedLockerId as number),
        })
        .where(eq(lockerWallet.id, lockerRent.id));
    });

    return {
      status: "success",
      message: "Berhasil menyimpan data pilih loker",
      url: `/cashq-transaction/${wallet.id}/locker-rent`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data pilih loker. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data pilih loker. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
