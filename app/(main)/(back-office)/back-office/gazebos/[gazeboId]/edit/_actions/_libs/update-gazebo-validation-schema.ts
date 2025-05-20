import { db } from "@/db";
import { gazebos } from "@/db/schema";
import { GazeboStatusEnum } from "@/lib/enums/GazeboStatusEnum";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const updateGazeboValidationSchema = yup.object({
  gazebo_id: yup
    .number()
    .required("ID Gazebo wajib diisi")
    .test(
      "is-gazebo-exists",
      "Gazebo tidak terdaftar dalam sistem",
      async function (gazeboId) {
        const gazebo = await db.query.gazebos.findFirst({
          where: eq(gazebos.id, BigInt(gazeboId)),
        });

        if (!gazebo) return false;

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
});
