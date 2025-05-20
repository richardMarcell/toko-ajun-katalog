import { db } from "@/db";
import { roles } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import * as yup from "yup";

export const updateRoleValidationSchema = yup.object({
  role_id: yup
    .number()
    .required("Role ID wajib diisi")
    .test(
      "is-role-id-exists",
      "Role tidak terdaftar dalam sistem",
      async function (roleId) {
        const role = await db.query.roles.findFirst({
          where: eq(roles.id, BigInt(roleId)),
        });

        if (!role) return false;

        return true;
      },
    ),
  name: yup
    .string()
    .required("Nama pengguna wajib diisi")
    .typeError("Nama pengguna wajib diisi dengan karakter yang valid")
    .test("is-name-exists", "Nama role sudah terdaftar", async function (name) {
      const roleId = this.parent.role_id;

      const role = await db.query.roles.findFirst({
        where: and(eq(roles.name, name), ne(roles.id, BigInt(roleId))),
      });

      if (role) return false;

      return true;
    }),
  description: yup
    .string()
    .required("Deskripsi pengguna wajib diisi")
    .typeError("Deskripsi pengguna wajib diisi dengan karakter yang valid"),
});
