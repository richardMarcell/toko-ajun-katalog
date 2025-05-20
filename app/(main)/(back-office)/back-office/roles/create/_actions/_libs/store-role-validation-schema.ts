import { db } from "@/db";
import { roles } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const storeRoleValidationSchema = yup.object({
  name: yup
    .string()
    .required("Nama pengguna wajib diisi")
    .typeError("Nama pengguna wajib diisi dengan karakter yang valid")
    .test("is-name-exists", "Nama role sudah terdaftar", async function (name) {
      const role = await db.query.roles.findFirst({
        where: eq(roles.name, name),
      });

      if (role) return false;

      return true;
    }),
  description: yup
    .string()
    .required("Deskripsi pengguna wajib diisi")
    .typeError("Deskripsi pengguna wajib diisi dengan karakter yang valid"),
});
