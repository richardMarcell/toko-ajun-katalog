"use server";

import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { ServerActionResponse } from "@/types/domains/server-action";
import { redirect } from "next/navigation";
import getClientIp from "../../lib/services/auth/get-client-ip";
import { db } from "@/db";
import { supportTickets } from "@/db/schema/support-tickets";
import { eq } from "drizzle-orm";
import { ipLocations } from "@/db/schema";
import { revalidatePath } from "next/cache";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function storeSupportTicket(): Promise<ServerActionResponse> {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SUPPORT_TICKET_STORE],
    user: user,
  });

  try {
    const clientIp = await getClientIp();

    const ipLocation = await db.query.ipLocations.findFirst({
      where: eq(ipLocations.ip_address, clientIp),
    });
    if (!ipLocation) {
      return {
        status: "error",
        message:
          "Gagal mengirim tiket support ke tim IT. Anda tidak memiliki akses ke dalam aplikasi",
      };
    }

    await db.transaction(async (tx) => {
      await tx.insert(supportTickets).values({
        user_id: BigInt(user.id),
        ip_address: clientIp,
      });
    });

    revalidatePath("/back-office/dashboard");

    return {
      status: "success",
      message: "Berhasil mengirim tiket support ke tim IT",
    };
  } catch (error: any) {
    console.error(error);

    return {
      status: "error",
      message:
        "Gagal mengirim tiket support ke tim IT. Terjadi kesalahan pada sistem",
    };
  }
}
