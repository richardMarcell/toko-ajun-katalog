import { db } from "@/db";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import { SalesStatusEnum } from "@/lib/enums/SalesStatusEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { SaleWithRelations } from "@/types/domains/pos/food-corner/sales/detail";
export async function getSale(salesId: string) {
  const sale = (await db.query.sales.findFirst({
    with: {
      salesDetails: {
        with: {
          product: {
            with: {
              tenant: true,
            },
          },
        },
      },
      payments: true,
      salesFoodCorner: true,
    },
    where: (sales, { eq, and }) =>
      and(
        eq(sales.id, BigInt(salesId)),
        eq(sales.unit_business, SateliteUnitConfig.food_corner.unit_business),
        eq(sales.transaction_type, SalesTransactionTypeEnum.FOOD_CORNER_SALE),
        eq(sales.sales_status, SalesStatusEnum.CLOSED),
      ),
  })) as SaleWithRelations;

  if (!sale)
    return {
      sale: null,
    };

  const saleMapped = {
    id: Number(sale.id),
    code: sale.code,
    sales_status: sale.sales_status,
    discount_amount: sale.discount_amount,
    tax_amount: sale.tax_amount,
    payment_method: sale.payments
      .map((payment) =>
        getPaymentMethodCase(payment.payment_method as PaymentMethodEnum),
      )
      .join(", "),
    total_gross: sale.total_gross,
    total_net: sale.total_net,
    grand_total: sale.grand_total,
    created_at: sale.created_at,
    table_number: sale.salesFoodCorner.table_number,
    order_number: sale.salesFoodCorner.order_number,
    order_type: sale.salesFoodCorner.order_type,
    sales_details: sale.salesDetails.map((detail) => ({
      product_name: detail.product.name,
      product_image: detail.product.image,
      product_description: detail.product.description,
      tenant: detail.product.tenant.name,
      qty: detail.qty,
      subtotal: detail.subtotal,
      note: detail.note,
      order_status: detail.order_status,
    })),
  };

  return {
    sale: saleMapped,
  };
}
