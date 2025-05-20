import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const updatePasswordValidationSchema = yup.object({
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
});
