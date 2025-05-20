import { db } from "@/db";
import { CaptainOrderComplimentEnum } from "@/lib/enums/CaptainOrderComplimentEnum";
import { CaptainOrderMealTimeEnum } from "@/lib/enums/CaptainOrderMealTimeEnum";
import { OrderTypeEnum } from "@/lib/enums/OrderTypeEnum";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { and } from "drizzle-orm";
import * as yup from "yup";

export const validationSchema = yup.object({
  table_id: yup
    .number()
    .required("Nomor meja wajib dipilih")
    .typeError("Nomor meja wajib dipilih dengan pilihan yang valid")
    .test(
      "is-table-exists",
      "Nomor meja tidak terdaftar dalam sistem",
      async function (tableId) {
        if (!tableId) return true;

        const table = await db.query.tables.findFirst({
          where: (tables, { eq }) =>
            and(
              eq(tables.id, BigInt(tableId)),
              eq(tables.unit_business, UnitBusinessSateliteQubuEnum.DIMSUM),
            ),
        });

        if (!table) return false;
        return true;
      },
    ),
  meal_time: yup
    .string()
    .typeError("Meal times wajib dipilih dengan pilihan yang valid")
    .oneOf(
      Object.values(CaptainOrderMealTimeEnum),
      "Meal times yang diterima hanya Breakfast, Lunch, Dinner dan Coffee Break",
    )
    .required("Meal times wajib dipilih"),
  compliment: yup
    .string()
    .typeError("Compliment wajib dipilih dengan pilihan yang valid")
    .oneOf(
      Object.values(CaptainOrderComplimentEnum),
      "Compliment yang diterima hanya None dan Marketing",
    )
    .required("Compliment wajib dipilih"),
  order_type: yup
    .string()
    .typeError("Tipe pesanan wajib dipilih dengan pilihan yang valid")
    .oneOf(
      Object.values(OrderTypeEnum),
      "Tipe pesanan yang diterima hanya Dine In dan Take Away",
    )
    .required("Tipe pesanan wajib dipilih"),
  outlet: yup
    .string()
    .typeError("Outlet wajib dipilih dengan pilihan yang valid")
    .oneOf(["DIMSUM"], "Outlet yang diterima hanya Dimsum")
    .required("Outlet wajib dipilih"),
  customer_adult_count: yup
    .number()
    .required("Jumlah orang dewasa wajib diisi")
    .typeError("Jumlah orang dewasa wajib diisi dengan angka yang valid")
    .min(0, "Jumlah orang dewasa minimal adalah 0")
    .test(
      "is-count-valid",
      "Jumlah orang dewasa wajib diisi jika tidak ada pelanggan anak-anak",
      function (adultCount) {
        const childrenCount = this.parent.customer_child_count;

        if (childrenCount < 1 && adultCount < 1) return false;
        else return true;
      },
    ),
  customer_child_count: yup
    .number()
    .required("Jumlah anak-anak wajib diisi")
    .typeError("Jumlah anak-anak wajib diisi dengan angka yang valid")
    .min(0, "Jumlah anak-anak minimal adalah 0")
    .test(
      "is-count-valid",
      "Jumlah anak-anak wajib diisi jika tidak ada pelanggan orang dewasa",
      function (childrenCount) {
        const adultCount = this.parent.customer_adult_count;

        if (childrenCount < 1 && adultCount < 1) return false;
        else return true;
      },
    ),
  customer_name: yup
    .string()
    .typeError("Nama pelanggan wajib diisi dengan karakter yang valid")
    .required("Nama pelanggan wajib diisi"),
});
