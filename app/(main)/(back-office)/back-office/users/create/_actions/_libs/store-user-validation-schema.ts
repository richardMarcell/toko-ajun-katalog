import { db } from "@/db";
import { roles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const storeUserValidationSchema = yup.object({
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
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
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
        const user = await db.query.users.findFirst({
          where: eq(users.username, username),
        });

        if (user) return false;

        return true;
      },
    ),
  password: yup
    .string()
    .required("Password wajib diisi")
    .min(8, "Password wajib terdiri dari minimal 8 karakter")
    .typeError("Password wajib diisi dengan karakter yang valid"),
  password_confirmation: yup
    .string()
    .required("Konfirmasi password wajib diisi")
    .typeError("Konfirmasi password wajib diisi dengan karakter yang valid")
    .test(
      "is-same-with-password",
      "Konfirmasi password harus sama dengan password",
      function (value) {
        const password = this.parent.password;
        return password === value;
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
