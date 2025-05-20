"use server";

import { db } from "@/db";
import { gazebos, gazeboWallet, wallets } from "@/db/schema";
import { GazeboStatusEnum } from "@/lib/enums/GazeboStatusEnum";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";

const storeSalesValidationSchema = yup.object({
  wallet_id: yup
    .number()
    .required("Wallet ID wajib diisi")
    .typeError("Wallet ID wajib diisi dengan karakter yang valid"),
  gazebo_wallet_id: yup
    .number()
    .required("Gazebo wallet ID wajib diisi")
    .typeError("Gazebo wallet ID wajib diisi dengan karakter yang valid"),
  gazebo_ids: yup
    .array()
    .of(yup.number().typeError("Gazebo ID diisi dengan karakter yang valid"))
    .required("Gazebo ID wajib diisi"),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateGazeboWallet(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_UPDATE],
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized) throw new Error("User haven't permission");

    const gazeboWalletId = formData.get("gazebo_wallet_id") as string;
    const validatedValues = await storeSalesValidationSchema.validate(
      {
        wallet_id: formData.get("wallet_id") as string,
        gazebo_wallet_id: gazeboWalletId,
        gazebo_ids: JSON.parse(formData.get("gazebo_ids") as string),
      },
      {
        abortEarly: false,
      },
    );

    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.id, BigInt(validatedValues.wallet_id)),
    });

    if (!wallet) throw new Error("Wallet not found");

    const gazeboRent = await db.query.gazeboWallet.findFirst({
      where: eq(gazeboWallet.id, BigInt(validatedValues.gazebo_wallet_id)),
    });

    if (!gazeboRent) throw new Error("Gazebo wallet not found");

    await db.transaction(async (tx) => {
      if (gazeboRent.gazebo_id !== null) {
        await tx
          .update(gazebos)
          .set({
            status: GazeboStatusEnum.AVAILABLE,
          })
          .where(eq(gazebos.id, gazeboRent.gazebo_id));
      }

      await tx
        .update(gazebos)
        .set({
          status: GazeboStatusEnum.IN_USE,
        })
        .where(eq(gazebos.id, BigInt(validatedValues.gazebo_ids[0] as number)));

      await tx
        .update(gazeboWallet)
        .set({
          gazebo_id: BigInt(validatedValues.gazebo_ids[0] as number),
        })
        .where(eq(gazeboWallet.id, gazeboRent.id));
    });

    return {
      status: "success",
      message: "Berhasil menyimpan data pilih gazebo",
      url: `/cashq-transaction/${validatedValues.wallet_id}/gazebo-rent`,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data pilih gazebo. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data pilih gazebo. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
