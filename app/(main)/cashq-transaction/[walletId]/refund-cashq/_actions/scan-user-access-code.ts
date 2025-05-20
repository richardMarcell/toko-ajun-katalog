"use server";

import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { createYupValidationError } from "@/lib/utils";
import { redirect } from "next/navigation";
import * as yup from "yup";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function scanUserAccessCode({
  userAccessCode,
}: {
  userAccessCode: string;
}) {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      permissionNames: [
        PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_DEPOSIT_WITHDRAW_LOST_DAMAGED,
      ],
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized) throw new Error("User haven't permission");

    const isUserAccessCodeValid = true;

    if (!isUserAccessCodeValid) {
      const validationError = createYupValidationError(
        "access_code",
        userAccessCode,
        "User tidak memiliki akses untuk melakukan proses ini",
      );
      throw validationError;
    }
    return {
      status: "success",
      message: "Kode akses user diterima",
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Tidak dapat memproses kode akses user. Terjadi kesalahan pada sistem",
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
        "Kode akses user ditolak. Periksa kembali kode akses user yang dimasukkan",
      errors: errors,
    };
  }
}
