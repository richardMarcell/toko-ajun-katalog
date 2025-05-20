import { db } from "@/db";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import mapSaleReceipt from "@/lib/services/print-receipt/map-sale-receipt";
import { SaleReceipt } from "@/types/sale-receipt";

export async function getSale({ salesId }: { salesId: bigint }): Promise<{
  saleReceipt: SaleReceipt | null;
}> {
  const sale = await db.query.sales.findFirst({
    with: {
      captainOrder: {
        columns: {
          customer_name: true,
        },
      },
      salesDetails: {
        columns: {
          product_id: true,
          qty: true,
          price: true,
          total_final: true,
          extras: true,
        },
        with: {
          product: {
            columns: {
              name: true,
            },
          },
        },
      },
      payments: true,
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
        eq(sales.unit_business, SateliteUnitConfig.dimsum.unit_business),
        eq(sales.transaction_type, SalesTransactionTypeEnum.DIMSUM_SALE),
      ),
  });

  if (!sale)
    return {
      saleReceipt: null,
    };

  const recomposeSale = {
    ...sale,
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
  };

  const saleReceipt = mapSaleReceipt({ sale: recomposeSale });

  const saleReceiptWithAdditional = {
    ...saleReceipt,
    customer_name: sale.captainOrder?.customer_name ?? "",
  };

  return {
    saleReceipt: saleReceiptWithAdditional,
  };
}
