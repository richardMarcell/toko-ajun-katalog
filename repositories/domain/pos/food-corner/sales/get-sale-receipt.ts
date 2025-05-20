import { db } from "@/db";
import { products, salesDetails, tenants } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import mapSaleReceipt from "@/lib/services/print-receipt/map-sale-receipt";
import { Product, Sale } from "@/types/domains/pos/food-corner/sales/receipt";
import { SaleReceipt } from "@/types/sale-receipt";
import { eq, sql } from "drizzle-orm";

export async function getSaleReceipt({
  salesId,
}: {
  salesId: bigint;
}): Promise<{
  sale: Sale | null;
  saleReceipt: SaleReceipt | null;
}> {
  const sale = await db.query.sales.findFirst({
    with: {
      salesFoodCorner: {
        columns: {
          table_number: true,
        },
      },
      payments: true,
      salesDetails: {
        with: { product: { columns: { name: true } } },
        columns: { qty: true, total_final: true },
      },
      user: {
        columns: {
          name: true,
        },
      },
    },
    columns: {
      id: true,
      code: true,
      created_at: true,
      total_gross: true,
      discount_amount: true,
      total_net: true,
      tax_amount: true,
      grand_total: true,
      unit_business: true,
      print_count: true,
    },
    where: (sales, { eq, and }) =>
      and(
        eq(sales.id, salesId),
        eq(sales.unit_business, SateliteUnitConfig.food_corner.unit_business),
        eq(sales.transaction_type, SalesTransactionTypeEnum.FOOD_CORNER_SALE),
      ),
  });

  if (!sale)
    return {
      sale: null,
      saleReceipt: null,
    };

  const recomposeSale = {
    ...sale,
    table_number: sale?.salesFoodCorner?.table_number ?? "-",
    total_gross: sale.total_gross,
    discount_amount: sale.discount_amount,
    total_net: sale.total_net,
    tax_amount: sale.tax_amount,
    grand_total: sale.grand_total,
    payment_method: sale.payments
      .map((payment) =>
        getPaymentMethodCase(payment.payment_method as PaymentMethodEnum),
      )
      .join(", "),
    total_payment: sale.payments
      .reduce(
        (totalPayment, payment) => totalPayment + Number(payment.total_payment),
        0,
      )
      .toString(),
    change_amount: sale.payments
      .reduce(
        (totalPayment, payment) => totalPayment + Number(payment.change_amount),
        0,
      )
      .toString(),
    unit_business: sale.unit_business,
    created_at: sale.created_at,
  };

  const salesDetailsData = await db
    .select({
      tenant: tenants.name,
      products: sql`JSON_ARRAYAGG(
      JSON_OBJECT(
        'name', ${products.name},
        'price', ${salesDetails.price},
        'qty', ${salesDetails.qty},
        'subtotal', ${salesDetails.subtotal}
      )
    )`.as("products"),
    })
    .from(salesDetails)
    .where(eq(salesDetails.sales_id, salesId))
    .leftJoin(products, eq(salesDetails.product_id, products.id))
    .leftJoin(tenants, eq(products.fc_tenant_id, tenants.id))
    .groupBy(tenants.name);

  const recomposeSaleDetails = salesDetailsData.map((detail) => ({
    tenant: detail.tenant ? detail.tenant : "-",
    products: detail.products ? (detail.products as Product[]) : [],
  }));

  const saleReceipt = mapSaleReceipt({ sale: recomposeSale });

  const saleReceiptWithAdditional = {
    ...saleReceipt,
    table_number: sale?.salesFoodCorner?.table_number ?? "-",
  };

  return {
    sale: {
      ...recomposeSale,
      sales_details: recomposeSaleDetails,
    },
    saleReceipt: saleReceiptWithAdditional,
  };
}
