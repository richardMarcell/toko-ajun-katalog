"use server";

import { db } from "@/db";
import { promos, unitBusinessHasPromo } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { storePromoValidationSchema } from "./_libs/store-promo-validation-schema";
import { DatabaseTransaction } from "@/types/db-transaction";

type ValidatedValues = {
  code: string;
  name: string;
  short_description: string;
  type: string;
  percentage: number;
  amount: number;
  is_required_booklet: boolean;
  periode_start: Date;
  periode_end: Date;
  unit_businesses: string[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storePromo(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_PROMO_STORE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      const promoId = await storePromoData(validatedValues, tx);

      await storeUnitBusinessHasPromo(validatedValues, tx, promoId);
    });

    const url = "/back-office/promos";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan data promo baru",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan data promo baru. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan data promo baru. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await storePromoValidationSchema.validate(
    {
      code: formData.get("code"),
      name: formData.get("name"),
      short_description: formData.get("short_description"),
      type: formData.get("type"),
      percentage: formData.get("percentage"),
      amount: formData.get("amount"),
      is_required_booklet: formData.get("is_required_booklet"),
      periode_start: formData.get("periode_start"),
      periode_end: formData.get("periode_end"),
      unit_businesses: JSON.parse(formData.get("unit_businesses") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function storePromoData(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
): Promise<bigint> {
  const promoCreated = await tx
    .insert(promos)
    .values({
      code: validatedValues.code,
      name: validatedValues.name,
      short_description: validatedValues.short_description,
      amount: validatedValues.amount.toString(),
      percentage: validatedValues.percentage,
      type: validatedValues.type,
      is_active: true,
      is_required_booklet: validatedValues.is_required_booklet,
      periode_start: validatedValues.periode_start,
      periode_end: validatedValues.periode_end,
    })
    .$returningId();

  const promoId = promoCreated[0].id;

  return promoId;
}

async function storeUnitBusinessHasPromo(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
  promoId: bigint,
): Promise<void> {
  const unitBusinessHasPromoData = validatedValues.unit_businesses.map(
    (unitBusiness) => ({
      promo_id: promoId,
      unit_business: unitBusiness,
    }),
  );
  await tx.insert(unitBusinessHasPromo).values(unitBusinessHasPromoData);
}
