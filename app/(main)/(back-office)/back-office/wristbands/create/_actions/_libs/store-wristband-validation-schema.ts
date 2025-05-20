import { db } from "@/db";
import { wristbands } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const storeWristbandValidationSchema = yup.object({
  wristband_code: yup
    .string()
    .required("Kode gelang wajib diisi")
    .test(
      "is-wristband-exists",
      "Kode gelang sudah terdaftar",
      async function (wristbandCode) {
        const wristband = await db.query.wristbands.findFirst({
          where: eq(wristbands.code, wristbandCode),
        });

        if (wristband) return false;

        return true;
      },
    ),
});
