import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const storeTenantValidationSchema = yup.object({
  name: yup
    .string()
    .required("Nama tenant wajib diisi")
    .typeError("Nama tenant wajib diisi dengan karakter yang valid"),
  image: yup
    .string()
    .typeError("Gambar diisi dengan karakter yang valid")
    .required("Gambar wajib diisi"),
  ip_address: yup
    .string()
    .required("Alamat IP wajb diisi")
    .typeError("Alamat IP wajib diisi dengan karakter yang valid")
    .test(
      "is-valid-ip-format",
      "Format Alamat IP tidak valid",
      function (ipAddress) {
        if (!ipAddress) return true;
        const ipRegex =
          /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
        return ipRegex.test(ipAddress);
      },
    )
    .test(
      "is-ip-address-exists",
      "Alamat IP sudah terdaftar",
      async function (ipAddress) {
        if (!ipAddress) return true;
        const ipLocation = await db.query.tenants.findFirst({
          where: eq(tenants.ip_address, ipAddress),
        });

        if (ipLocation) return false;

        return true;
      },
    ),
  is_required_tax: yup.boolean().required("Dikenai pajak wajib diisi"),
});
