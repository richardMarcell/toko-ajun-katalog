"use server";

import { db } from "@/db";
import { supportTickets } from "@/db/schema";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getCurrentDate } from "@/lib/utils";
import { ServerActionResponse } from "@/types/domains/server-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";

const validationSchema = yup.object({
  support_ticket_id: yup
    .number()
    .required("ID Support Ticket wajib diisi")
    .test(
      "is-support-ticket-exists",
      "Tiket Support tidak terdaftar dalam sistem",
      async function (supportTicketId) {
        const supportTicket = await db.query.supportTickets.findFirst({
          where: eq(supportTickets.id, BigInt(supportTicketId)),
        });

        if (!supportTicket) return false;

        return true;
      },
    ),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function markTicketSupportAsDone(
  prevState: any,
  supportTicketId: bigint,
): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_IP_LOCATION_UPDATE],
    user: user,
  });

  try {
    const validatedValues = await validationSchema.validate(
      {
        support_ticket_id: supportTicketId,
      },
      {
        abortEarly: false,
      },
    );

    const supportTicketIdValidated = BigInt(validatedValues.support_ticket_id);

    await db.transaction(async (tx) => {
      await tx
        .update(supportTickets)
        .set({
          is_done: true,
          mark_as_done_by: BigInt(user.id),
          mark_as_done_at: getCurrentDate(),
        })
        .where(eq(supportTickets.id, supportTicketIdValidated));
    });

    revalidatePath(`/back-office/dashboard`);

    return {
      status: "success",
      message: "Berhasil menyatakan tiket sebagai selesai",
    };
  } catch (error: any) {
    console.error(error);

    if (!(error instanceof yup.ValidationError)) {
      return {
        status: "error",
        message:
          "Gagal menyatakan tiket sebagai selesai. Terjadi kesalahan pada sistem",
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
        "Gagal menyatakan tiket sebagai selesai. Silahkan periksa kembali inputan yang Anda masukkan",
      errors: errors,
    };
  }
}
