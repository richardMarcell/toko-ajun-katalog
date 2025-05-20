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
import { updatePromoValidationSchema } from "./_libs/update-promo-validation-schema";
import { eq } from "drizzle-orm";
import { DatabaseTransaction } from "@/types/db-transaction";

type ValidatedValues = {
  promo_id: number;
  code: string;
  name: string;
  short_description: string;
  type: string;
  percentage: number;
  amount: number;
  is_required_booklet: boolean;
  unit_businesses: string[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updatePromo(
  prevState: any,
  formData: FormData,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_PROMO_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validateRequest(formData);

    await db.transaction(async (tx) => {
      await updatePromoData(validatedValues, tx);
      await sycnUnitBusinessHasPromo(validatedValues, tx);
    });

    const url = "/back-office/promos";

    revalidatePath(url);

    return {
      status: "success",
      message: "Berhasil menyimpan perubahan data promo",
      url: url,
    };
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyimpan perubahan data promo. Terjadi kesalahan pada sistem",
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
        "Gagal menyimpan perubahan data promo. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}

async function validateRequest(formData: FormData): Promise<ValidatedValues> {
  const validatedValues = await updatePromoValidationSchema.validate(
    {
      promo_id: formData.get("promo_id"),
      code: formData.get("code"),
      name: formData.get("name"),
      short_description: formData.get("short_description"),
      type: formData.get("type"),
      percentage: formData.get("percentage"),
      amount: formData.get("amount"),
      is_required_booklet: formData.get("is_required_booklet"),
      unit_businesses: JSON.parse(formData.get("unit_businesses") as string),
    },
    {
      abortEarly: false,
    },
  );

  return validatedValues;
}

async function updatePromoData(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
): Promise<void> {
  const promoId = BigInt(validatedValues.promo_id);
  await tx
    .update(promos)
    .set({
      code: validatedValues.code,
      name: validatedValues.name,
      short_description: validatedValues.short_description,
      amount: validatedValues.amount.toString(),
      percentage: validatedValues.percentage,
      type: validatedValues.type,
      is_required_booklet: validatedValues.is_required_booklet,
    })
    .where(eq(promos.id, promoId));
}

async function sycnUnitBusinessHasPromo(
  validatedValues: ValidatedValues,
  tx: DatabaseTransaction,
): Promise<void> {
  const promoId = BigInt(validatedValues.promo_id);
  await tx
    .delete(unitBusinessHasPromo)
    .where(eq(unitBusinessHasPromo.promo_id, promoId));

  const unitBusinessHasPromoData = validatedValues.unit_businesses.map(
    (unitBusiness) => ({
      promo_id: promoId,
      unit_business: unitBusiness,
    }),
  );
  await tx.insert(unitBusinessHasPromo).values(unitBusinessHasPromoData);
}
