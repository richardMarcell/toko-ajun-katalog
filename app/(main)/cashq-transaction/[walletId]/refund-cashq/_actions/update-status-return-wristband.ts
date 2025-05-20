"use server";
import { db } from "@/db";
import { wallets, walletWristband, wristbands } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { WalletWristbandReturnStatusEnum } from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getCurrentDate } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";
import { and, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as yup from "yup";

const updateStatusReturnWristbandValidationSchema = yup.object({
  return_wristband_codes: yup
    .array()
    .of(
      yup
        .string()
        .test(
          "is-wristband-in-use",
          "CashQ sudah tidak dalam status sedang digunakan",
          async function (code) {
            const wristband = await db.query.wristbands.findFirst({
              where: eq(wristbands.code, code as string),
            });

            if (!wristband) return false;
            if (wristband.status === WristbandStatusEnum.AVAILABLE)
              return false;

            return true;
          },
        )
        .required("CashQ code wajib diisi"),
    )
    .required("Kode CashQ yang ingin dikembalikan wajib diisi"),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function updateStatusReturnWristband({
  walletId,
  data,
}: {
  walletId: bigint;
  data: { [k: string]: FormDataEntryValue };
}): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [
        PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_WRISTBAND_STATUS,
      ],
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized) throw new Error("User haven't permission");

    const wallet = await db.query.wallets.findFirst({
      with: { walletWristbands: true },
      where: eq(wallets.id, walletId),
    });

    if (!wallet) throw new Error("Wallet not found");

    const validatedValues =
      await updateStatusReturnWristbandValidationSchema.validate(
        {
          return_wristband_codes: JSON.parse(
            data.return_wristband_codes as string,
          ),
        },
        {
          abortEarly: false,
        },
      );

    await db.transaction(async (tx) => {
      await tx
        .update(walletWristband)
        .set({
          return_status: WalletWristbandReturnStatusEnum.HAS_RETURNED,
          returned_at: getCurrentDate(),
        })
        .where(
          and(
            inArray(
              walletWristband.wristband_code,
              validatedValues.return_wristband_codes,
            ),
            eq(walletWristband.wallet_id, walletId),
          ),
        );

      await tx
        .update(wristbands)
        .set({ status: WristbandStatusEnum.AVAILABLE })
        .where(
          inArray(wristbands.code, validatedValues.return_wristband_codes),
        );
    });

    return {
      status: "success",
      message: "Berhasil mengembalikan semua gelang",
      url: `/cashq-transaction/${walletId}/refund-cashq`,
    };
  } catch (error: unknown) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal mengembalikan semua gelang. Terjadi kesalahan pada sistem",
      };
    }

    const errors: { [key: string]: string } = {};
    if (error.inner) {
      console.error(error.inner);
      error.inner.forEach((e: any) => {
        if (e.path) {
          errors[e.path] = e.message;
        }
      });
    }

    return {
      status: "error",
      message:
        "Gagal mengembalikan semua gelang. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
