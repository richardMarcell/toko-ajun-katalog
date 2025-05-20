import { db } from "@/db";
import { getDateStartTime, removeDateTimezone } from "@/lib/utils";
import * as yup from "yup";

const today = removeDateTimezone(getDateStartTime());

export const updateDetailDataValidationSchema = yup.object({
  entry_pass_customer_id: yup
    .number()
    .required("entry_pass_customer_id wajib disertakan")
    .test({
      name: "is-id-exists",
      skipAbsent: true,
      async test(id) {
        if (!id) return false;

        const entryPassCustomer = await db.query.entryPassCustomers.findFirst({
          where: (entryPassCustomers, { eq }) =>
            eq(entryPassCustomers.id, BigInt(id)),
        });

        if (!entryPassCustomer) return false;

        return true;
      },
      message: "Data Customer dari ID yang Dikirimkan Tidak Ditemukan",
    }),
  product_id: yup
    .string()
    .typeError("Nomor Hp wajib diisi dengan karakter yang valid")
    .required("Tipe Kelas wajib dipilih")
    .test({
      name: "is-product-exists",
      skipAbsent: true,
      async test(productId) {
        if (!productId) return false;

        const product = await db.query.products.findFirst({
          where: (products, { eq }) => eq(products.id, BigInt(productId)),
        });

        if (product) return true;

        return false;
      },
      message:
        "Tipe yang dipilih tidak valid atau tidak terdaftar dalam sistem",
    }),
  registered_at: yup
    .date()
    .typeError("Tanggal pendaftaran wajib diisi dengan format yang valid")
    .min(today, "Tanggal pendaftaran tidak boleh kurang dari hari ini")
    .required("Tanggal pendaftaran wajib diisi"),
});
