import { db } from "@/db";
import * as yup from "yup";

export const storeSpecialItemValidationSchema = yup.object({
  captain_order_id: yup
    .number()
    .required("ID Captain order wajib diisi")
    .typeError("ID Captain order wajib diisi dengan karakter yang valid")
    .test(
      "is-captain-order-exists",
      "Captain order tidak terdaftar dalam sistem",
      async function (captainOrderId) {
        const captainOrder = await db.query.captainOrders.findFirst({
          where: (captainOrders, { eq }) =>
            eq(captainOrders.id, BigInt(captainOrderId)),
        });

        if (!captainOrder) return false;
        return true;
      },
    ),
  name: yup
    .string()
    .typeError("Nama produk wajib diisi dengan karakter yang valid")
    .required("Nama produk wajib diisi"),
  qty: yup
    .number()
    .required("Kuantitas produk wajib diisi")
    .typeError("Kuantitas produk wajib diisi dengan angka yang valid")
    .min(1, "Kuantitas produk tidak boleh kurang dari 1"),
  price: yup
    .number()
    .min(1, "Harga produk tidak boleh kurang dari Rp 0")
    .required("Harga produk wajib diisi")
    .typeError("Harga produk wajib diisi dengan angka yang valid"),
  note: yup
    .string()
    .typeError("Catatan wajib diisi dengan karakter yang valid")
    .nullable(),
});
