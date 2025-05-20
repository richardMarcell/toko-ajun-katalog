import { db } from "@/db";
import { sales, walletHistories, wallets } from "@/db/schema";
import {
  getPaymentMethodCase,
  PaymentMethodEnum,
} from "@/lib/enums/PaymentMethodEnum";
import { ReceiptFootnoteAlignEnum } from "@/lib/enums/ReceiptFootnoteAlignEnum";
import { ReceiptFootnoteEnum } from "@/lib/enums/ReceiptFootnoteEnum";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import getReceiptFootnote from "@/lib/services/print-receipt/get-receipt-footnote";
import mapSaleReceipt from "@/lib/services/print-receipt/map-sale-receipt";
import { SaleReceipt } from "@/types/sale-receipt";
import { and, eq } from "drizzle-orm";

export default async function getSaleReceipt({
  salesId,
}: {
  salesId: bigint;
}): Promise<{ saleReceipt: SaleReceipt | null }> {
  const sale = await db.query.sales.findFirst({
    with: {
      salesDetails: {
        with: { product: { columns: { description: true } } },
        columns: { qty: true, total_final: true },
      },
      user: { columns: { name: true } },
      payments: true,
    },
    where: eq(sales.id, salesId!),
    columns: {
      id: true,
      code: true,
      total_gross: true,
      discount_amount: true,
      tax_amount: true,
      grand_total: true,
      created_at: true,
      unit_business: true,
      print_count: true,
    },
  });

  if (!sale) return { saleReceipt: null };

  const walletHistoryDeposit = await db.query.walletHistories.findFirst({
    where: and(
      eq(walletHistories.sale_id, sale.id),
      eq(walletHistories.transaction_type, WalletTransactionTypeEnum.DEPOSIT),
    ),
  });

  if (!walletHistoryDeposit) return { saleReceipt: null };

  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.id, walletHistoryDeposit.wallet_id),
  });

  if (!wallet) return { saleReceipt: null };

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
    customer_name: wallet.customer_name,
    footnote: getReceiptFootnote({
      type: ReceiptFootnoteEnum.I_ACKNOWLEDGE_AND_AGREE,
    }),
    footnote_align: ReceiptFootnoteAlignEnum.CENTER,
  };

  return { saleReceipt: saleReceiptWithAdditional };
}
