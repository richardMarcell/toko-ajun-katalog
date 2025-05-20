import { db } from "@/db";
import { wristbands } from "@/db/schema";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const updateWristbandValidationSchema = yup.object({
  wristband_code: yup
    .string()
    .required("Kode gelang wajib diisi")
    .test(
      "is-wristband-exists",
      "Kode gelang tidak terdaftar dalam sistem",
      async function (wristbandCode) {
        const wristband = await db.query.wristbands.findFirst({
          where: eq(wristbands.code, wristbandCode),
        });

        if (!wristband) return false;

        return true;
      },
    ),
  status: yup
    .string()
    .required("Status gelang wajib dipilih")
    .oneOf(
      Object.values(WristbandStatusEnum),
      "Status gelang hanya dapat bernilai Available, In Use atau Lost/Damaged",
    ),
});
