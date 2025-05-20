import { db } from "@/db";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import * as yup from "yup";

export const calculatePromoValidationSchema = yup.object({
  resto_sales_temporary: yup.object({
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
    sales_details: yup
      .array()
      .of(
        yup.object().shape({
          product_id: yup
            .number()
            .required("Produk wajib diisi")
            .typeError("Produk wajib diisi dengan karakter yang valid")
            .test(
              "is-product-exists",
              "Produk tidak terdaftar dalam sistem",
              async function (productId) {
                const product = await db.query.products.findFirst({
                  where: (products, { eq }) =>
                    eq(products.id, BigInt(productId)),
                });

                if (!product) return false;
                return true;
              },
            ),
          qty: yup
            .number()
            .required("Kuantitas produk wajib diisi")
            .typeError("Kuantitas produk wajib diisi dengan angka yang valid")
            .min(0, "Kuantitas produk tidak boleh kurang dari 0"),
          product_name: yup
            .string()
            .typeError("Nama produk wajib diisi dengan karakter yang valid")
            .required("Nama produk wajib diisi"),
          price: yup
            .number()
            .required("Harga produk wajib diisi")
            .typeError("Harga produk wajib diisi dengan angka yang valid"),
          note: yup
            .string()
            .typeError("Catatan wajib diisi dengan karakter yang valid")
            .nullable(),
        }),
      )
      .test(
        "at-least-one-qty-valid",
        "Setidaknya harus membayar minimal 1 produk.",
        function (items) {
          if (!items || !Array.isArray(items)) return false;
          return items.some((item) => item.qty && item.qty >= 1);
        },
      )
      .required("Item tagihan wajib diisi")
      .min(1, "Wajib membayar setidaknya 1 item produk"),
    discount_amount: yup
      .number()
      .typeError("Jumlah diskon wajib diisi dengan angka yang valid")
      .required("Jumlah diskon wajib diisi"),
    discount_percent: yup
      .number()
      .typeError("Persen diskon wajib diisi dengan angka yang valid")
      .required("Persen diskon wajib diisi"),
    tax_amount: yup
      .number()
      .typeError("Jumlah pajak wajib diisi dengan angka yang valid")
      .required("Jumlah pajak wajib diisi"),
    tax_percent: yup
      .number()
      .typeError("Persen pajak wajib diisi dengan angka yang valid")
      .required("Persen pajak wajib diisi"),
    total_net: yup
      .number()
      .typeError("Total penjualan bersih diisi dengan angka yang valid")
      .required("Total penjualan bersih diisi"),
    total_gross: yup
      .number()
      .typeError("Total penjualan kotor wajib diisi dengan angka yang valid")
      .required("Total penjualan kotor wajib diisi"),
    grand_total: yup
      .number()
      .typeError("Total keseluruhan wajib diisi dengan angka yang valid")
      .required("Total keseluruhan wajib diisi"),
  }),
  promo_code: yup
    .string()
    .typeError("Kode promo wajib diisi dengan karkter yang valid")
    .required("Kode promo wajib diisi")
    .test({
      name: "is-promo-code-exist",
      skipAbsent: true,
      async test(promoCode) {
        const { promo } = await getValidPromo(promoCode);

        if (!promo) return false;
        return true;
      },
      message:
        "Kode promo yang dimasukkan tidak valid atau sudah tidak berlaku, silahkan masukkan kode promo yang lain",
    }),
});
