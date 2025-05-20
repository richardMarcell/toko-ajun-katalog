import { db } from "@/db";
import { PromoTypeEnum } from "@/lib/enums/PromoTypeEnum";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import * as yup from "yup";

export const storeDimsumSalesTemporaryValidationSchema = yup.object({
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
  promo_code: yup
    .string()
    .typeError("Kode promo wajib diisi dengan karakter yang valid")
    .nullable()
    .test({
      name: "is-promo-code-exist",
      skipAbsent: true,
      async test(promoCode) {
        if (!promoCode) return true;

        const { promo } = await getValidPromo(promoCode);

        if (!promo) return false;
        if (promo.type !== PromoTypeEnum.PERCENTAGE) return false;

        return true;
      },
      message:
        "Kode promo yang dimasukkan tidak valid atau sudah tidak berlaku, silahkan masukkan kode promo yang lain",
    }),
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
});
