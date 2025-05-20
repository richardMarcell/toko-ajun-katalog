import { db } from "@/db";
import { gazebos } from "@/db/schema";
import { GazeboStatusEnum } from "@/lib/enums/GazeboStatusEnum";
import { GazeboTypeEnum } from "@/lib/enums/GazeboTypeEnum";
import { and, eq } from "drizzle-orm";
import * as yup from "yup";

export const storeGazeboValidationSchema = yup.object({
  label: yup
    .string()
    .required("Nomor gazebo wajib diisi")
    .typeError("Nomor gazebo wajib diisi dengan karakter yang valid")
    .test(
      "is-label-exists",
      "Nomor gazebo sudah terdaftar",
      async function (label) {
        const gazeboType = this.parent.type;
        if (!label || !gazeboType) return true;

        const gazebo = await db.query.gazebos.findFirst({
          where: and(eq(gazebos.type, gazeboType), eq(gazebos.label, label)),
        });

        if (gazebo) return false;

        return true;
      },
    ),
  status: yup
    .string()
    .required("Status gazebo wajib dipilih")
    .typeError("Status gazebo wajib dipilih dengan pilihan yang valid")
    .oneOf(
      Object.values(GazeboStatusEnum),
      "Status gazebo yang diterima hanya Available, In Use dan Unavailable",
    ),
  type: yup
    .string()
    .required("Tipe gazebo wajib dipilih")
    .typeError("Tipe gazebo wajib dipilih dengan pilihan yang valid")
    .oneOf(
      Object.values(GazeboTypeEnum),
      "Tipe gazebo yang diterima hanya VIP dan Family",
    ),
});
