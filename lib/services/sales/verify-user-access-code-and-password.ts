"use server";

import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { createYupValidationError } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";
import { redirect } from "next/navigation";
import * as yup from "yup";

const cashQTransactionReprintValidationSchema = yup.object({
  // TODO: pastikan kode akses user tersedia
  access_code: yup
    .string()
    .required("Kode akses user wajib diisi")
    .typeError("Kode akses user wajib diisi dengan karakter yang valid"),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function verifyUserAccessCodeAndPassword(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  try {
    const user = await getUserAuthenticated();
    if (!user) redirect("/auth/login");

    const isAuthorized = await can({
      // TODO: change permission to verify user access code and password
      permissionNames: [PermissionEnum.SALES_REPRINT],
      user: user,
      isRedirectToForbiddenPage: false,
    });

    if (!isAuthorized) throw new Error("User haven't permission");

    const validatedValues =
      await cashQTransactionReprintValidationSchema.validate(
        {
          access_code: formData.get("access_code") as string,
        },
        {
          abortEarly: false,
        },
      );

    const isUserAccessCodeValid = true;

    if (!isUserAccessCodeValid) {
      const validationError = createYupValidationError(
        "access_code",
        validatedValues.access_code,
        "User tidak memiliki akses untuk melakukan proses ini",
      );
      throw validationError;
    }

    return {
      status: "success",
      message: "Berhasil memverfikasi akses user",
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      if (error.hasOwnProperty("cause")) {
        return {
          status: "error",
          message: error["cause"],
        };
      }

      return {
        status: "error",
        message: "Gagal memverfikasi akses user. Terjadi kesalahan pada sistem",
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
        "Gagal memverfikasi akses user. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
