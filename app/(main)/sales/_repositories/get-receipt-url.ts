import { db } from "@/db";
import { walletHistories } from "@/db/schema";
import saleReceiptUrlConfig from "@/lib/config/sale-receipt-url-config";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { Sale } from "@/types/sale";
import { eq } from "drizzle-orm";

const transactionTypeRequiredWalletId: string[] = [
  SalesTransactionTypeEnum.BINDING_CASHQ,
  SalesTransactionTypeEnum.TOP_UP,
  SalesTransactionTypeEnum.LOCKER_RENT,
  SalesTransactionTypeEnum.GAZEBO_RENT,
];

const transactionTypeRequiredCaptainOrderId: string[] = [
  SalesTransactionTypeEnum.DIMSUM_SALE,
  SalesTransactionTypeEnum.RESTO_PATIO_SALE,
];

function fillUrlTemplate(
  template: string,
  params: Record<string, string | number>,
): string {
  return Object.entries(params).reduce(
    (url, [key, value]) => url.replace(`:${key}`, value.toString()),
    template,
  );
}

export default async function getReceiptUrl(
  sale: Sale,
): Promise<string | undefined> {
  const row = saleReceiptUrlConfig.find(
    (r) => r[0] === sale.unit_business && r[1] === sale.transaction_type,
  );

  if (!row) return undefined;

  if (transactionTypeRequiredWalletId.includes(sale.transaction_type)) {
    const walletHistory = await db.query.walletHistories.findFirst({
      where: eq(walletHistories.sale_id, sale.id),
    });

    if (!walletHistory) return undefined;
    const walletId = walletHistory.wallet_id.toString();

    return fillUrlTemplate(row[2], { walletId, id: sale.id.toString() });
  }

  if (
    sale.captain_order_id &&
    transactionTypeRequiredCaptainOrderId.includes(sale.transaction_type)
  ) {
    return fillUrlTemplate(row[2], {
      captainOrderId: sale.captain_order_id.toString(),
      id: sale.id.toString(),
    });
  }

  return row[2].replace(":id", sale.id.toString());
}
