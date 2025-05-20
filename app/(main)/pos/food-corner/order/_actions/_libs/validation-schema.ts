import { db } from "@/db";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { OrderTypeEnum } from "@/lib/enums/OrderTypeEnum";
import { ProductStockTypeEnum } from "@/lib/enums/ProductStockTypeEnum";
import * as yup from "yup";

export const validationSchema = yup.object({
  table_number: yup
    .string()
    .typeError("Nomor meja wajib dipilih dengan pilihan yang valid")
    .test(
      "is-required",
      "Nomor meja wajib dipilih ketika tipe pesanan adalah DINE IN",
      function (value) {
        const orderType = this.parent.order_type;

        if (orderType === OrderTypeEnum.DINE_IN) return !!value;

        return true;
      },
    )
    .nullable(),
  order_type: yup
    .string()
    .oneOf(
      ["DINE IN", "TAKE AWAY"],
      "Tipe pesanan yang diterima hanya Dine In dan Take Away",
    )
    .required("Tipe pesanan wajib dipilih"),
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

              const stock = await db.query.stocks.findFirst({
                where: (stocks, { eq, and }) =>
                  and(
                    eq(stocks.product_id, BigInt(id)),
                    eq(
                      stocks.warehouse_id,
                      SateliteUnitConfig.food_corner.warehouse_id,
                    ),
                  ),
                with: {
                  product: true,
                },
              });

              if (!stock || !stock.product) {
                return this.createError({
                  message: `Produk tidak ditemukan.`,
                });
              }

              if (stock.product.stock_type === ProductStockTypeEnum.NON_STOCK)
                return true;

              const selectedProductQty = this.parent.qty;
              const availableStock = Number(stock.qty);

              if (availableStock < selectedProductQty) {
                return this.createError({
                  message: `Stok untuk produk ${stock.product.name} tidak mencukupi.`,
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
