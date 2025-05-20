import { db } from "@/db";
import { ipLocations } from "@/db/schema";
import { and, eq, not } from "drizzle-orm";
import * as yup from "yup";

export const updateIpLocationValidationSchema = yup.object({
  ip_location_id: yup
    .number()
    .required("ID Lokasi IP wajb diisi")
    .typeError("ID Lokasi IP wajib diisi dengan karakter yang valid")
    .test(
      "is-ip-location-exists",
      "Lokasi IP tidak terdaftar dalam sistem",
      async function (ipLocationId) {
        const ipLocation = await db.query.ipLocations.findFirst({
          where: eq(ipLocations.id, BigInt(ipLocationId)),
        });

        if (!ipLocation) return false;

        return true;
      },
    ),
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
        const ipLocationId = this.parent.ip_location_id;
        if (!ipAddress || !ipLocationId) return true;

        const ipLocation = await db.query.ipLocations.findFirst({
          where: and(
            eq(ipLocations.ip_address, ipAddress),
            not(eq(ipLocations.id, BigInt(ipLocationId))),
          ),
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
