import { db } from "@/db";
import { lockers, wristbands } from "@/db/schema";
import { LockerStatusEnum } from "@/lib/enums/LockerStatusEnum";
import { LockerTypeEnum } from "@/lib/enums/LockerTypeEnum";
import { and, eq } from "drizzle-orm";
import * as yup from "yup";

export const storeLockerValidationSchema = yup.object({
  label: yup
    .string()
    .required("Nomor loker wajib diisi")
    .typeError("Nomor loker wajib diisi dengan karakter yang valid")
    .test(
      "is-label-exists",
      "Nomor loker sudah terdaftar",
      async function (label) {
        const lockerType = this.parent.type;
        if (!label || !lockerType) return true;

        const locker = await db.query.lockers.findFirst({
          where: and(eq(lockers.type, lockerType), eq(lockers.label, label)),
        });

        if (locker) return false;

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
  type: yup
    .string()
    .required("Tipe loker wajib dipilih")
    .typeError("Tipe loker wajib dipilih dengan pilihan yang valid")
    .oneOf(
      Object.values(LockerTypeEnum),
      "Tipe loker yang diterima hanya Standard dan Family",
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
