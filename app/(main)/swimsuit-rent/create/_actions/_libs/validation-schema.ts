import { db } from "@/db";
import * as yup from "yup";

export const validationSchema = yup.object({
  // TODO: check is wristband code in use and valid
  wristband_code: yup
    .string()
    .max(255, "Nama pelanggan tidak boleh lebih dari 255 karakter"),
  customer_name: yup
    .string()
    .max(255, "Nama pelanggan tidak boleh lebih dari 255 karakter")
    .required("Nama pelanggan wajib diisi"),
  customer_phone_number: yup
    .string()
    .max(15, "Nomor telfon pelanggan tidak boleh lebih dari 15 karakter"),
  sales_details: yup
    .array()
    .of(
      yup.object().shape({
        product_id: yup
          .number()
          .typeError("Produk wajib dipilih dengan pilihan yang valid")
          .required("Produk wajib diisi")
          .test({
            name: "is-product-exists",
            skipAbsent: true,
            async test(id) {
              if (!id) return true;

              const product = await db.query.products.findFirst({
                where: (products, { eq }) => eq(products.id, BigInt(id)),
              });

              if (!product) return false;

              return true;
            },
            message: "Produk tidak ditemukan",
          })
          .test({
            name: "is-product-sufficient",
            skipAbsent: true,
            async test(id) {
              if (!id) return true;

              const product = await db.query.products.findFirst({
                where: (products, { eq }) => eq(products.id, BigInt(id)),
                with: {
                  stockSwimsuitRent: true,
                },
              });

              if (!product || !product.stockSwimsuitRent) {
                return this.createError({
                  message: `Produk tidak ditemukan.`,
                });
              }

              const selectedProductQty = this.parent.qty;
              const availableStock = Number(product.stockSwimsuitRent.qty);

              if (availableStock < selectedProductQty) {
                return this.createError({
                  message: `Stok untuk produk ${product.name} tidak mencukupi.`,
                });
              }

              return true;
            },
          }),
        qty: yup
          .number()
          .typeError("Kuantitas wajib diisi dengan angka yang valid")
          .required("Kuantitas wajib diisi"),
        price: yup
          .number()
          .typeError("Harga satuan wajib diisi dengan angka yang valid")
          .required("Harga satuan wajib diisi"),
        note: yup
          .string()
          .typeError("Catatan wajib diisi dengan karakter yang valid")
          .nullable(),
      }),
    )
    .required("Detail penjualan wajib diisi")
    .min(1, "Wajib memilih setidaknya 1 produk untuk dipesan"),
});
