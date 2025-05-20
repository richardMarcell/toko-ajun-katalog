import { db } from "@/db";
import { roles, users } from "@/db/schema";
import { and, eq, not } from "drizzle-orm";
import * as yup from "yup";

export const updateUserValidationSchema = yup.object({
  user_id: yup
    .number()
    .required("User ID wajib diisi")
    .test(
      "is-user-exists",
      "User tidak terdaftar dalam sistem",
      async function (userId) {
        const user = await db.query.users.findFirst({
          where: eq(users.id, BigInt(userId)),
        });

        if (!user) return false;

        return true;
      },
    ),
  name: yup
    .string()
    .required("Nama pengguna wajib diisi")
    .typeError("Nama pengguna wajib diisi dengan karakter yang valid"),
  email: yup
    .string()
    .required("Email pengguna wajib diisi")
    .typeError("Email pengguna wajib diisi dengan karakter yang valid")
    .test(
      "is-email-exists",
      "Email pengguna sudah terdaftar",
      async function (email) {
        const userId = this.parent.user_id;

        const user = await db.query.users.findFirst({
          where: and(eq(users.email, email), not(eq(users.id, BigInt(userId)))),
        });

        if (user) return false;

        return true;
      },
    ),
  username: yup
    .string()
    .required("Username wajib diisi")
    .typeError("Username wajib diisi dengan karakter yang valid")
    .test(
      "is-username-exists",
      "Username sudah terdaftar",
      async function (username) {
        const userId = this.parent.user_id;
        const user = await db.query.users.findFirst({
          where: and(
            eq(users.username, username),
            not(eq(users.id, BigInt(userId))),
          ),
        });

        if (user) return false;

        return true;
      },
    ),
  role_ids: yup
    .array()
    .of(
      yup
        .number()
        .required("Role pengguna wajib diisi")
        .test(
          "is-role-exists",
          "Role yang dipilih tidak terdaftar dalam sistem",
          async function (roleId) {
            const role = await db.query.roles.findFirst({
              where: eq(roles.id, BigInt(roleId)),
            });

            if (!role) return false;

            return true;
          },
        ),
    )
    .min(1, "Wajib memilih setidaknya 1 role pengguna")
    .required("Role pengguna wajib diisi")
    .typeError("Role pengguna wajib diisi dengan karakter yang valid"),
});
