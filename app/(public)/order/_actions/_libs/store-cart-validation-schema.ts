import { db } from "@/db";
import * as yup from "yup";

export const storeCartValidationSchema = yup.object({
  product_id: yup
    .number()
    .required("Produk wajib diisi")
    .typeError("Produk wajib diisi dengan karakter yang valid")
    .test(
      "is-product-exists",
      "Produk tidak terdaftar dalam sistem",
      async function (productId) {
        const product = await db.query.products.findFirst({
          where: (products, { eq }) => eq(products.id, BigInt(productId)),
        });

        if (!product) return false;
        return true;
      },
    ),
  qty: yup
    .number()
    .required("Kuantitas produk wajib diisi")
    .typeError("Kuantitas produk wajib diisi dengan angka yang valid")
    .test(
      "is-product-qty-valid",
      "Minimal kuantitas produk adalah 1 agar bisa ditambahkan ke pesanan.",
      async function (productQty) {
        if (productQty < 1) return false;

        return true;
      },
    ),
  note: yup
    .string()
    .typeError("Catatan wajib diisi dengan karakter yang valid")
    .nullable(),
});
