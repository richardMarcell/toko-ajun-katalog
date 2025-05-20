import { db } from "@/db";
import { ipLocations } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const storeIpLocationValidationSchema = yup.object({
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
        const ipLocation = await db.query.ipLocations.findFirst({
          where: eq(ipLocations.ip_address, ipAddress),
        });

        if (ipLocation) return false;

        return true;
      },
    ),
  location_desc: yup
    .string()
    .required("Deskripsi lokasi wajb diisi")
    .typeError("Deskripsi lokasi wajib diisi dengan karakter yang valid"),
});
