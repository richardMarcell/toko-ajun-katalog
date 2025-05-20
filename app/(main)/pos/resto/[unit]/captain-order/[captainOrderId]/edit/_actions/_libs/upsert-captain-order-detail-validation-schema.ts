import { db } from "@/db";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { ProductStockTypeEnum } from "@/lib/enums/ProductStockTypeEnum";
import { CaptainOrderDetail } from "@/types/captain-order-detail";
import * as yup from "yup";

export const upsertCaptainOrderDetailValidationSchema = yup.object({
  captain_order_detail_id: yup
    .number()
    .nullable()
    .typeError("ID Captain order detail wajib diisi dengan karakter yang valid")
    .test(
      "is-captain-order-detail-exists",
      "Captain order detail tidak terdaftar dalam sistem",
      async function (captainOrderDetailId) {
        if (!captainOrderDetailId) return true;

        const captainOrderDetail =
          await getCaptainOrderDetail(captainOrderDetailId);

        if (!captainOrderDetail) return false;
        return true;
      },
    ),
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
        const captainOrderDetailId = this.parent.captain_order_detail_id;
        if (!captainOrderDetailId && productQty < 1) return false;

        const captainOrderDetail =
          await getCaptainOrderDetail(captainOrderDetailId);

        if (!captainOrderDetail && productQty < 1) return false;

        return true;
      },
    )
    .test("is-product-sufficient", async function (productQty) {
      const productId = this.parent.product_id;

      const stock = await db.query.stocks.findFirst({
        where: (stocks, { eq, and }) =>
          and(
            eq(stocks.product_id, BigInt(productId)),
            eq(
              stocks.warehouse_id,
              SateliteUnitConfig.resto_patio.warehouse_id,
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

      const selectedProductQty = productQty;
      const availableStock = Number(stock.qty);

      if (availableStock < selectedProductQty) {
        return this.createError({
          message: `Stok untuk produk ${stock.product.name} tidak mencukupi.`,
        });
      }

      return true;
    }),
  note: yup
    .string()
    .typeError("Catatan wajib diisi dengan karakter yang valid")
    .nullable(),
  authorization_code: yup
    .string()
    .typeError("Catatan wajib diisi dengan karakter yang valid")
    .nullable()
    .test("is-authorization-code-valid", async function (code) {
      const captainOrderDetailId = this.parent.captain_order_detail_id;
      if (!captainOrderDetailId) return true;

      const DEFAULT_AUTHORIZATION_CODE = "123456";
      const productQty = this.parent.qty;

      const captainOrderDetail =
        await getCaptainOrderDetail(captainOrderDetailId);

      if (!captainOrderDetail) return true;

      if (captainOrderDetail.qty > productQty) {
        if (!code) {
          return this.createError({
            message: `Kode autorisasi wajib diisi.`,
          });
        }

        if (code.length < 6) {
          return this.createError({
            message: `Kode autorisasi wajib diisi dengan 6 karakter.`,
          });
        }

        if (code !== DEFAULT_AUTHORIZATION_CODE) {
          return this.createError({
            message: `Kode yang dimasukkan tidak valid.`,
          });
        }
      }

      return true;
    }),
});

async function getCaptainOrderDetail(
  captainOrderDetailId: number,
): Promise<CaptainOrderDetail | null> {
  if (!captainOrderDetailId) return null;

  const captainOrderDetail = await db.query.captainOrderDetails.findFirst({
    where: (captainOrderDetails, { eq }) =>
      eq(captainOrderDetails.id, BigInt(captainOrderDetailId)),
  });

  if (!captainOrderDetail) return null;

  return captainOrderDetail;
}
