import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const registerValidationSchema = yup.object({
  name: yup
    .string()
    .required("Nama wajib diisi")
    .typeError("Nama wajib diisi dengan karakter yang valid"),
  username: yup
    .string()
    .required("Username wajib diisi")
    .typeError("Username wajib diisi dengan karakter yang valid")
    .test(
      "is-username-exists",
      "Username sudah terdaftar dalam sistem",
      async function (username) {
        const user = await db.query.users.findFirst({
          where: eq(users.username, username),
        });

        if (user) return false;

        return true;
      },
    ),
  email: yup
    .string()
    .required("Email wajib diisi")
    .typeError("Email wajib diisi dengan karakter yang valid")
    .email("Format email tidak valid")
    .test(
      "is-email-exists",
      "Email sudah terdaftar dalam sistem",
      async function (email) {
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (user) return false;

        return true;
      },
    ),
  password: yup
    .string()
    .required("Password wajib diisi")
    .typeError("Password wajib diisi dengan karakter yang valid")
    .min(8, "Password harus terdiri minimal dari 8 karakter"),
  password_confirmation: yup
    .string()
    .required("Konrimasi password wajib diisi")
    .typeError("Konfirmasi password wajib diisi dengan karakter yang valid")
    .min(8, "Konfirmasi password harus terdiri minimal dari 8 karakter")
    .test(
      "is-password-confirmation-valid",
      "Konfirmasi passowrd harus sama dengan password yang diinputkan",
      function (passwordConfirmation) {
        const password = this.parent.password;
        if (password != passwordConfirmation) return false;

        return true;
      },
    ),
});
