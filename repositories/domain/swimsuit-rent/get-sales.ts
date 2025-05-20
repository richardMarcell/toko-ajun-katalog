import { db } from "@/db";
import {
  sales,
  salesDetails,
  salesSwimsuitRent,
  swimsuitRentWallet,
} from "@/db/schema";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { SwimsuitRentReturnStatusEnum } from "@/lib/enums/SwimsuitRentReturnStatusEnum";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { and, eq, sql } from "drizzle-orm";

export async function getSales({ wristbandCode }: { wristbandCode: string }) {
  const saleList = await db
    .select({
      id: sales.id,
      code: sales.code,
      created_at: sales.created_at,
      wristband_code: salesSwimsuitRent.wristband_code,
      customer_name: salesSwimsuitRent.customer_name,
      customer_phone_number: salesSwimsuitRent.customer_phone_number,
      is_has_item_not_returned: sql<boolean>`(
        SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
        FROM ${salesDetails} AS saleDetail
        JOIN ${swimsuitRentWallet} AS swimsuitRentWallet ON swimsuitRentWallet.sales_detail_id = saleDetail.id
        WHERE saleDetail.sales_id = ${sales.id}
          AND swimsuitRentWallet.return_status = ${SwimsuitRentReturnStatusEnum.NOT_RETURNED}
      )`,
    })
    .from(sales)
    .leftJoin(salesSwimsuitRent, eq(salesSwimsuitRent.sales_id, sales.id))
    .where(
      and(
        wristbandCode
          ? eq(salesSwimsuitRent.wristband_code, wristbandCode)
          : undefined,
        eq(sales.unit_business, UnitBusinessSateliteQubuEnum.LOCKER),
        eq(sales.transaction_type, SalesTransactionTypeEnum.SWIMSUIT_RENT),
      ),
    );

  const salesMapped = saleList.map((sale) => ({
    id: sale.id,
    code: sale.code,
    created_at: sale.created_at,
    wristband_code: sale?.wristband_code ?? "-",
    customer_name: sale?.customer_name ?? "-",
    customer_phone_number: sale?.customer_phone_number ?? "-",
    is_has_item_not_returned: sale.is_has_item_not_returned,
  }));

  return {
    sales: salesMapped,
  };
}
