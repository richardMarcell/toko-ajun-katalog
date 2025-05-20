import { db } from "@/db";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import { ReceiptFootnoteAlignEnum } from "@/lib/enums/ReceiptFootnoteAlignEnum";
import { ReceiptFootnoteEnum } from "@/lib/enums/ReceiptFootnoteEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import getReceiptFootnote from "@/lib/services/print-receipt/get-receipt-footnote";
import mapSaleReceipt from "@/lib/services/print-receipt/map-sale-receipt";
import { SaleReceipt } from "@/types/sale-receipt";

export async function getSale({ salesId }: { salesId: bigint }): Promise<{
  saleReceipt: SaleReceipt | null;
}> {
  const sale = await db.query.sales.findFirst({
    with: {
      salesTicket: {
        columns: {
          customer_name: true,
        },
      },
      salesDetails: {
        columns: {
          qty: true,
          price: true,
          total_final: true,
        },
        with: {
          product: {
            columns: {
              description: true,
            },
          },
        },
      },
      payments: {
        columns: {
          total_payment: true,
          change_amount: true,
          payment_method: true,
        },
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
        eq(
          sales.unit_business,
          SateliteUnitConfig.water_park_ticket.unit_business,
        ),
        eq(sales.transaction_type, SalesTransactionTypeEnum.TICKET_SALE),
      ),
  });

  if (!sale)
    return {
      saleReceipt: null,
    };

  const recomposeSales = {
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

  const saleReceipt = mapSaleReceipt({ sale: recomposeSales });

  const saleReceiptWithAdditional = {
    ...saleReceipt,
    customer_name: sale.salesTicket?.customer_name ?? "",
    footnote: getReceiptFootnote({
      type: ReceiptFootnoteEnum.I_ACKNOWLEDGE_AND_AGREE,
    }),
    footnote_align: ReceiptFootnoteAlignEnum.CENTER,
  };

  return {
    saleReceipt: saleReceiptWithAdditional,
  };
}
