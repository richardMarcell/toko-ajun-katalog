import { db } from "@/db";
import { userHasRoles } from "@/db/schema";
import { RoleEnum } from "@/db/seeders/datas/default-roles";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  const userHasRole = await db.query.userHasRoles.findMany({
    with: {
      role: true,
    },
    where: eq(userHasRoles.user_id, BigInt(user.id)),
  });

  const roles = userHasRole.map((userRole) => userRole.role.name);

  const isOwner = roles.includes(RoleEnum.OWNER);
  if (isOwner) redirect("/dashboard");

  const isCustomer = roles.includes(RoleEnum.CUSTOMER);
  if (isCustomer) redirect("/");

  redirect("/");
}
