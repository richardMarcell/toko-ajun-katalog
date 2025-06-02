import { db } from "@/db";
import { sales } from "@/db/schema";
import { SalesStatusEnum } from "@/lib/enums/SalesStatusEnum";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const updateSalesValidationSchema = yup.object({
  sales_id: yup
    .number()
    .typeError("ID Sales wajib diisi dengan karkter yang valid")
    .required("ID Sales wajib diisi")
    .test(
      "is-sales-exists",
      "Penjualan tidak terdaftar dalam sistem",
      async function (salesId) {
        const sale = await db.query.sales.findFirst({
          where: eq(sales.id, BigInt(salesId)),
        });

        if (!sale) return false;

        return true;
      },
    ),
  status: yup
    .string()
    .typeError("Status penjualan wajib diisi dengan karkter yang valid")
    .required("Status penjualan wajib diisi")
    .oneOf(
      Object.values(SalesStatusEnum),
      "Status tidak terdaftar dalam sistem",
    )
    .test(
      "is-update-allowed",
      "Penjualan sudah selesai atau sudah di closed",
      async function (status) {
        console.log(status);
        const salesId = this.parent.sales_id;

        const sale = await db.query.sales.findFirst({
          where: eq(sales.id, BigInt(salesId)),
        });

        if (!sale) return false;
        if (sale.status === SalesStatusEnum.CLOSED) return false;

        return true;
      },
    ),
});
