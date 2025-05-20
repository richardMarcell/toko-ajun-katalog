import { db } from "@/db";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { SalesStatusEnum } from "@/lib/enums/SalesStatusEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { SaleWithRelations } from "@/types/domains/pos/food-corner/sales/list";

export async function getSales() {
  const sales = (await db.query.sales.findMany({
    with: {
      salesDetails: {
        columns: {
          id: true,
          qty: true,
          subtotal: true,
        },
        with: {
          product: {
            columns: {
              name: true,
            },
          },
        },
        limit: 4,
      },
      salesFoodCorner: {
        columns: {
          id: true,
          table_number: true,
          order_number: true,
          order_type: true,
        },
      },
    },
    columns: {
      id: true,
      code: true,
      sales_status: true,
      discount_amount: true,
      tax_amount: true,
      grand_total: true,
      created_at: true,
    },
    where: (sales, { eq, and }) =>
      and(
        eq(sales.unit_business, SateliteUnitConfig.food_corner.unit_business),
        eq(sales.transaction_type, SalesTransactionTypeEnum.FOOD_CORNER_SALE),
        eq(sales.sales_status, SalesStatusEnum.CLOSED),
      ),
  })) as SaleWithRelations[];

  const salesMapped = sales.map((sale) => ({
    id: Number(sale.id),
    code: sale.code,
    sales_status: sale.sales_status,
    discount_amount: sale.discount_amount,
    tax_amount: sale.tax_amount,
    grand_total: sale.grand_total,
    created_at: sale.created_at,
    table_number: sale?.salesFoodCorner?.table_number ?? "-",
    order_number: sale.salesFoodCorner?.order_number ?? "-",
    order_type: sale.salesFoodCorner?.order_type ?? "-",
    sales_details: sale.salesDetails.map((detail) => ({
      product_name: detail.product.name,
      qty: detail.qty,
      subtotal: detail.subtotal,
    })),
  }));

  return {
    sales: salesMapped,
  };
}
