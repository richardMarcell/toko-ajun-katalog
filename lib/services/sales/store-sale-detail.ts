import { salesDetails as salesDetailsSchema } from "@/db/schema";
import { ProductConfig } from "@/lib/config/product-config";
import { OrderStatusEnum } from "@/lib/enums/OrderStatusEnum";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { DatabaseTransaction } from "@/types/db-transaction";
import { eq } from "drizzle-orm";

type SaleDetail = {
  product_id: number;
  is_required_tax: boolean;
  qty: number;
  price: number;
  subtotal: number;
  discount_percent_sale: number;
  discount_percent_detail: number;
  discount_amount_sale: number;
  discount_amount_detail: number;
  total_net: number;
  tax_percent: number;
  tax_amount: number;
  total_final: number;
  note?: string | null;
  specialItemExtras?: string | null;
};

export async function storeSalesDetail({
  salesId,
  salesDetails,
  sateliteConfig,
  tx,
}: {
  salesId: bigint;
  salesDetails: SaleDetail[];
  sateliteConfig: {
    unit_business: UnitBusinessSateliteQubuEnum;
    warehouse_id: string;
  };
  tx: DatabaseTransaction;
}) {
  const cashQProductIds = [ProductConfig.wristband.id, ProductConfig.top_up.id];
  for (const detail of salesDetails) {
    const saleDetailStored = await tx
      .insert(salesDetailsSchema)
      .values({
        sales_id: salesId,
        product_id: BigInt(detail.product_id),
        warehouse_id: sateliteConfig.warehouse_id,
        qty: detail.qty,
        price: detail.price.toString(),
        subtotal: detail.subtotal.toString(),
        subject_to_tax: detail.is_required_tax,
        discount_percent_sale: detail.discount_percent_sale,
        discount_amount_sale: detail.discount_amount_sale.toString(),
        discount_percent_detail: detail.discount_percent_detail,
        discount_amount_detail: detail.discount_amount_detail.toString(),
        tax_percent: detail.tax_percent,
        tax_amount: detail.tax_amount.toString(),
        total_net: detail.total_net.toString(),
        total_final: detail.total_final.toString(),
        note: detail.note ? detail.note : null,
      })
      .$returningId();
    const saleDetailId = saleDetailStored[0].id;

    const isFoodCorner =
      sateliteConfig.unit_business === UnitBusinessSateliteQubuEnum.FOOD_CORNER;
    const isCashQProduct = cashQProductIds.includes(BigInt(detail.product_id));
    const isDimsum =
      sateliteConfig.unit_business === UnitBusinessSateliteQubuEnum.DIMSUM;
    const isRestoPatio =
      sateliteConfig.unit_business === UnitBusinessSateliteQubuEnum.RESTO_PATIO;

    if (isFoodCorner)
      await updateOrderStatusToPreparing({
        saleDetailId,
        tx,
      });

    if (isCashQProduct) await updateFlaggingSendToScm({ saleDetailId, tx });

    if (isDimsum || isRestoPatio)
      await updateSaleDetailWithSpecialItem({
        saleDetailData: detail,
        saleDetailId,
        tx,
      });
  }
}

async function updateOrderStatusToPreparing({
  saleDetailId,
  tx,
}: {
  saleDetailId: bigint;
  tx: DatabaseTransaction;
}) {
  await tx
    .update(salesDetailsSchema)
    .set({
      order_status: OrderStatusEnum.PREPARING,
    })
    .where(eq(salesDetailsSchema.id, saleDetailId));
}

async function updateFlaggingSendToScm({
  saleDetailId,
  tx,
}: {
  saleDetailId: bigint;
  tx: DatabaseTransaction;
}) {
  await tx
    .update(salesDetailsSchema)
    .set({
      is_send_to_scm: false,
    })
    .where(eq(salesDetailsSchema.id, saleDetailId));
}

async function updateSaleDetailWithSpecialItem({
  saleDetailData,
  saleDetailId,
  tx,
}: {
  saleDetailData: SaleDetail;
  saleDetailId: bigint;
  tx: DatabaseTransaction;
}) {
  await tx
    .update(salesDetailsSchema)
    .set({
      note: saleDetailData.note ? saleDetailData.note : null,
      extras: saleDetailData.specialItemExtras
        ? saleDetailData.specialItemExtras
        : null,
    })
    .where(eq(salesDetailsSchema.id, saleDetailId));
}
