import { db } from "@/db";
import { lockers, wristbands } from "@/db/schema";
import { LockerStatusEnum } from "@/lib/enums/LockerStatusEnum";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const updateLockerValidationSchema = yup.object({
  locker_id: yup
    .number()
    .required("ID Locker wajib diisi")
    .test(
      "is-locker-exists",
      "Loker tidak terdaftar dalam sistem",
      async function (lockerId) {
        const locker = await db.query.lockers.findFirst({
          where: eq(lockers.id, BigInt(lockerId)),
        });

        if (!locker) return false;

        return true;
      },
    ),
  status: yup
    .string()
    .required("Status loker wajib dipilih")
    .typeError("Status loker wajib dipilih dengan pilihan yang valid")
    .oneOf(
      Object.values(LockerStatusEnum),
      "Status loker yang diterima hanya Available, In Use dan Unavailable",
    ),
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
});
