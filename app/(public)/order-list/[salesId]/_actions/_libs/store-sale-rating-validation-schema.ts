import { db } from "@/db";
import * as yup from "yup";

export const storeSaleRatingValidationSchema = yup.object({
  sale_id: yup
    .number()
    .required("Sales ID wajib diisi")
    .typeError("Sales ID wajib diisi dengan karakter yang valid")
    .test(
      "is-sales-exists",
      "Sales tidak terdaftar dalam sistem",
      async function (salesId) {
        const sales = await db.query.sales.findFirst({
          where: (sales, { eq }) => eq(sales.id, BigInt(salesId)),
        });

        if (!sales) return false;
        return true;
      },
    ),
  rating: yup
    .number()
    .required("Rating wajib diisi")
    .min(1, "Rating minimal 1")
    .max(5, "Rating maksimal 5"),
  comment: yup
    .string()
    .typeError("Komentar wajib diisi dengan karakter yang valid")
    .nullable(),
});
